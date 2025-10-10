<script lang="ts">
import type { NetworkInfoUI } from './NetworkInfoUI';

interface Props {
  object: NetworkInfoUI;
}

let { object }: Props = $props();
</script>

<button
  class="hover:cursor-pointer flex text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis"
 >
  {object.shortId}
</button>
