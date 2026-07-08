<script lang="ts">
import type { PodInfoUI } from '@podman-desktop/core-api';
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import PodActions from './PodActions.svelte';

export let object: PodInfoUI;
</script>

<div class="flex w-full">
  <div class="flex items-center w-5">
    {#if object.actionError}
      <ErrorMessage error={object.actionError} icon wrapMessage />
    {:else}
      <div>&nbsp;</div>
    {/if}
  </div>
  <div class="text-right w-full">
    <PodActions pod={object} dropdownMenu={true} on:update />
  </div>
</div>
