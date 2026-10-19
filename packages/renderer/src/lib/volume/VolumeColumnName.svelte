<script lang="ts">
import { router } from 'tinro';

import { openRouteInBackgroundTab } from '/@/stores/layout/tabs.svelte';

import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  object: VolumeInfoUI;
}

let { object }: Props = $props();

function openDetailsVolume(volume: VolumeInfoUI, event: MouseEvent): void {
  const url = `/volumes/${encodeURIComponent(volume.name)}/${encodeURIComponent(volume.engineId)}/summary`;
  if (event.metaKey || event.ctrlKey) {
    openRouteInBackgroundTab(url, volume.name);
    return;
  }
  router.goto(url);
}
</script>

<button
  class="hover:cursor-pointer flex text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis"
  onclick={(event: MouseEvent): void => openDetailsVolume(object, event)}>
  {object.shortName}
</button>
