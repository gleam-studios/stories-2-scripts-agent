<template>
  <div class="workbench">
    <StageNav
      :slug="slug"
      :activeStage="activeStage"
      :isCompleted="isCompleted"
      @select="selectStage"
    />
    <ChatPanel
      :slug="slug"
      :stageId="activeStage"
      :stageLabel="STAGE_LABELS[activeStage] || activeStage"
      :isCompleted="isCompleted(activeStage)"
      @confirmed="onConfirmed"
      @artifact-updated="refreshKey++"
    />
    <ArtifactPreview
      :slug="slug"
      :filename="STAGE_OUTPUT[activeStage]"
      :refreshKey="refreshKey"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import StageNav from '../components/StageNav.vue';
import ChatPanel from '../components/ChatPanel.vue';
import ArtifactPreview from '../components/ArtifactPreview.vue';
import { useProject } from '../composables/useProject.js';

const props = defineProps({ slug: String });

const { manifest, loadManifest, currentStageId, isCompleted, STAGE_ORDER, STAGE_LABELS, STAGE_OUTPUT } = useProject();
const activeStage = ref(STAGE_ORDER[0]);
const refreshKey = ref(0);

onMounted(async () => {
  await loadManifest(props.slug);
  const next = currentStageId();
  if (next) activeStage.value = next;
});

function selectStage(id) {
  activeStage.value = id;
}

async function onConfirmed(stageId) {
  await loadManifest(props.slug);
  const next = currentStageId();
  if (next) activeStage.value = next;
}
</script>

<style scoped>
.workbench {
  display: flex;
  height: calc(100vh - var(--nav-height));
  overflow: hidden;
}
</style>
