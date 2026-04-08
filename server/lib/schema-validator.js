import Ajv from 'ajv';
import { readFile } from 'fs/promises';
import { join } from 'path';

const AGENT_ROOT = join(import.meta.dirname, '..', '..');
const ajv = new Ajv({ allErrors: true, strict: false });

const schemaCache = new Map();

export async function loadSchema(stageId) {
  if (schemaCache.has(stageId)) return schemaCache.get(stageId);
  const p = join(AGENT_ROOT, 'skills', stageId, 'schema.json');
  try {
    const raw = await readFile(p, 'utf-8');
    const schema = JSON.parse(raw);
    const validate = ajv.compile(schema);
    schemaCache.set(stageId, validate);
    return validate;
  } catch {
    return null;
  }
}

export async function validateArtifact(stageId, data) {
  const validate = await loadSchema(stageId);
  if (!validate) return { valid: true, errors: null, note: 'no schema found, skipped' };
  const valid = validate(data);
  return { valid, errors: validate.errors };
}
