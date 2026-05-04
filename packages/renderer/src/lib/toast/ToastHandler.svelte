<style>
.svelte-toast-wrapper {
  font-size: 0.8rem;
  --toastPadding: '0';
  --toastMsgPadding: '0';
  --toastMinHeight: 2rem;
  --toastBorderRadius: 0.3rem;
  --toastWidth: 16rem;
  --toastContainerTop: auto;
  --toastContainerRight: 0.8rem;
  --toastContainerBottom: 1rem;
  --toastContainerLeft: auto;
  --toastBackground: var(--pd-modal-bg);
  --toastBarHeight: 3px;
}
</style>

<script lang="ts">
import { SvelteToast, toast } from '@zerodevx/svelte-toast';
import { onDestroy, onMount } from 'svelte';

let callback: (object: { type: string; message: string }) => void;

onMount(() => {
  callback = (object: { type: string; message: string }): void => {
    let theme: {
      [x: string]: string;
    } = {};
    if (object.type === 'success') {
      theme = {
        '--toastBackground': 'var(--pd-toast-success-bg)',
        '--toastColor': 'var(--pd-toast-success-color)',
        '--toastBarBackground': 'var(--pd-toast-success-bar-bg)',
      };
    } else if (object.type === 'error') {
      theme = {
        '--toastBackground': 'var(--pd-toast-error-bg)',
        '--toastColor': 'var(--pd-toast-error-color)',
        '--toastBarBackground': 'var(--pd-toast-error-bar-bg)',
      };
    } else if (object.type === 'warning') {
      theme = {
        '--toastBackground': 'var(--pd-toast-warning-bg)',
        '--toastColor': 'var(--pd-toast-warning-color)',
        '--toastBarBackground': 'var(--pd-toast-warning-bar-bg)',
      };
    } else if (object.type === 'info') {
      theme = {
        '--toastBackground': 'var(--pd-toast-info-bg)',
        '--toastColor': 'var(--pd-toast-info-color)',
        '--toastBarBackground': 'var(--pd-toast-info-bar-bg)',
      };
    }
    toast.push(object.message, { pausable: true, theme });
  };

  window.events?.receive('toast:handler', (object: unknown) => {
    const value = object as { type: string; message: string };
    callback(value);
  });
});

onDestroy(() => {
  callback = (): void => {};
});
</script>

<div class="svelte-toast-wrapper">
  <SvelteToast />
</div>
