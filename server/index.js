import express from 'express';
import cors from 'cors';
import { join } from 'path';
import { existsSync } from 'fs';
import { spawn } from 'child_process';

import settingsRouter from './routes/settings.js';
import projectsRouter from './routes/projects.js';
import chatRouter from './routes/chat.js';
import exportRouter from './routes/export.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/settings', settingsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/export', exportRouter);

const distPath = join(import.meta.dirname, '..', 'web', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`\n  API server: http://localhost:${PORT}/api`);
});

if (process.env.DEV === '1') {
  const webDir = join(import.meta.dirname, '..', 'web');
  const vite = spawn('npx', ['vite', '--port', '5173'], {
    cwd: webDir,
    stdio: 'inherit',
    shell: true,
  });
  vite.on('error', (e) => console.error('Vite failed:', e.message));
  process.on('SIGINT', () => { vite.kill(); process.exit(); });
  process.on('SIGTERM', () => { vite.kill(); process.exit(); });
  console.log('  Vite dev:   http://localhost:5173\n');
}
