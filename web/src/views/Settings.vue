<template>
  <div class="page">
    <h1 class="page-title">API 配置</h1>
    <div class="card">
      <div class="form-group">
        <label>Base URL</label>
        <input v-model="form.baseURL" placeholder="https://api.openai.com/v1" />
      </div>
      <div class="form-group">
        <label>API Key</label>
        <input v-model="form.apiKey" type="password" placeholder="sk-..." />
      </div>
      <div class="form-group">
        <label>Model</label>
        <input v-model="form.model" placeholder="gpt-4o" />
      </div>
      <div class="settings-actions">
        <button class="btn btn-primary" @click="save" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
        <button class="btn btn-secondary" @click="test" :disabled="testing">
          {{ testing ? '测试中...' : '测试连接' }}
        </button>
      </div>
      <div v-if="message" class="settings-msg" :class="messageType">{{ message }}</div>
    </div>
    <div class="card">
      <h3 style="margin-bottom: 12px; font-size: 14px; color: var(--text-dim);">说明</h3>
      <p style="font-size: 13px; color: var(--text-dim); line-height: 1.8;">
        填入任何兼容 OpenAI API 格式的服务端点。支持 OpenAI、Anthropic（通过兼容层）、DeepSeek、Moonshot、本地 Ollama 等。<br/>
        API Key 仅存储在本地 <code>local_settings.json</code> 文件中，不会上传到任何地方。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const form = ref({ baseURL: '', apiKey: '', model: '' });
const saving = ref(false);
const testing = ref(false);
const message = ref('');
const messageType = ref('');

onMounted(async () => {
  const res = await fetch('/api/settings');
  const data = await res.json();
  if (data.provider) {
    form.value = { ...data.provider };
  }
});

async function save() {
  saving.value = true;
  message.value = '';
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: form.value }),
    });
    if (res.ok) {
      message.value = '保存成功';
      messageType.value = 'success';
    } else {
      message.value = '保存失败';
      messageType.value = 'error';
    }
  } catch (e) {
    message.value = e.message;
    messageType.value = 'error';
  } finally {
    saving.value = false;
  }
}

async function test() {
  testing.value = true;
  message.value = '';
  try {
    const res = await fetch('/api/settings/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });
    const data = await res.json();
    if (data.ok) {
      message.value = `连接成功！回复: ${data.reply}`;
      messageType.value = 'success';
    } else {
      message.value = `连接失败: ${data.error}`;
      messageType.value = 'error';
    }
  } catch (e) {
    message.value = e.message;
    messageType.value = 'error';
  } finally {
    testing.value = false;
  }
}
</script>

<style scoped>
.settings-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
.settings-msg {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: var(--radius);
  font-size: 13px;
}
.settings-msg.success {
  background: rgba(0, 184, 148, 0.15);
  color: var(--success);
}
.settings-msg.error {
  background: rgba(225, 112, 85, 0.15);
  color: var(--danger);
}
</style>
