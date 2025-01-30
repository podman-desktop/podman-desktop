<script lang="ts">
import { router } from 'tinro';

import type { ServiceUI } from './ServiceUI';

interface Props {
  object: ServiceUI;
}
let { object }: Props = $props();

function openDetails(): void {
  router.goto(`/kubernetes/services/${encodeURI(object.name)}/${encodeURI(object.namespace)}/summary`);
}
</script>

<button class="hover:cursor-pointer flex flex-col max-w-full" onclick={openDetails}>
  <div class="text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis">
    {object.name}
  </div>
  <div class="flex flex-row text-sm gap-1">
    {#if object.loadBalancerIPs}
      <div class="text-[var(--pd-table-body-text-sub-secondary)]">{object.loadBalancerIPs}</div>
    {/if}
    {#if object.namespace}
      <div class="font-extra-light text-[var(--pd-table-body-text)]">{object.namespace}</div>
    {/if}
  </div>
</button>
