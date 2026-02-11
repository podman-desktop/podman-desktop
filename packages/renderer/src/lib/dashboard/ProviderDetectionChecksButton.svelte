<script lang="ts">
import { faList } from '@fortawesome/free-solid-svg-icons';
import type { ProviderDetectionCheck } from '@podman-desktop/api';
import type { ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';

export let provider: ProviderInfo;
export let onDetectionChecks = (_detectionChecks: ProviderDetectionCheck[]): void => {};
let viewInProgress = false;

let mode: 'view' | 'hide' = 'view';

async function toggleDetectionChecks(provider: ProviderInfo): Promise<void> {
  let detectionChecks: ProviderDetectionCheck[] = [];
  if (mode === 'view') {
    viewInProgress = true;
    // needs to ask the provider why it didn't find provider being installed
    detectionChecks = await window.getProviderDetectionChecks(provider.internalId);
  } else {
    detectionChecks = [];
  }
  onDetectionChecks(detectionChecks);
  viewInProgress = false;

  if (mode === 'view') {
    mode = 'hide';
  } else {
    mode = 'view';
  }
}
</script>

{#if provider.detectionChecks.length > 0}
  <Button
    on:click={(): Promise<void> => toggleDetectionChecks(provider)}
    inProgress={viewInProgress}
    icon={faList}
    title="Why {provider.name} is not found.">
    {mode === 'view' ? 'View' : 'Hide'} detection checks
  </Button>
{/if}
