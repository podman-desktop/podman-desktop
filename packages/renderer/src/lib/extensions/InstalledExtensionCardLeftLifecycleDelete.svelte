<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import LoadingIconButton from '/@/lib/ui/LoadingIconButton.svelte';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

interface Props {
  extension: CombinedExtensionInfoUI;
}

let { extension }: Props = $props();

let inProgress = $state(false);

async function deleteExtension(): Promise<void> {
  inProgress = true;
  if (extension.type === 'dd') {
    await window.ddExtensionDelete(extension.id);
  } else {
    await window.removeExtension(extension.id);
  }
  inProgress = false;
}
</script>

  <LoadingIconButton
    clickAction={deleteExtension}
    action="delete"
    icon={faTrash}
    state={{ status: extension.type === 'dd' ? 'stopped' : extension.removable ? extension.state : '', inProgress }} />
