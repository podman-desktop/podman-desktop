<script lang="ts">
import { router } from 'tinro';

import { openRouteInBackgroundTab, opensInNewTab } from '/@/stores/layout/tabs.svelte';

import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  object: VolumeInfoUI;
}

let { object }: Props = $props();

function openDetailsVolume(volume: VolumeInfoUI, event: MouseEvent): void {
  const url = `/volumes/${encodeURIComponent(volume.name)}/${encodeURIComponent(volume.engineId)}/summary`;
  if (opensInNewTab(event)) {
    openRouteInBackgroundTab(url, volume.name);
    return;
  }
  router.goto(url);
}

function onAuxClick(event: MouseEvent): void {
  if (event.button !== 1) return;
  event.preventDefault();
  openDetailsVolume(object, event);
}
</script>

<button
  class="hover:cursor-pointer flex text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis"
  onclick={(event: MouseEvent): void => openDetailsVolume(object, event)}
  onauxclick={onAuxClick}>
  {object.shortName}
</button>
