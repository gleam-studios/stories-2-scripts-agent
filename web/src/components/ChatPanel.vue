<template>
  <div class="chat-panel">
    <div class="chat-header">
      <span class="chat-title">{{ stageLabel }}</span>
      <span v-if="sse.isStreaming.value" class="streaming-badge">
        <span class="spinner"></span>
        {{ sse.currentPhase.value === 'review' ? '审核中' : '生成中' }}
      </span>
    </div>

    <div class="chat-body" ref="chatBody">
      <div v-if="!sse.stageOutput.value && !sse.isStreaming.value && !sse.error.value" class="chat-empty">
        <p>点击「开始此阶段」执行 <strong>{{ stageLabel }}</strong></p>
        <p v-if="isCompleted" class="dim">此阶段已完成。可重新运行或提交修改意见。</p>
      </div>

      <div v-if="sse.stageOutput.value" class="chat-section">
        <div class="section-label">子 Agent 输出</div>
        <div class="chat-content" v-html="renderMarkdown(sse.stageOutput.value)"></div>
      </div>

      <div v-if="sse.reviewOutput.value" class="chat-section review-section">
        <div class="section-label">审核结果</div>
        <div class="chat-content" v-html="renderMarkdown(sse.reviewOutput.value)"></div>
      </div>

      <div v-if="sse.error.value" class="chat-error">
        {{ sse.error.value }}
      </div>
    </div>

    <div class="chat-footer">
      <div v-if="!sse.isStreaming.value" class="chat-actions">
        <button class="btn btn-primary" @click="runStage(null)" :disabled="sse.isStreaming.value">
          {{ isCompleted ? '重新运行' : '开始此阶段' }}
        </button>

        <div v-if="sse.isDone.value && !confirmed" class="feedback-area">
          <input
            v-model="feedback"
            placeholder="输入修改意见... (留空则确认满意)"
            @keyup.enter="feedback ? runStage(feedback) : confirm()"
            class="feedback-input"
          />
          <button v-if="feedback" class="btn btn-secondary" @click="runStage(feedback)">
            提交修改意见
          </button>
          <button v-else class="btn btn-success" @click="confirm">
            满意，确认进入下一阶段
          </button>
        </div>

        <div v-if="confirmed" class="confirmed-msg">
          此阶段已确认完成
        </div>
      </div>

      <div v-else class="streaming-hint">
        AI 正在工作中...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { useSSE } from '../composables/useSSE.js';

const props = defineProps({
  slug: String,
  stageId: String,
  stageLabel: String,
  isCompleted: Boolean,
});

const emit = defineEmits(['confirmed', 'artifact-updated']);

const sse = useSSE();
const feedback = ref('');
const confirmed = ref(false);
const chatBody = ref(null);

watch(() => props.stageId, () => {
  sse.stop();
  sse.stageOutput.value = '';
  sse.reviewOutput.value = '';
  sse.isDone.value = false;
  sse.error.value = null;
  feedback.value = '';
  confirmed.value = false;
});

watch([() => sse.stageOutput.value, () => sse.reviewOutput.value], () => {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
  });
});

watch(() => sse.isDone.value, (done) => {
  if (done) emit('artifact-updated');
});

function runStage(fb) {
  confirmed.value = false;
  const params = new URLSearchParams();
  if (fb) params.set('feedback', fb);
  const url = `/api/chat/run-stage/${props.slug}/${props.stageId}?${params}`;
  sse.start(url);
  feedback.value = '';
}

async function confirm() {
  await fetch(`/api/chat/confirm-stage/${props.slug}/${props.stageId}`, { method: 'POST' });
  confirmed.value = true;
  emit('confirmed', props.stageId);
}

function renderMarkdown(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}
</script>

<style scoped>
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-header {
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-card);
}

.chat-title {
  font-weight: 600;
  font-size: 15px;
}

.streaming-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--accent);
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: var(--bg);
}

.chat-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim);
}
.chat-empty .dim { font-size: 13px; margin-top: 8px; }

.chat-section {
  margin-bottom: 20px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}

.review-section .section-label {
  color: var(--warning);
  border-bottom-color: rgba(253, 203, 110, 0.3);
}

.chat-content {
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.chat-content :deep(pre) {
  background: var(--bg-input);
  padding: 12px;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 8px 0;
}

.chat-content :deep(code) {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 13px;
}

.chat-content :deep(code:not(pre code)) {
  background: var(--bg-input);
  padding: 2px 6px;
  border-radius: 4px;
}

.chat-error {
  padding: 12px 16px;
  background: rgba(225, 112, 85, 0.15);
  border: 1px solid rgba(225, 112, 85, 0.3);
  border-radius: var(--radius);
  color: var(--danger);
  font-size: 14px;
}

.chat-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}

.chat-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feedback-area {
  display: flex;
  gap: 8px;
}

.feedback-input {
  flex: 1;
  padding: 10px 12px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-size: 14px;
  outline: none;
}

.feedback-input:focus { border-color: var(--accent); }

.confirmed-msg {
  text-align: center;
  color: var(--success);
  font-size: 14px;
  padding: 8px;
}

.streaming-hint {
  text-align: center;
  color: var(--text-dim);
  font-size: 13px;
}
</style>
