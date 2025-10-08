<script lang="ts">
import type { NetworkInfoUI } from './NetworkInfoUI';

export let object: NetworkInfoUI;

function openDetailsVolume(): void {}
</script>

<button
  class="hover:cursor-pointer flex text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis"
  on:click={(): void => openDetailsVolume()}>
  {object.name}
</button>
