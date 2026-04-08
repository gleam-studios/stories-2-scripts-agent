<template>
  <aside class="artifact-panel">
    <div class="artifact-header">
      <span>产物预览</span>
      <button v-if="artifact" class="btn-icon" @click="expanded = !expanded" :title="expanded ? '收起' : '展开'">
        {{ expanded ? '−' : '+' }}
      </button>
    </div>
    <div class="artifact-body">
      <div v-if="loading" style="text-align: center; padding: 20px;">
        <span class="spinner"></span>
      </div>
      <div v-else-if="!artifact" class="artifact-empty">
        暂无产物
      </div>
      <div v-else class="artifact-content">
        <div class="artifact-filename">{{ filename }}</div>
        <div class="json-tree" :class="{ collapsed: !expanded }">
          <JsonNode :data="artifact" :depth="0" />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch, defineAsyncComponent } from 'vue';
import JsonNode from './JsonNode.vue';

const props = defineProps({
  slug: String,
  filename: String,
  refreshKey: Number,
});

const artifact = ref(null);
const loading = ref(false);
const expanded = ref(true);

async function load() {
  if (!props.slug || !props.filename) {
    artifact.value = null;
    return;
  }
  loading.value = true;
  try {
    const res = await fetch(`/api/chat/artifact/${props.slug}/${props.filename}`);
    if (res.ok) {
      artifact.value = await res.json();
    } else {
      artifact.value = null;
    }
  } catch {
    artifact.value = null;
  } finally {
    loading.value = false;
  }
}

watch([() => props.slug, () => props.filename, () => props.refreshKey], load, { immediate: true });
</script>

<style scoped>
.artifact-panel {
  width: 320px;
  min-width: 320px;
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--nav-height));
}

.artifact-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dim);
}

.btn-icon {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.artifact-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.artifact-empty {
  text-align: center;
  padding: 40px 16px;
  color: var(--text-dim);
  font-size: 13px;
}

.artifact-filename {
  font-size: 12px;
  color: var(--accent);
  margin-bottom: 8px;
  font-family: monospace;
}

.json-tree {
  font-size: 12px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  line-height: 1.6;
}

.json-tree.collapsed {
  max-height: 200px;
  overflow: hidden;
  position: relative;
}

.json-tree.collapsed::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(transparent, var(--bg-card));
}
</style>
