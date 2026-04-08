import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import OpenAI from 'openai';

const router = Router();
const AGENT_ROOT = join(import.meta.dirname, '..', '..');
const SETTINGS_PATH = join(AGENT_ROOT, 'local_settings.json');

router.get('/', async (_req, res) => {
  try {
    const raw = await readFile(SETTINGS_PATH, 'utf-8');
    const settings = JSON.parse(raw);
    if (settings.provider?.apiKey) {
      settings.provider.apiKey = settings.provider.apiKey.slice(0, 8) + '****';
    }
    res.json(settings);
  } catch {
    res.json({ provider: { baseURL: '', apiKey: '', model: '' } });
  }
});

router.put('/', async (req, res) => {
  try {
    const data = req.body;
    let existing = {};
    try {
      existing = JSON.parse(await readFile(SETTINGS_PATH, 'utf-8'));
    } catch {}

    if (data.provider?.apiKey?.includes('****')) {
      data.provider.apiKey = existing.provider?.apiKey || '';
    }

    await writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/test', async (req, res) => {
  try {
    const { baseURL, apiKey, model } = req.body;
    const client = new OpenAI({ baseURL, apiKey });
    const result = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: 'Hi, reply with "ok" only.' }],
      max_tokens: 10,
    });
    const reply = result.choices?.[0]?.message?.content || '';
    res.json({ ok: true, reply });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

export default router;
