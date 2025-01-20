<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();

async function untrackExtensionFolder(): Promise<void> {
  await window.untrackExtensionFolder(extensionFolder.path);
  // ensure it's cleared from the disabled list
  if (extensionFolder.extension) {
    await window.removeExtension(extensionFolder.extension.id);
  }
}
</script>

<ListItemButtonIcon
  title="Untrack extension folder"
  hidden={extensionFolder.extension && extensionFolder.extension?.state !== 'stopped'}
  onClick={untrackExtensionFolder}
  icon={faTrash} />
