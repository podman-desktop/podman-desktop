<script lang="ts">
import { router } from 'tinro';

import type { NetworkInfoUI } from '../NetworkInfoUI';

interface Props {
  object: NetworkInfoUI;
}

let { object }: Props = $props();

function openDetailsNetwork(network: NetworkInfoUI): void {
  router.goto(`/networks/${encodeURI(network.name)}/${encodeURI(network.engineId)}/summary`);
}
</script>

<button
  class="hover:cursor-pointer flex text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis"
  onclick={(): void => openDetailsNetwork(object)}>
  {object.shortId}
</button>
