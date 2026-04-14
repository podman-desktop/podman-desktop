<script lang="ts">
import type { Snippet } from 'svelte';

import NoContainerEngineEmptyScreen from '/@/lib/image/NoContainerEngineEmptyScreen.svelte';

import FormPage from './FormPage.svelte';

interface Props {
  title: string;
  inProgress?: boolean;
  showEmptyScreen?: boolean;
  icon?: Snippet;
  actions?: Snippet;
  content?: Snippet;
}

const {
  title,
  inProgress = false,
  showEmptyScreen = false,
  icon: iconLocal,
  actions: actionsLocal,
  content: contentLocal,
}: Props = $props();
</script>

<FormPage title={title} inProgress={inProgress}>
  {#snippet icon()}{@render iconLocal?.()}{/snippet}
  {#snippet actions()}{@render actionsLocal?.()}{/snippet}
  {#snippet content()}
    <div class="p-5 min-w-full h-full">
      {#if showEmptyScreen}
        <NoContainerEngineEmptyScreen />
      {:else}
        <div class="bg-[var(--pd-content-card-bg)] p-6 space-y-2 lg:p-8 rounded-lg">
          {@render contentLocal?.()}
        </div>
      {/if}
    </div>
  {/snippet}
</FormPage>
