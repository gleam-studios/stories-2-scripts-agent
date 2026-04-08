import { Router } from 'express';
import { readdir, stat, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import multer from 'multer';
import { readManifest, writeManifest, workDir } from '../lib/manifest.js';
import { getAllStages } from '../lib/stage-runner.js';

const router = Router();
const AGENT_ROOT = join(import.meta.dirname, '..', '..');
const WORK_DIR = join(AGENT_ROOT, 'work');

const upload = multer({ dest: join(AGENT_ROOT, '.uploads') });

router.get('/', async (_req, res) => {
  try {
    const entries = await readdir(WORK_DIR, { withFileTypes: true });
    const projects = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const slug = entry.name;
      const manifest = await readManifest(slug);
      const dir = join(WORK_DIR, slug);
      const st = await stat(dir);
      projects.push({
        slug,
        title: manifest?.project_title || slug,
        completedStages: manifest?.completed_stages || [],
        totalStages: 8,
        updatedAt: st.mtime,
      });
    }
    projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const manifest = await readManifest(slug);
  if (!manifest) return res.status(404).json({ error: 'project not found' });
  res.json(manifest);
});

router.post('/', upload.single('source'), async (req, res) => {
  try {
    const { slug, title, targetMarket, episodeCount, episodeDuration } = req.body;
    if (!slug) return res.status(400).json({ error: 'slug is required' });

    const dir = workDir(slug);
    await mkdir(dir, { recursive: true });

    if (req.file) {
      const { readFile: rf } = await import('fs/promises');
      const content = await rf(req.file.path, 'utf-8');
      await writeFile(join(dir, 'source.txt'), content, 'utf-8');
    }

    const manifest = {
      project_slug: slug,
      project_title: title || slug,
      target_market: targetMarket || 'NA-English',
      episode_count: episodeCount ? parseInt(episodeCount) : null,
      episode_duration: episodeDuration || '1-2 min',
      completed_stages: [],
      artifacts: {},
    };
    await writeManifest(slug, manifest);

    res.json(manifest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug/stages', async (req, res) => {
  const { slug } = req.params;
  const manifest = await readManifest(slug);
  const stages = getAllStages();
  const completed = manifest?.completed_stages || [];
  const result = stages.map((s) => ({
    ...s,
    completed: completed.includes(s.id),
  }));
  res.json(result);
});

export default router;
