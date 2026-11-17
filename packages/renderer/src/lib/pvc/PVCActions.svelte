<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import { t } from '/@/lib/i18n/translations.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { PVCUI } from './PVCUI';

interface Props {
  pvc: PVCUI;
  detailed?: boolean;
}

let { pvc, detailed = false }: Props = $props();

async function deletePVC(): Promise<void> {
  pvc.status = 'DELETING';

  await window.kubernetesDeletePersistentVolumeClaim(pvc.name);
}
</script>

<ListItemButtonIcon
  title={t('kubernetes.resources.delete', { kind: 'PersistentVolumeClaim' }) ?? 'Delete PersistentVolumeClaim'}
  onClick={(): void => withConfirmation(deletePVC, `delete pvc ${pvc.name}`, { title: t('kubernetes.resources.deleteTitle', { kind: 'PVC' }) ?? 'Delete PVC?', message: t('kubernetes.resources.deleteMessage', { kind: 'PVC', name: pvc.name }) ?? `Are you sure you want to delete pvc ${pvc.name}?`, variant: 'delete' })}
  detailed={detailed}
  icon={faTrash} />
