<script lang="ts">
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';

import LoadingIcon from '/@/lib/ui/LoadingIcon.svelte';

import { getExtensionVersionUpdateState } from './extension-version-update.svelte';

interface Props {
  extensionId: string;
  class?: string;
}

let { extensionId, class: className = '' }: Props = $props();

const updateState = $derived(getExtensionVersionUpdateState(extensionId));
</script>

{#if updateState}
  {#if updateState.status === 'updating'}
    <span class="inline-flex items-center gap-1.5 text-sm text-[var(--pd-content-text)] {className}">
      <LoadingIcon icon={faArrowRotateRight} loading={true} iconSize="0.75x" loadingWidthClass="w-3" loadingHeightClass="h-3" />
      {updateState.message}
    </span>
  {:else if updateState.status === 'error'}
    <span class="text-sm text-[var(--pd-status-error)] {className}" role="alert">{updateState.message}</span>
  {/if}
{/if}
