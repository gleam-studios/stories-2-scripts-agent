import { Router } from 'express';
import { runStage, runReviewer, getStageConfig } from '../lib/stage-runner.js';
import { completeStage } from '../lib/manifest.js';
import { readArtifact } from '../lib/artifact-io.js';

const router = Router();

router.get('/run-stage/:slug/:stageId', async (req, res) => {
  const { slug, stageId } = req.params;
  const feedback = req.query.feedback || null;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    send('status', { phase: 'stage', stageId, message: `正在执行 ${stageId}...` });

    const stageResult = await runStage(slug, stageId, feedback, (chunk) => {
      send('chunk', { phase: 'stage', content: chunk });
    });

    send('stage-done', {
      saved: stageResult.saved,
      validation: stageResult.validationResult,
    });

    send('status', { phase: 'review', message: '正在审核...' });

    const reviewResult = await runReviewer(slug, stageId, (chunk) => {
      send('chunk', { phase: 'review', content: chunk });
    });

    send('review-done', { content: reviewResult.fullResponse });

    send('done', { stageId, saved: stageResult.saved });
  } catch (err) {
    send('error', { message: err.message });
  } finally {
    res.end();
  }
});

router.post('/confirm-stage/:slug/:stageId', async (req, res) => {
  try {
    const { slug, stageId } = req.params;
    const manifest = await completeStage(slug, stageId);
    res.json({ ok: true, manifest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/artifact/:slug/:filename', async (req, res) => {
  const { slug, filename } = req.params;
  const data = await readArtifact(slug, filename);
  if (data === null) return res.status(404).json({ error: 'not found' });
  res.json(data);
});

export default router;
