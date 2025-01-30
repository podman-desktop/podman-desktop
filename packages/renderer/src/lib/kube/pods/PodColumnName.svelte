<script lang="ts">
import { router } from 'tinro';

import type { PodUI } from './PodUI';

interface Props {
  object: PodUI;
}
let { object }: Props = $props();

function openDetails(): void {
  router.goto(`/kubernetes/pods/${encodeURI(object.name)}/${encodeURI(object.namespace)}/summary`);
}
</script>

<button class="hover:cursor-pointer flex flex-col max-w-full" onclick={openDetails}>
  <div class="text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis">
    {object.name}
  </div>
  <div class="flex flex-row text-sm gap-1">
    {#if object.namespace}
      <div class="font-extra-light text-[var(--pd-table-body-text)]">{object.namespace}</div>
    {/if}
  </div>
</button>
