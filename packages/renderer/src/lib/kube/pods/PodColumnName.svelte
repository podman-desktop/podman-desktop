<script lang="ts">
import type { PodUI } from './PodUI';

let {
  object,
}: {
  object: PodUI;
} = $props();
</script>

<div class="flex flex-col max-w-full">
  <div class="text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis">
    {object.name}
  </div>
  <div class="flex flex-row text-sm gap-1">
    {#if object.namespace}
      <div class="font-extra-light text-[var(--pd-table-body-text)]">{object.namespace}</div>
    {/if}
  </div>
</div>
