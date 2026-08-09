<script lang="ts">
import { NavigationPage } from '@desktop-framework/api';
import { ContextMenu } from '@podman-desktop/ui-svelte';

import { buildOpenContextMenuActions, openImageInWorkspace } from '/@/lib/layout/resource-open-actions';
import Badge from '/@/lib/ui/Badge.svelte';
import { handleNavigation } from '/@/navigation';

import type { ImageInfoUI } from './ImageInfoUI';

interface Props {
  object: ImageInfoUI;
}

let { object }: Props = $props();

let contextMenu: { x: number; y: number } | undefined = $state();

// Manifests don't have a workspace tab yet, so they keep using the legacy detail route.
function openManifestDetails(image: ImageInfoUI): void {
  handleNavigation({
    page: NavigationPage.MANIFEST,
    parameters: { id: image.id, engineId: image.engineId, tag: image.tag ? `${image.name}:${image.tag}` : image.name },
  });
}

// A plain click opens straight into the workspace tab (replacing whatever was showing),
// same destination Cmd/Ctrl+click uses for a new tab - no intermediate detail route/flash.
function onClick(event: MouseEvent): void {
  if (object.isManifest) {
    openManifestDetails(object);
    return;
  }
  openImageInWorkspace(object, event.metaKey || event.ctrlKey ? 'newTab' : 'replace');
}

function onContextMenu(event: MouseEvent): void {
  if (object.isManifest) return;
  event.preventDefault();
  contextMenu = { x: event.clientX, y: event.clientY };
}
</script>

<button class="flex flex-col max-w-full" onclick={onClick} oncontextmenu={onContextMenu}>
  <div class="flex flex-row gap-1 items-center max-w-full">
    <div class="text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis">
      {object.name}
      {object.isManifest ? ' (manifest)' : ''}
    </div>
    {#if object.badges.length}
      {#each object.badges as badge, index (index)}
        <Badge color={badge.color} label={badge.label} />
      {/each}
    {/if}
  </div>
  <div class="flex flex-row text-sm gap-1 w-full">
    <div class="text-[var(--pd-table-body-text-sub-secondary)]">{object.shortId}</div>
    <div class="font-extra-light text-[var(--pd-table-body-text)] overflow-hidden text-ellipsis">{object.tag}</div>
  </div>
</button>

{#if contextMenu}
  <ContextMenu
    x={contextMenu.x}
    y={contextMenu.y}
    actions={buildOpenContextMenuActions((mode): void => openImageInWorkspace(object, mode))}
    onClose={(): void => {
      contextMenu = undefined;
    }} />
{/if}
