<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import StatusDotIcon from '/@/lib/ui/StatusDotIcon.svelte';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import { getExtensionLifecyclePresentation } from './extension-lifecycle-status';

interface Props {
  extension?: CombinedExtensionInfoUI;
  class?: string;
}

let { extension, class: className = '' }: Props = $props();

const presentation = $derived(
  extension ? getExtensionLifecyclePresentation(extension.state, extension.type) : undefined,
);

const failureReason = $derived(extension?.error?.message ?? 'Unknown error');
const showFailureTooltip = $derived(extension?.state === 'failed' && !!extension?.error?.message);
</script>

{#if presentation}
  {#if showFailureTooltip}
    <Tooltip top tip={failureReason}>
      <div class="flex items-center gap-1.5 cursor-help min-w-0 {className}">
        <StatusDotIcon status={presentation.statusDotStatus} size="12" />
        <span class="text-sm" style:color={presentation.textColorVar}>{presentation.label}</span>
      </div>
    </Tooltip>
  {:else}
    <div class="flex items-center gap-1.5 {className}">
      <StatusDotIcon status={presentation.statusDotStatus} size="12" />
      <span class="text-sm" style:color={presentation.textColorVar}>{presentation.label}</span>
    </div>
  {/if}
{/if}
