import { ref } from 'vue';

const STAGE_ORDER = [
  'source-analysis',
  'source-narrative-digest',
  'overseas-adaptation-planner',
  'english-setting-bible-builder',
  'english-outline-writer',
  'english-screenplay-writer',
  'english-storyboard-table-builder',
  'chinese-mirror-pack-translator',
];

const STAGE_LABELS = {
  'source-analysis': '原文分析',
  'source-narrative-digest': '原作梳理',
  'overseas-adaptation-planner': '改编策划',
  'english-setting-bible-builder': '设定集',
  'english-outline-writer': '大纲创作',
  'english-screenplay-writer': '剧本创作',
  'english-storyboard-table-builder': '分镜构建',
  'chinese-mirror-pack-translator': '镜像翻译',
};

const STAGE_SHORT = {
  'source-analysis': '1',
  'source-narrative-digest': '1b',
  'overseas-adaptation-planner': '2',
  'english-setting-bible-builder': '3',
  'english-outline-writer': '4',
  'english-screenplay-writer': '5',
  'english-storyboard-table-builder': '6',
  'chinese-mirror-pack-translator': '7',
};

const STAGE_OUTPUT = {
  'source-analysis': 'story_bible.json',
  'source-narrative-digest': 'narrative_digest.json',
  'overseas-adaptation-planner': 'adaptation_plan.json',
  'english-setting-bible-builder': 'setting_bible.json',
  'english-outline-writer': 'outline_pack.json',
  'english-screenplay-writer': 'screenplay_pack.json',
  'english-storyboard-table-builder': 'storyboard_pack.json',
  'chinese-mirror-pack-translator': 'mirror_pack.json',
};

export function useProject() {
  const manifest = ref(null);
  const loading = ref(false);

  async function loadManifest(slug) {
    loading.value = true;
    try {
      const res = await fetch(`/api/projects/${slug}`);
      if (res.ok) manifest.value = await res.json();
    } finally {
      loading.value = false;
    }
  }

  function currentStageId() {
    const completed = manifest.value?.completed_stages || [];
    for (const id of STAGE_ORDER) {
      if (!completed.includes(id)) return id;
    }
    return null;
  }

  function isCompleted(stageId) {
    return (manifest.value?.completed_stages || []).includes(stageId);
  }

  return {
    manifest, loading, loadManifest, currentStageId, isCompleted,
    STAGE_ORDER, STAGE_LABELS, STAGE_SHORT, STAGE_OUTPUT,
  };
}
