<script lang="ts">
import { faStop } from '@fortawesome/free-solid-svg-icons';

import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { SelectableExtensionDevelopmentFolderInfoUI } from './development-folder-info-ui';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();

async function stopExtension(): Promise<void> {
  if (!extensionFolder.extension) {
    return;
  }
  await window.stopExtension(extensionFolder.extension.id);
}
</script>

<ListItemButtonIcon
  title="Stop the extension"
  onClick={stopExtension}
  hidden={!extensionFolder.extension || extensionFolder.extension?.state === 'stopped'}
  icon={faStop} />
