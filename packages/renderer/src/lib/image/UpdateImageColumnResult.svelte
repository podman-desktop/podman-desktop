<script lang="ts">
import { Spinner } from '@podman-desktop/ui-svelte';

import Label from '/@/lib/ui/Label.svelte';

import { getResultStyle } from './update-image-util';
import type { UpdateImageInfoUI } from './UpdateImages.svelte';

interface Props {
  object: UpdateImageInfoUI;
}

let { object }: Props = $props();

let resultStyle = $derived(getResultStyle(object.updating, object.updated, object.error));
</script>

<div class="flex flex-col gap-1">
  {#if object.updating}
    <Label role="status" name="Updating">
      <Spinner size="12" />
    </Label>
  {:else if resultStyle}
    <Label role="status" name={resultStyle.label}>
      <div class="w-2 h-2 shrink-0 {resultStyle.dotColor} rounded-full"></div>
    </Label>
    {#if object.error}
      <div 
        class="text-xs text-[var(--pd-status-terminated)] truncate max-w-[200px]" 
        title={object.error}>
        {object.error}
      </div>
    {/if}
  {:else}
    <span class="text-[var(--pd-table-body-text-secondary)]">-</span>
  {/if}
</div>
