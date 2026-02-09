<script lang="ts">
import IconImage from '/@/lib/appearance/IconImage.svelte';

import arrowUp from './status-icons/arrow-up.svg';

interface Props {
  status?: string;
  class?: string;
}

let { status, class: className = '' }: Props = $props();
</script>


{#if status === 'starting' || status === 'stopping'}
  <div aria-label="Connection Status Icon" class="h-3 w-3 rounded-full animate-spin border border-solid border-[var(--pd-action-button-spinner)] border-t-transparent {className}"></div>
{:else if status === 'ready' || status === 'started'}
  <div aria-label="Connection Status Icon" class="h-[7px] w-[7px] absolute top-[0px] right-[-2px] rounded-full bg-[var(--pd-status-contrast)] border-1 border-[var(--pd-statusbar-bg)] {className}"></div>
{:else if status === 'error'}
  <div aria-label="Connection Status Icon" class="h-[7px] w-[7px] absolute top-[0px] right-[-2px] rounded-full bg-[var(--pd-state-error)] border-1 border-[var(--pd-statusbar-bg)] {className}"></div>
{:else if status === 'Update available'}
  <IconImage image={arrowUp} alt="Connection Status Icon" class="h-[12px] w-auto absolute top-0 right-[-30%] {className}" />
{/if}
