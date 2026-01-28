<script lang="ts">
import Label from '/@/lib/ui/Label.svelte';

import { getUpdateAvailableStyle } from './update-image-util';
import type { UpdateImageInfoUI } from './UpdateImages.svelte';

interface Props {
  object: UpdateImageInfoUI;
}

let { object }: Props = $props();

let statusStyle = $derived(getUpdateAvailableStyle(object.status));
</script>

<div class="flex flex-col gap-1 items-start text-left">
  <div class="flex items-start">
    <Label role="status" name={statusStyle.label}>
      <div class="w-2 h-2 shrink-0 {statusStyle.dotColor} rounded-full"></div>
    </Label>
  </div>
  {#if !object.status?.updateAvailable && object.status?.message}
    <div 
      class="text-xs text-[var(--pd-table-body-text-secondary)] truncate" 
      title={object.status.message}>
      {object.status.message}
    </div>
  {/if}
</div>
