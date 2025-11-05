<script lang="ts">
import { handleNavigation } from '/@/navigation';
import { NavigationPage } from '/@api/navigation-page';

import type { NetworkInfoUI } from '../NetworkInfoUI';

interface Props {
  object: NetworkInfoUI;
}

let { object }: Props = $props();

function openDetailsNetwork(network: NetworkInfoUI): void {
  handleNavigation({ page: NavigationPage.NETWORK, parameters: { name: network.name, engineId: network.engineId } });
}
</script>

<button
  class="hover:cursor-pointer flex text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis"
  onclick={(): void => openDetailsNetwork(object)}>
  {object.shortId}
</button>
