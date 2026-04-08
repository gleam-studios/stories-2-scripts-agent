<template>
  <aside class="stage-nav">
    <div class="stage-nav-header">工作流程</div>
    <div
      v-for="id in STAGE_ORDER"
      :key="id"
      class="stage-item"
      :class="{
        completed: isCompleted(id),
        current: id === activeStage,
        highlight: id === 'source-narrative-digest',
      }"
      @click="$emit('select', id)"
    >
      <div class="stage-indicator">
        <span v-if="isCompleted(id)" class="check">&#10003;</span>
        <span v-else class="stage-num">{{ STAGE_SHORT[id] }}</span>
      </div>
      <div class="stage-info">
        <div class="stage-label">{{ STAGE_LABELS[id] }}</div>
        <div v-if="id === 'source-narrative-digest'" class="stage-tag">重中之重</div>
      </div>
    </div>
    <div class="stage-nav-footer">
      <router-link :to="`/export/${slug}`" class="btn btn-secondary btn-sm">
        导出 Word
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { useProject } from '../composables/useProject.js';

const { STAGE_ORDER, STAGE_LABELS, STAGE_SHORT } = useProject();

defineProps({
  slug: String,
  activeStage: String,
  isCompleted: Function,
});

defineEmits(['select']);
</script>

<style scoped>
.stage-nav {
  width: 220px;
  min-width: 220px;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--nav-height));
  overflow-y: auto;
}

.stage-nav-header {
  padding: 16px 16px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stage-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.15s;
  border-left: 3px solid transparent;
}

.stage-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.stage-item.current {
  background: rgba(108, 92, 231, 0.1);
  border-left-color: var(--accent);
}

.stage-item.completed .stage-label {
  color: var(--text-dim);
}

.stage-item.highlight {
  background: rgba(255, 234, 167, 0.05);
}

.stage-item.highlight.current {
  background: rgba(255, 234, 167, 0.12);
  border-left-color: var(--highlight);
}

.stage-indicator {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  background: var(--bg-input);
  border: 1px solid var(--border);
}

.stage-item.completed .stage-indicator {
  background: var(--success);
  border-color: var(--success);
  color: #fff;
}

.stage-item.current .stage-indicator {
  border-color: var(--accent);
  color: var(--accent);
}

.stage-item.highlight .stage-indicator {
  border-color: var(--highlight);
  color: var(--highlight);
}

.check { font-size: 14px; }

.stage-label { font-size: 14px; }

.stage-tag {
  font-size: 10px;
  color: var(--highlight);
  background: rgba(255, 234, 167, 0.15);
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 2px;
  display: inline-block;
}

.stage-nav-footer {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid var(--border);
}

.btn-sm {
  padding: 8px 14px;
  font-size: 13px;
  width: 100%;
}
</style>
