<script lang="ts">
import { openDetailsNetwork } from '/@/lib/network/network-utils';
import type { NetworkInfoUI } from '/@/lib/network/NetworkInfoUI';
import { openRouteInBackgroundTab, opensInNewTab } from '/@/stores/layout/tabs.svelte';

interface Props {
  object: NetworkInfoUI;
}

let { object }: Props = $props();

function onClick(event: MouseEvent): void {
  if (opensInNewTab(event)) {
    openRouteInBackgroundTab(
      `/networks/${encodeURIComponent(object.name)}/${encodeURIComponent(object.engineId)}/summary`,
      object.name,
    );
    return;
  }
  openDetailsNetwork(object);
}

function onAuxClick(event: MouseEvent): void {
  if (event.button !== 1) return;
  event.preventDefault();
  onClick(event);
}
</script>

<button
  class="hover:cursor-pointer flex text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis"
  onclick={onClick}
  onauxclick={onAuxClick}>
  {object.name}
</button>
