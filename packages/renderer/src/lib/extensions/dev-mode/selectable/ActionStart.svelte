<script lang="ts">
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();

async function startExtension(): Promise<void> {
  if (!extensionFolder.extension) {
    return;
  }
  await window.startExtension(extensionFolder.extension.id);
}
</script>

<ListItemButtonIcon
  title="Start the extension"
  onClick={startExtension}
  hidden={!extensionFolder.extension || extensionFolder.extension?.state === 'started'}
  icon={faPlay} />
