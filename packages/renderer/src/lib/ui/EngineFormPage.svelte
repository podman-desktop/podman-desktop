<script lang="ts">
import NoContainerEngineEmptyScreen from '../image/NoContainerEngineEmptyScreen.svelte';
import FormPage from './FormPage.svelte';

export let title: string;
export let inProgress = false;
export let showEmptyScreen: boolean = false;
</script>

<FormPage title={title} inProgress={inProgress}>
  {#snippet icon()}
  <slot name="icon" />
  {/snippet}
  {#snippet actions()}
  <slot name="actions" />
  {/snippet}
  {#snippet content()}
  <slot>
    <div class="p-5 min-w-full h-full">
      {#if showEmptyScreen}
        <NoContainerEngineEmptyScreen />
      {:else}
        <div class="bg-[var(--pd-content-card-bg)] p-6 space-y-2 lg:p-8 rounded-lg">
          <slot name="content" />
        </div>
      {/if}
    </div>
  </slot>
  {/snippet}
</FormPage>
