<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { PVCUI } from './PVCUI';

export let pvc: PVCUI;
export let detailed = false;

async function deletePVC(): Promise<void> {
  pvc.status = 'DELETING';

  await window.kubernetesDeletePersistentVolumeClaim(pvc.name);
}
</script>

<ListItemButtonIcon
  title="Delete PersistentVolumeClaim"
  onClick={(): void => withConfirmation(deletePVC, `delete pvc ${pvc.name}`)}
  detailed={detailed}
  icon={faTrash} />
