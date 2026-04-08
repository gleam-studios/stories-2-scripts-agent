<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">项目列表</h1>
      <button class="btn btn-primary" @click="showCreate = !showCreate">
        {{ showCreate ? '取消' : '新建项目' }}
      </button>
    </div>

    <div v-if="showCreate" class="card create-form">
      <div class="form-row">
        <div class="form-group">
          <label>项目代号 (slug)</label>
          <input v-model="newProject.slug" placeholder="my-project" />
        </div>
        <div class="form-group">
          <label>剧名</label>
          <input v-model="newProject.title" placeholder="My Drama Title" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>目标市场</label>
          <input v-model="newProject.targetMarket" placeholder="NA-English" />
        </div>
        <div class="form-group">
          <label>目标集数</label>
          <input v-model="newProject.episodeCount" type="number" placeholder="24" />
        </div>
        <div class="form-group">
          <label>单集时长</label>
          <input v-model="newProject.episodeDuration" placeholder="1-2 min" />
        </div>
      </div>
      <div class="form-group">
        <label>上传原文 (source.txt)</label>
        <input type="file" @change="onFileChange" accept=".txt" class="file-input" />
      </div>
      <button class="btn btn-success" @click="create" :disabled="creating || !newProject.slug">
        {{ creating ? '创建中...' : '创建项目' }}
      </button>
    </div>

    <div v-if="loading" style="text-align: center; padding: 40px;">
      <span class="spinner"></span>
    </div>

    <div v-else-if="projects.length === 0" class="empty-state">
      还没有项目。点击「新建项目」开始。
    </div>

    <div v-else class="project-list">
      <div v-for="p in projects" :key="p.slug" class="card project-card" @click="openProject(p.slug)">
        <div class="project-info">
          <div class="project-title">{{ p.title }}</div>
          <div class="project-slug">{{ p.slug }}</div>
        </div>
        <div class="project-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: (p.completedStages.length / p.totalStages * 100) + '%' }"></div>
          </div>
          <span class="progress-text">{{ p.completedStages.length }}/{{ p.totalStages }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const projects = ref([]);
const loading = ref(true);
const showCreate = ref(false);
const creating = ref(false);
const sourceFile = ref(null);
const newProject = ref({
  slug: '', title: '', targetMarket: 'NA-English',
  episodeCount: '', episodeDuration: '1-2 min',
});

async function loadProjects() {
  loading.value = true;
  try {
    const res = await fetch('/api/projects');
    projects.value = await res.json();
  } finally {
    loading.value = false;
  }
}

onMounted(loadProjects);

function onFileChange(e) {
  sourceFile.value = e.target.files[0] || null;
}

async function create() {
  creating.value = true;
  try {
    const fd = new FormData();
    fd.append('slug', newProject.value.slug);
    fd.append('title', newProject.value.title);
    fd.append('targetMarket', newProject.value.targetMarket);
    fd.append('episodeCount', newProject.value.episodeCount);
    fd.append('episodeDuration', newProject.value.episodeDuration);
    if (sourceFile.value) fd.append('source', sourceFile.value);

    const res = await fetch('/api/projects', { method: 'POST', body: fd });
    if (res.ok) {
      showCreate.value = false;
      newProject.value = { slug: '', title: '', targetMarket: 'NA-English', episodeCount: '', episodeDuration: '1-2 min' };
      sourceFile.value = null;
      await loadProjects();
    }
  } finally {
    creating.value = false;
  }
}

function openProject(slug) {
  router.push(`/workbench/${slug}`);
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-header .page-title { margin-bottom: 0; }

.create-form { margin-bottom: 24px; }

.form-row {
  display: flex;
  gap: 16px;
}
.form-row .form-group { flex: 1; }

.file-input {
  padding: 8px;
  background: var(--bg-input);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  width: 100%;
  color: var(--text);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim);
  font-size: 15px;
}

.project-card {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s;
}
.project-card:hover { border-color: var(--accent); }

.project-title { font-weight: 600; font-size: 16px; }
.project-slug { font-size: 13px; color: var(--text-dim); margin-top: 2px; }

.project-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 160px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--bg-input);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 13px;
  color: var(--text-dim);
  white-space: nowrap;
}
</style>
