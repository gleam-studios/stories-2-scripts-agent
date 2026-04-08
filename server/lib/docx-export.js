import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle,
} from 'docx';
import { readFile, writeFile, mkdir, copyFile } from 'fs/promises';
import { join } from 'path';
import { workDir } from './manifest.js';
import { readArtifact } from './artifact-io.js';

const EXPORT_KINDS = [
  { num: '01', label: '英文大纲', src: 'outline_pack.json', lang: 'en', type: 'outline' },
  { num: '02', label: '英文剧本', src: 'screenplay_pack.json', lang: 'en', type: 'screenplay' },
  { num: '03', label: '英文分镜表', src: 'storyboard_pack.json', lang: 'en', type: 'storyboard' },
  { num: '04', label: '英文设定集', src: 'setting_bible.json', lang: 'en', type: 'setting' },
  { num: '05', label: '中文大纲', src: 'mirror_pack.json', lang: 'zh', type: 'outline', mirrorKey: 'chinese_outline' },
  { num: '06', label: '中文剧本', src: 'mirror_pack.json', lang: 'zh', type: 'screenplay', mirrorKey: 'chinese_screenplay' },
  { num: '07', label: '中文分镜表', src: 'mirror_pack.json', lang: 'zh', type: 'storyboard', mirrorKey: 'chinese_storyboard' },
  { num: '08', label: '中文设定集', src: 'mirror_pack.json', lang: 'zh', type: 'setting', mirrorKey: 'chinese_setting_bible' },
];

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 240, after: 120 } });
}

function body(text) {
  return new Paragraph({
    children: [new TextRun({ text: text || '', size: 24 })],
    spacing: { after: 100 },
  });
}

function bold(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24 })],
    spacing: { before: 160, after: 80 },
  });
}

function buildOutlineDoc(data) {
  const sections = [];
  sections.push(heading(data.title || data.adaptation_positioning?.title || 'Outline'));

  if (data.adaptation_positioning) {
    sections.push(heading('Adaptation Positioning', HeadingLevel.HEADING_2));
    for (const [k, v] of Object.entries(data.adaptation_positioning)) {
      sections.push(bold(k));
      sections.push(body(typeof v === 'string' ? v : JSON.stringify(v, null, 2)));
    }
  }

  const episodes = data.episodes || data.episode_outlines || [];
  for (const ep of episodes) {
    sections.push(heading(`Episode ${ep.episode_id || ep.ep}`, HeadingLevel.HEADING_2));
    if (ep.title) sections.push(bold(ep.title));
    if (ep.summary) sections.push(body(ep.summary));
    if (ep.scenes) {
      for (const sc of ep.scenes) {
        sections.push(bold(`Scene ${sc.scene_id || ''}: ${sc.location || ''}`));
        sections.push(body(sc.summary || sc.description || JSON.stringify(sc)));
      }
    }
    if (ep.hook) sections.push(body(`Hook: ${ep.hook}`));
  }
  return sections;
}

function buildScreenplayDoc(data) {
  const sections = [];
  sections.push(heading(data.title || 'Screenplay'));

  const episodes = data.episodes || [];
  for (const ep of episodes) {
    sections.push(heading(`Episode ${ep.episode_id || ep.ep}`, HeadingLevel.HEADING_2));
    const scenes = ep.scenes || [];
    for (const sc of scenes) {
      const sceneHead = [sc.scene_id, sc.location, sc.time_of_day].filter(Boolean).join(' - ');
      sections.push(new Paragraph({
        children: [new TextRun({ text: sceneHead.toUpperCase(), bold: true, size: 24, font: 'Courier New' })],
        spacing: { before: 240, after: 80 },
      }));
      const beats = sc.beats || sc.actions || sc.content;
      if (Array.isArray(beats)) {
        for (const beat of beats) {
          if (typeof beat === 'string') {
            sections.push(body(beat));
          } else if (beat.character && beat.dialogue) {
            sections.push(new Paragraph({
              children: [new TextRun({ text: beat.character.toUpperCase(), bold: true, size: 24 })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 120 },
            }));
            sections.push(new Paragraph({
              children: [new TextRun({ text: beat.dialogue, italics: true, size: 24 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 80 },
            }));
            if (beat.parenthetical) sections.push(body(`(${beat.parenthetical})`));
          } else {
            sections.push(body(JSON.stringify(beat)));
          }
        }
      } else if (typeof beats === 'string') {
        sections.push(body(beats));
      }
    }
  }
  return sections;
}

function buildStoryboardDoc(data) {
  const sections = [];
  sections.push(heading(data.title || 'Storyboard'));

  const episodes = data.episodes || [];
  for (const ep of episodes) {
    sections.push(heading(`Episode ${ep.episode_id || ep.ep}`, HeadingLevel.HEADING_2));
    const shots = ep.shots || ep.rows || [];
    if (shots.length === 0) continue;

    const headers = Object.keys(shots[0]);
    const headerRow = new TableRow({
      children: headers.map(h => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20 })] })],
        width: { size: Math.floor(9000 / headers.length), type: WidthType.DXA },
      })),
    });

    const dataRows = shots.map(shot => new TableRow({
      children: headers.map(h => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: String(shot[h] ?? ''), size: 18 })] })],
      })),
    }));

    sections.push(new Table({
      rows: [headerRow, ...dataRows],
      width: { size: 9000, type: WidthType.DXA },
    }));
  }
  return sections;
}

