<template>
  <div class="json-node" :style="{ paddingLeft: depth * 16 + 'px' }">
    <template v-if="isObject">
      <div
        class="json-toggle"
        @click="open = !open"
      >
        <span class="toggle-arrow">{{ open ? '▾' : '▸' }}</span>
        <span v-if="label" class="json-key">{{ label }}</span>
        <span class="json-bracket">{</span>
        <span v-if="!open" class="json-collapsed">{{ Object.keys(data).length }} keys }</span>
      </div>
      <template v-if="open">
        <JsonNode
          v-for="(val, key) in data"
          :key="key"
          :data="val"
          :label="key"
          :depth="depth + 1"
        />
        <div :style="{ paddingLeft: depth * 16 + 'px' }">
          <span class="json-bracket">}</span>
        </div>
      </template>
    </template>

    <template v-else-if="isArray">
      <div class="json-toggle" @click="open = !open">
        <span class="toggle-arrow">{{ open ? '▾' : '▸' }}</span>
        <span v-if="label" class="json-key">{{ label }}</span>
        <span class="json-bracket">[</span>
        <span v-if="!open" class="json-collapsed">{{ data.length }} items ]</span>
      </div>
      <template v-if="open">
        <JsonNode
          v-for="(val, idx) in data"
          :key="idx"
          :data="val"
          :label="idx"
          :depth="depth + 1"
        />
        <div :style="{ paddingLeft: depth * 16 + 'px' }">
          <span class="json-bracket">]</span>
        </div>
      </template>
    </template>

    <template v-else>
      <div class="json-leaf">
        <span v-if="label !== undefined" class="json-key">{{ label }}: </span>
        <span :class="valueClass">{{ displayValue }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: null,
  label: [String, Number],
  depth: { type: Number, default: 0 },
});

const open = ref(props.depth < 2);

const isObject = computed(() => props.data && typeof props.data === 'object' && !Array.isArray(props.data));
const isArray = computed(() => Array.isArray(props.data));

const valueClass = computed(() => {
  if (props.data === null) return 'json-null';
  if (typeof props.data === 'string') return 'json-string';
  if (typeof props.data === 'number') return 'json-number';
  if (typeof props.data === 'boolean') return 'json-boolean';
  return '';
});

const displayValue = computed(() => {
  if (props.data === null) return 'null';
  if (typeof props.data === 'string') {
    const s = props.data;
    return s.length > 120 ? `"${s.slice(0, 120)}..."` : `"${s}"`;
  }
  return String(props.data);
});
</script>

<style scoped>
.json-toggle {
  cursor: pointer;
  user-select: none;
}
.json-toggle:hover { background: rgba(255,255,255,0.03); }

.toggle-arrow {
  display: inline-block;
  width: 14px;
  color: var(--text-dim);
  font-size: 10px;
}

.json-key {
  color: #82aaff;
}

.json-bracket { color: var(--text-dim); }
.json-collapsed { color: var(--text-dim); font-style: italic; }
.json-string { color: #c3e88d; }
.json-number { color: #f78c6c; }
.json-boolean { color: #c792ea; }
.json-null { color: #666; font-style: italic; }

.json-leaf {
  word-break: break-all;
}
</style>
