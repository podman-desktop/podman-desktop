<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { SelectableExtensionDevelopmentFolderInfoUI } from './development-folder-info-ui';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();

async function untrackExtensionFolder(): Promise<void> {
  await window.untrackExtensionFolder(extensionFolder.path);
}
</script>

<ListItemButtonIcon
  title="Untrack extension folder"
  hidden={extensionFolder.extension && extensionFolder.extension?.state !== 'stopped'}
  onClick={untrackExtensionFolder}
  icon={faTrash} />
