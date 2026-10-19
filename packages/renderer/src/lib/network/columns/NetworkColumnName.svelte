<script lang="ts">
import { openDetailsNetwork } from '/@/lib/network/network-utils';
import type { NetworkInfoUI } from '/@/lib/network/NetworkInfoUI';
import { openRouteInBackgroundTab } from '/@/stores/layout/tabs.svelte';

interface Props {
  object: NetworkInfoUI;
}

let { object }: Props = $props();
</script>

<button
  class="hover:cursor-pointer flex text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis"
  onclick={(event: MouseEvent): void => {
    if (event.metaKey || event.ctrlKey) {
      openRouteInBackgroundTab(
        `/networks/${encodeURIComponent(object.name)}/${encodeURIComponent(object.engineId)}/summary`,
        object.name,
      );
      return;
    }
    openDetailsNetwork(object);
  }}>
  {object.name}
</button>
