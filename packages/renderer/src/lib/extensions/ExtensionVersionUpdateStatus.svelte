<script lang="ts">
import { onMount } from 'svelte';

import { EXTENSION_VERSION_UI_CHANGE_EVENT, getExtensionVersionUpdateState } from './extension-version-update.svelte';

interface Props {
  extensionId: string;
  class?: string;
}

let { extensionId, class: className = '' }: Props = $props();

let uiRevision = $state(0);

onMount(() => {
  const handler = (): void => {
    uiRevision += 1;
  };
  window.addEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  return (): void => {
    window.removeEventListener(EXTENSION_VERSION_UI_CHANGE_EVENT, handler);
  };
});

const updateState = $derived.by(() => {
  uiRevision;
  return getExtensionVersionUpdateState(extensionId);
});
</script>

{#if updateState?.status === 'error'}
  <span class="text-sm text-[var(--pd-state-error)] {className}" role="alert">{updateState.message}</span>
{/if}
