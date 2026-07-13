<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import LoadingIconButton from '/@/lib/ui/LoadingIconButton.svelte';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';
import { fetchWebviews } from '/@/stores/webviews';

import { isExtensionRemovableInUi } from './extension-origin-utils';
import { prototypeRemoveExtension } from './extension-prototype-use-cases';
import { resolveInstalledExtensionRuntimeId } from './extension-runtime-id';
import { areExtensionsImprovementsSuggested } from './extensions-prototype-scope';

interface Props {
  extension: CombinedExtensionInfoUI;
}

let { extension }: Props = $props();

let inProgress = $state(false);

async function deleteExtension(): Promise<void> {
  if (areExtensionsImprovementsSuggested()) {
    prototypeRemoveExtension(extension.id);
    return;
  }

  inProgress = true;
  try {
    if (extension.type === 'dd') {
      await window.ddExtensionDelete(extension.id);
    } else {
      await window.removeExtension(resolveInstalledExtensionRuntimeId(extension));
      await fetchWebviews();
    }
  } catch (error) {
    await window.showMessageBox({
      title: 'Uninstall failed',
      message: error instanceof Error ? error.message : 'Unable to uninstall extension',
      type: 'danger',
    });
  } finally {
    inProgress = false;
  }
}
</script>

  <LoadingIconButton
    clickAction={deleteExtension}
    action="delete"
    icon={faTrash}
    state={{
      status: extension.type === 'dd' ? 'stopped' : isExtensionRemovableInUi(extension) ? extension.state : '',
      inProgress,
    }} />
