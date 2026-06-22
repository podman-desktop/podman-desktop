<style>
.svelte-toast-wrapper {
  font-size: 0.8rem;
  --toastPadding: '0';
  --toastMsgPadding: '0';
  --toastMinHeight: 2rem;
  --toastBorderRadius: 0.2rem;
  --toastWidth: 16rem;
  --toastContainerTop: auto;
  --toastContainerRight: 0.8rem;
  --toastContainerBottom: 1.6rem;
  --toastContainerLeft: auto;
  --toastBackground: var(--pd-modal-bg);
  --toastBarHeight: 3px;
  --toastBarLeft: 2px;
  --toastBarBottom: 2px;
  --toastBarWidth: calc(100% - 4px);
}

:global(._toastBar) {
  border-radius: 2px;
  overflow: hidden;
}
</style>

<script lang="ts">
import { SvelteToast, toast } from '@zerodevx/svelte-toast';
import { onDestroy, onMount } from 'svelte';

const toastIcons: Record<string, string> = {
  error: 'fa-circle-exclamation',
  warning: 'fa-triangle-exclamation',
};

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll(`'`, '&#039;');
}

function buildMessage(type: string, message: string): string {
  const c = 'px-3 pt-2 pb-2.5 select-none';
  const icon = toastIcons[type];
  const safe = escapeHtml(message);

  if (icon)
    return `<span class="flex flex-row items-start gap-1.5 -ml-0.5 ${c}"><i class="fas ${icon} shrink-0 text-md leading-none mt-1"></i><span>${safe}</span></span>`;

  return `<span class="block ${c}">${safe}</span>`;
}

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
    const msg = buildMessage(object.type, object.message);
    toast.push(msg, { pausable: true, theme });
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
