<script lang="ts">
import { faStop } from '@fortawesome/free-solid-svg-icons';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

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
const canStop = $derived(
  !!extensionFolder.extension &&
    (extensionFolder.extension.state === 'started' || extensionFolder.extension.state === 'starting'),
);
</script>

<ListItemButtonIcon
  title="Stop the extension"
  onClick={stopExtension}
  hidden={!extensionFolder.extension}
  enabled={canStop}
  icon={faStop} />
