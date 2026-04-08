import { ref } from 'vue';

export function useSSE() {
  const isStreaming = ref(false);
  const stageOutput = ref('');
  const reviewOutput = ref('');
  const currentPhase = ref('');
  const error = ref(null);
  const isDone = ref(false);

  let eventSource = null;

  function start(url) {
    stop();
    isStreaming.value = true;
    stageOutput.value = '';
    reviewOutput.value = '';
    currentPhase.value = 'stage';
    error.value = null;
    isDone.value = false;

    eventSource = new EventSource(url);

    eventSource.addEventListener('chunk', (e) => {
      const data = JSON.parse(e.data);
      if (data.phase === 'stage') {
        stageOutput.value += data.content;
      } else if (data.phase === 'review') {
        reviewOutput.value += data.content;
      }
    });

    eventSource.addEventListener('status', (e) => {
      const data = JSON.parse(e.data);
      currentPhase.value = data.phase;
    });

    eventSource.addEventListener('stage-done', (e) => {
      currentPhase.value = 'review';
    });

    eventSource.addEventListener('review-done', () => {
      currentPhase.value = 'done';
    });

    eventSource.addEventListener('done', () => {
      isDone.value = true;
      isStreaming.value = false;
      eventSource?.close();
    });

    eventSource.addEventListener('error', (e) => {
      try {
        const data = JSON.parse(e.data);
        error.value = data.message;
      } catch {
        error.value = 'Connection lost';
      }
      isStreaming.value = false;
      eventSource?.close();
    });

    eventSource.onerror = () => {
      if (!isDone.value) {
        isStreaming.value = false;
      }
      eventSource?.close();
    };
  }

  function stop() {
    eventSource?.close();
    eventSource = null;
    isStreaming.value = false;
  }

  return { isStreaming, stageOutput, reviewOutput, currentPhase, error, isDone, start, stop };
}
