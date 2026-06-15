<script lang="ts">
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import {
  canToggleExtensionLifecycle,
  getExtensionLifecycleToggleLabel,
  isExtensionLifecycleEnabled,
} from '/@/lib/extensions/extension-lifecycle-toggle';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();

const extensionState = $derived(extensionFolder.extension?.state ?? 'stopped');
const toggleLabel = $derived(getExtensionLifecycleToggleLabel(extensionState));
const toggleIcon = $derived(isExtensionLifecycleEnabled(extensionState) ? faStop : faPlay);
const canToggle = $derived(!!extensionFolder.extension && canToggleExtensionLifecycle(extensionState));

async function toggleExtension(): Promise<void> {
  if (!extensionFolder.extension || !canToggle) {
    return;
  }

  if (isExtensionLifecycleEnabled(extensionState)) {
    await window.stopExtension(extensionFolder.extension.id);
  } else {
    await window.startExtension(extensionFolder.extension.id);
  }
}
</script>

<ListItemButtonIcon
  title="{toggleLabel} the extension"
  onClick={toggleExtension}
  hidden={!extensionFolder.extension}
  enabled={canToggle}
  icon={toggleIcon} />
