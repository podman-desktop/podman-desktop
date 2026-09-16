<script lang="ts">
import { router } from 'tinro';

import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  object: VolumeInfoUI;
}

let { object }: Props = $props();

function openDetailsVolume(volume: VolumeInfoUI): void {
  router.goto(`/volumes/${encodeURI(volume.name)}/${encodeURI(volume.engineId)}/summary`);
}
</script>

<button
  class="hover:cursor-pointer flex text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis"
  onclick={(): void => openDetailsVolume(object)}>
  {object.shortName}
</button>
