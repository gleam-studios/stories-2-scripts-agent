import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const AGENT_ROOT = join(import.meta.dirname, '..', '..');
const WORK_DIR = join(AGENT_ROOT, 'work');

export function workDir(slug) {
  return join(WORK_DIR, slug);
}

export async function readManifest(slug) {
  const p = join(workDir(slug), 'run_manifest.json');
  try {
    return JSON.parse(await readFile(p, 'utf-8'));
  } catch {
    return null;
  }
}

export async function writeManifest(slug, data) {
  const dir = workDir(slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'run_manifest.json'), JSON.stringify(data, null, 2), 'utf-8');
}

export async function completeStage(slug, stageId) {
  let manifest = await readManifest(slug);
  if (!manifest) {
    manifest = { project_slug: slug, completed_stages: [], artifacts: {} };
  }
  if (!manifest.completed_stages) manifest.completed_stages = [];
  if (!manifest.completed_stages.includes(stageId)) {
    manifest.completed_stages.push(stageId);
  }
  await writeManifest(slug, manifest);
  return manifest;
}

export async function setArtifact(slug, key, filename) {
  let manifest = await readManifest(slug);
  if (!manifest) {
    manifest = { project_slug: slug, completed_stages: [], artifacts: {} };
  }
  if (!manifest.artifacts) manifest.artifacts = {};
  manifest.artifacts[key] = filename;
  await writeManifest(slug, manifest);
}
