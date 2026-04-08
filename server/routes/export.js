import { Router } from 'express';
import { readFile } from 'fs/promises';
import { exportWord, getExportKinds } from '../lib/docx-export.js';
import { readManifest } from '../lib/manifest.js';

const router = Router();

router.get('/kinds', (_req, res) => {
  res.json(getExportKinds());
});

router.post('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { kinds } = req.body;
    const manifest = await readManifest(slug);
    const title = manifest?.project_title || slug;
    const results = await exportWord(slug, title, kinds || null);
    res.json({ ok: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/download/:slug/:filename', async (req, res) => {
  try {
    const { slug, filename } = req.params;
    const { workDir } = await import('../lib/manifest.js');
    const { join } = await import('path');
    const filePath = join(workDir(slug), 'export', filename);
    const buffer = await readFile(filePath);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.send(buffer);
  } catch (err) {
    res.status(404).json({ error: 'File not found' });
  }
});

export default router;
