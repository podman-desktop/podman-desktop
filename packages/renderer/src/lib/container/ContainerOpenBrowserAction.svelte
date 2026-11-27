<script lang="ts">
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';

import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { ContainerInfoUI } from './ContainerInfoUI';

interface Props {
  container: ContainerInfoUI;
  // true when rendered as an item of the kebab menu of a containers list row
  dropdownMenu: boolean;
  // true when rendered as a button of the container details page header
  detailed: boolean;
}

let { container, dropdownMenu, detailed }: Props = $props();

function openUrl(url: string | undefined): void {
  if (!url) {
    return;
  }
  window.openExternal(url).catch((err: unknown) => console.error(`Error opening URL ${url}`, err));
}
</script>

<ListItemButtonIcon
  title="Open Browser"
  onClick={(): void => openUrl(container.openingUrl)}
  menu={dropdownMenu}
  enabled={container.state === 'RUNNING' && container.hasPublicPort}
  hidden={dropdownMenu && container.state !== 'RUNNING'}
  detailed={detailed}
  icon={faExternalLinkSquareAlt} />
