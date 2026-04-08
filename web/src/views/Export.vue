<template>
  <div class="page">
    <h1 class="page-title">导出 Word — {{ slug }}</h1>

    <div class="card">
      <div class="export-list">
        <label v-for="k in kinds" :key="k.num" class="export-item">
          <input type="checkbox" v-model="selected" :value="k.num" />
          <span class="export-num">{{ k.num }}</span>
          <span class="export-label">{{ k.label }}</span>
          <span class="export-filename">{{ k.num }}_{{ title }}_{{ k.label }}.docx</span>
        </label>
      </div>

      <div class="export-actions">
        <button class="btn btn-secondary" @click="toggleAll">
          {{ allSelected ? '取消全选' : '全选' }}
        </button>
        <button class="btn btn-primary" @click="doExport" :disabled="exporting || selected.length === 0">
          {{ exporting ? '导出中...' : `导出 ${selected.length} 个文件` }}
        </button>
      </div>
    </div>

    <div v-if="results.length" class="card">
      <h3 style="margin-bottom: 12px;">导出结果</h3>
      <div v-for="r in results" :key="r.num" class="result-item">
        <span :class="r.error ? 'result-error' : 'result-ok'">
          {{ r.num }} {{ r.label }}
        </span>
        <template v-if="!r.error">
          <a
            :href="`/api/export/download/${slug}/${r.filename}`"
            class="result-download"
            download
          >下载</a>
        </template>
        <span v-else class="result-error-msg">{{ r.error }}</span>
      </div>
      <p style="margin-top: 12px; font-size: 13px; color: var(--text-dim);">
        文件也已复制到 ~/Desktop/短剧导出/{{ slug }}/
      </p>
    </div>

    <router-link :to="`/workbench/${slug}`" class="btn btn-secondary" style="margin-top: 16px;">
      返回工作台
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({ slug: String });

const kinds = ref([]);
const selected = ref([]);
const title = ref('');
const exporting = ref(false);
const results = ref([]);

const allSelected = computed(() => selected.value.length === kinds.value.length);

onMounted(async () => {
  const [kindsRes, projectRes] = await Promise.all([
    fetch('/api/export/kinds'),
    fetch(`/api/projects/${props.slug}`),
  ]);
  kinds.value = await kindsRes.json();
  selected.value = kinds.value.map(k => k.num);
  const project = await projectRes.json();
  title.value = project.project_title || props.slug;
});

function toggleAll() {
  if (allSelected.value) {
    selected.value = [];
  } else {
    selected.value = kinds.value.map(k => k.num);
  }
}

async function doExport() {
  exporting.value = true;
  results.value = [];
  try {
    const res = await fetch(`/api/export/${props.slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kinds: selected.value }),
    });
    const data = await res.json();
    results.value = data.results || [];
  } catch (e) {
    results.value = [{ num: '--', label: 'Error', error: e.message }];
  } finally {
    exporting.value = false;
  }
}
</script>

<style scoped>
.export-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.export-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-input);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.15s;
}

.export-item:hover { background: rgba(255, 255, 255, 0.05); }

.export-item input[type="checkbox"] {
  accent-color: var(--accent);
  width: 16px;
  height: 16px;
}

.export-num {
  font-weight: 700;
  font-size: 13px;
  color: var(--accent);
  width: 24px;
}

.export-label { font-size: 14px; }

.export-filename {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-dim);
  font-family: monospace;
}

.export-actions {
  display: flex;
  gap: 12px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.result-ok { color: var(--success); }
.result-error { color: var(--danger); }
.result-error-msg { font-size: 12px; color: var(--danger); }

.result-download {
  margin-left: auto;
  color: var(--accent);
  text-decoration: none;
  font-size: 13px;
}
.result-download:hover { text-decoration: underline; }
</style>
