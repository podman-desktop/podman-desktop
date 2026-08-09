<script lang="ts">
import { ContextMenu } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import { buildOpenContextMenuActions, openPodInWorkspace } from '/@/lib/layout/resource-open-actions';

import type { ContainerGroupInfoUI } from './ContainerInfoUI';
import { ContainerGroupInfoTypeUI } from './ContainerInfoUI';

interface Props {
  object: ContainerGroupInfoUI;
}

let { object }: Props = $props();

let contextMenu: { x: number; y: number } | undefined = $state();

function displayContainersCount(containerGroup: ContainerGroupInfoUI): string {
  let result = containerGroup.allContainersCount + ' container' + (containerGroup.allContainersCount > 1 ? 's' : '');
  if (containerGroup.containers.length !== containerGroup.allContainersCount) {
    result += ` (${containerGroup.allContainersCount - containerGroup.containers.length} filtered)`;
  }
  return result;
}

// Compose groups don't have a workspace tab yet, so they keep using the legacy detail route.
function openComposeDetails(containerGroup: ContainerGroupInfoUI): void {
  if (!containerGroup.engineId) {
    return;
  }
  router.goto(`/compose/details/${encodeURI(containerGroup.name)}/${encodeURI(containerGroup.engineId)}/logs`);
}

// A plain click on a pod group opens straight into the workspace tab (replacing whatever
// was showing), same destination Cmd/Ctrl+click uses for a new tab - no intermediate
// detail route/flash.
function onClick(event: MouseEvent): void {
  if (!object.engineId) return;
  if (object.type === ContainerGroupInfoTypeUI.POD) {
    openPodInWorkspace(
      { name: object.name, engineId: object.engineId },
      event.metaKey || event.ctrlKey ? 'newTab' : 'replace',
    );
  } else {
    openComposeDetails(object);
  }
}

function onContextMenu(event: MouseEvent): void {
  if (!object.engineId || object.type !== ContainerGroupInfoTypeUI.POD) return;
  event.preventDefault();
  contextMenu = { x: event.clientX, y: event.clientY };
}
</script>

<button
  class="flex flex-col text-[var(--pd-table-body-text-highlight)] max-w-full text-left"
  title={object.type}
  onclick={onClick}
  oncontextmenu={onContextMenu}>
  <div class="max-w-full overflow-hidden text-ellipsis">
    {object.name} ({object.type})
  </div>
  <div class="text-sm font-extra-light text-[var(--pd-table-body-text)]">
    {displayContainersCount(object)}
  </div>
</button>

{#if contextMenu && object.engineId}
  <ContextMenu
    x={contextMenu.x}
    y={contextMenu.y}
    actions={buildOpenContextMenuActions((mode): void => openPodInWorkspace({ name: object.name, engineId: object.engineId ?? '' }, mode))}
    onClose={(): void => {
      contextMenu = undefined;
    }} />
{/if}
