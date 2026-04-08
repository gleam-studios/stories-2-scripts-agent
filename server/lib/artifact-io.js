import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { workDir } from './manifest.js';

export async function readArtifact(slug, filename) {
  const p = join(workDir(slug), filename);
  try {
    const raw = await readFile(p, 'utf-8');
    if (filename.endsWith('.json')) return JSON.parse(raw);
    return raw;
  } catch {
    return null;
  }
}

export async function writeArtifact(slug, filename, data) {
  const dir = workDir(slug);
  await mkdir(dir, { recursive: true });
  const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  await writeFile(join(dir, filename), content, 'utf-8');
}

export async function readSourceText(slug) {
  const names = ['source.txt', 'source_raw.txt'];
  for (const name of names) {
    const result = await readArtifact(slug, name);
    if (result) return result;
  }
  return null;
}