function buildSettingDoc(data) {
  const sections = [];
  sections.push(heading(data.title || 'Setting Bible'));

  const topKeys = [
    'world_background', 'timeline', 'character_details', 'locations',
    'props', 'costume_visual_system', 'continuity_rules', 'ai_asset_matrix',
  ];

  for (const key of topKeys) {
    if (!data[key]) continue;
    sections.push(heading(key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), HeadingLevel.HEADING_2));
    const val = data[key];
    if (typeof val === 'string') {
      sections.push(body(val));
    } else if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === 'string') {
          sections.push(body(`- ${item}`));
        } else {
          sections.push(bold(item.name || item.id || ''));
          sections.push(body(JSON.stringify(item, null, 2)));
        }
      }
    } else {
      for (const [k, v] of Object.entries(val)) {
        sections.push(bold(k));
        sections.push(body(typeof v === 'string' ? v : JSON.stringify(v, null, 2)));
      }
    }
  }

  const remaining = Object.keys(data).filter(k => !topKeys.includes(k) && k !== 'title');
  for (const key of remaining) {
    sections.push(heading(key, HeadingLevel.HEADING_2));
    sections.push(body(JSON.stringify(data[key], null, 2)));
  }

  return sections;
}

function buildDocSections(kind, data) {
  switch (kind.type) {
    case 'outline': return buildOutlineDoc(data);
    case 'screenplay': return buildScreenplayDoc(data);
    case 'storyboard': return buildStoryboardDoc(data);
    case 'setting': return buildSettingDoc(data);
    default: return [body(JSON.stringify(data, null, 2))];
  }
}

export async function exportWord(slug, title, kindNums) {
  const exportDir = join(workDir(slug), 'export');
  await mkdir(exportDir, { recursive: true });

  const kindsToExport = kindNums
    ? EXPORT_KINDS.filter(k => kindNums.includes(k.num))
    : EXPORT_KINDS;

  const results = [];

  for (const kind of kindsToExport) {
    let rawData = await readArtifact(slug, kind.src);
    if (!rawData) {
      results.push({ num: kind.num, label: kind.label, error: `${kind.src} not found` });
      continue;
    }

    let data = rawData;
    if (kind.mirrorKey && typeof rawData === 'object') {
      data = rawData[kind.mirrorKey] || rawData;
    }

    const docSections = buildDocSections(kind, data);
    const doc = new Document({
      sections: [{ children: docSections }],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `${kind.num}_${title}_${kind.label}.docx`;
    const outPath = join(exportDir, filename);
    await writeFile(outPath, buffer);

    results.push({ num: kind.num, label: kind.label, filename, path: outPath });
  }

  const desktopDir = join(process.env.HOME || '~', 'Desktop', '短剧导出', slug);
  try {
    await mkdir(desktopDir, { recursive: true });
    for (const r of results) {
      if (r.path) {
        await copyFile(r.path, join(desktopDir, r.filename));
      }
    }
  } catch {}

  return results;
}

export function getExportKinds() {
  return EXPORT_KINDS;
}
