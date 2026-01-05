<script lang="ts">
import { openDetailsNetwork } from '/@/lib/network/network-utils';
import type { NetworkInfoUI } from '/@/lib/network/NetworkInfoUI';

interface Props {
  object: NetworkInfoUI;
}

let { object }: Props = $props();
</script>

<button
  class="hover:cursor-pointer flex text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis"
  onclick={(): void => openDetailsNetwork(object)}>
  {object.shortId}
</button>
