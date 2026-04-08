import { readFile } from 'fs/promises';
import { join } from 'path';

const AGENT_ROOT = join(import.meta.dirname, '..', '..');

export async function loadPromptFile(relativePath) {
  const p = join(AGENT_ROOT, relativePath);
  try {
    return await readFile(p, 'utf-8');
  } catch {
    return null;
  }
}

export async function loadSubAgentPrompt(agentName) {
  return loadPromptFile(`prompts/子Agent/${agentName}.txt`);
}

export async function loadSkillDoc(stageId) {
  return loadPromptFile(`skills/${stageId}/SKILL.md`);
}

export async function loadRule(ruleFile) {
  return loadPromptFile(`rules/${ruleFile}`);
}
