import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { loadSubAgentPrompt, loadSkillDoc } from './prompt-loader.js';
import { readArtifact, writeArtifact, readSourceText } from './artifact-io.js';
import { validateArtifact } from './schema-validator.js';
import { completeStage, setArtifact } from './manifest.js';

const AGENT_ROOT = join(import.meta.dirname, '..', '..');
const SETTINGS_PATH = join(AGENT_ROOT, 'local_settings.json');

const STAGES = [
  {
    id: 'source-analysis',
    agent: '原文分析师',
    skillId: 'source-analysis',
    output: 'story_bible.json',
    artifactKey: 'story_bible',
    inputs: async (slug) => {
      const src = await readSourceText(slug);
      return src ? [{ role: 'source_text', content: truncateForContext(src) }] : [];
    },
  },
  {
    id: 'source-narrative-digest',
    agent: '原作梳理师',
    skillId: 'source-narrative-digest',
    output: 'narrative_digest.json',
    artifactKey: 'narrative_digest',
    inputs: async (slug) => gather(slug, ['story_bible.json']),
  },
  {
    id: 'overseas-adaptation-planner',
    agent: '改编策划师',
    skillId: 'overseas-adaptation-planner',
    output: 'adaptation_plan.json',
    artifactKey: 'adaptation_plan',
    inputs: async (slug) => gather(slug, ['story_bible.json', 'narrative_digest.json']),
  },
  {
    id: 'english-setting-bible-builder',
    agent: '设定集构建师',
    skillId: 'english-setting-bible-builder',
    output: 'setting_bible.json',
    artifactKey: 'setting_bible',
    inputs: async (slug) => gather(slug, ['story_bible.json', 'adaptation_plan.json']),
  },
  {
    id: 'english-outline-writer',
    agent: '大纲创作师',
    skillId: 'english-outline-writer',
    output: 'outline_pack.json',
    artifactKey: 'outline_pack',
    inputs: async (slug) => gather(slug, ['adaptation_plan.json', 'setting_bible.json']),
  },
  {
    id: 'english-screenplay-writer',
    agent: '剧本创作师',
    skillId: 'english-screenplay-writer',
    output: 'screenplay_pack.json',
    artifactKey: 'screenplay_pack',
    inputs: async (slug) =>
      gather(slug, ['adaptation_plan.json', 'setting_bible.json', 'outline_pack.json']),
  },
  {
    id: 'english-storyboard-table-builder',
    agent: '分镜构建师',
    skillId: 'english-storyboard-table-builder',
    output: 'storyboard_pack.json',
    artifactKey: 'storyboard_pack',
    inputs: async (slug) =>
      gather(slug, [
        'adaptation_plan.json',
        'setting_bible.json',
        'outline_pack.json',
        'screenplay_pack.json',
      ]),
  },
  {
    id: 'chinese-mirror-pack-translator',
    agent: '镜像翻译师',
    skillId: 'chinese-mirror-pack-translator',
    output: 'mirror_pack.json',
    artifactKey: 'mirror_pack',
    inputs: async (slug) =>
      gather(slug, [
        'setting_bible.json',
        'outline_pack.json',
        'screenplay_pack.json',
        'storyboard_pack.json',
      ]),
  },
];

function truncateForContext(text, maxChars = 300000) {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n\n[... truncated due to length ...]';
}

async function gather(slug, files) {
  const results = [];
  for (const f of files) {
    const data = await readArtifact(slug, f);
    if (data) {
      const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      results.push({ role: f.replace('.json', ''), content: truncateForContext(content) });
    }
  }
  return results;
}

export function getStageConfig(stageId) {
  return STAGES.find((s) => s.id === stageId);
}

export function getAllStages() {
  return STAGES.map((s) => ({ id: s.id, agent: s.agent, output: s.output }));
}

export function getStageOrder() {
  return STAGES.map((s) => s.id);
}

async function loadSettings() {
  try {
    return JSON.parse(await readFile(SETTINGS_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

function createClient(settings) {
  const { baseURL, apiKey, model } = settings.provider;
  return { client: new OpenAI({ baseURL, apiKey }), model };
}

export async function runStage(slug, stageId, feedback, onChunk) {
  const stage = getStageConfig(stageId);
  if (!stage) throw new Error(`Unknown stage: ${stageId}`);

  const settings = await loadSettings();
  if (!settings?.provider?.apiKey) throw new Error('AI settings not configured');

  const { client, model } = createClient(settings);

  const agentPrompt = await loadSubAgentPrompt(stage.agent);
  if (!agentPrompt) throw new Error(`Prompt not found: ${stage.agent}`);

  const skillDoc = await loadSkillDoc(stage.skillId);
  const systemParts = [agentPrompt];
  if (skillDoc) systemParts.push(`\n\n---\n以下是你的 SKILL 文档：\n${skillDoc}`);

  const upstreamInputs = await stage.inputs(slug);
  let userMessage = `请开始执行本阶段任务。\n\n项目目录: work/${slug}/\n\n`;

  if (upstreamInputs.length > 0) {
    userMessage += '以下是上游产物数据：\n\n';
    for (const inp of upstreamInputs) {
      userMessage += `### ${inp.role}\n\`\`\`json\n${inp.content}\n\`\`\`\n\n`;
    }
  }

  if (feedback) {
    userMessage += `\n\n用户修改意见：${feedback}\n\n请根据以上意见修改产物。`;
  }

  userMessage += `\n\n请输出完整的 ${stage.output} 内容（JSON 格式）。`;

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    messages: [
      { role: 'system', content: systemParts.join('') },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 16000,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content || '';
    if (delta) {
      fullResponse += delta;
      onChunk(delta);
    }
  }

  const jsonData = extractJson(fullResponse);
  let saved = false;
  let validationResult = null;

  if (jsonData) {
    validationResult = await validateArtifact(stage.skillId, jsonData);
    await writeArtifact(slug, stage.output, jsonData);
    await setArtifact(slug, stage.artifactKey, stage.output);
    saved = true;
  }

  return { fullResponse, jsonData, saved, validationResult, stageId };
}

export async function runReviewer(slug, stageId, onChunk) {
  const settings = await loadSettings();
  if (!settings?.provider?.apiKey) throw new Error('AI settings not configured');

  const { client, model } = createClient(settings);

  const reviewerPrompt = await loadSubAgentPrompt('规格审核员');
  if (!reviewerPrompt) throw new Error('Reviewer prompt not found');

  const stage = getStageConfig(stageId);
  const artifact = stage ? await readArtifact(slug, stage.output) : null;

  let userMessage = `请审核 ${stageId} 阶段的产物。\n\n`;
  if (artifact) {
    const content = typeof artifact === 'string' ? artifact : JSON.stringify(artifact, null, 2);
    userMessage += `### ${stage.output}\n\`\`\`json\n${truncateForContext(content)}\n\`\`\`\n`;
  }

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    messages: [
      { role: 'system', content: reviewerPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content || '';
    if (delta) {
      fullResponse += delta;
      onChunk(delta);
    }
  }

  return { fullResponse };
}

function extractJson(text) {
  const fenceMatch = text.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1]); } catch {}
  }
  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd > braceStart) {
    try { return JSON.parse(text.slice(braceStart, braceEnd + 1)); } catch {}
  }
  return null;
}
