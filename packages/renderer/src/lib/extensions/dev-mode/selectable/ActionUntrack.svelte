<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import { forgetCustomInstalledExtension } from '/@/lib/extensions/extension-custom-local';
import { hidePrototypeDefaultCustomLocalRow } from '/@/lib/extensions/extension-custom-local-defaults';
import { prototypeRemoveExtension } from '/@/lib/extensions/extension-prototype-use-cases';
import { areExtensionsImprovementsSuggested } from '/@/lib/extensions/extensions-prototype-scope';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();

const isCustom = $derived(extensionFolder.source === 'custom');
const suggestionScope = $derived(areExtensionsImprovementsSuggested());
const displayName = $derived(
  extensionFolder.installedExtension?.displayName?.trim() ?? extensionFolder.extension?.name ?? extensionFolder.name,
);

async function performRemove(): Promise<void> {
  if (extensionFolder.prototypeDefault) {
    hidePrototypeDefaultCustomLocalRow(extensionFolder.path);
    if (extensionFolder.extension) {
      prototypeRemoveExtension(extensionFolder.extension.id);
      forgetCustomInstalledExtension(extensionFolder.extension.id);
    }
    return;
  }

  if (isCustom && extensionFolder.extension) {
    if (suggestionScope) {
      // Match Installed-tab uninstall: hide in prototype UI (backend may still have the image).
      prototypeRemoveExtension(extensionFolder.extension.id);
      forgetCustomInstalledExtension(extensionFolder.extension.id);
      return;
    }
    await window.removeExtension(extensionFolder.extension.id);
    forgetCustomInstalledExtension(extensionFolder.extension.id);
    return;
  }

  await window.untrackExtensionFolder(extensionFolder.path);
  if (extensionFolder.extension) {
    await window.removeExtension(extensionFolder.extension.id);
  }
}

function removeOrUntrack(): void {
  withConfirmation(
    () => {
      performRemove().catch((error: unknown) => {
        console.error(error);
      });
    },
    `uninstall ${displayName}`,
    { title: 'Uninstall extension?', variant: 'delete', buttonLabel: 'Uninstall' },
  );
}
</script>

<Tooltip top tip="Uninstall">
  <span class="inline-flex">
    <ListItemButtonIcon title="Uninstall" onClick={removeOrUntrack} icon={faTrash} />
  </span>
</Tooltip>
