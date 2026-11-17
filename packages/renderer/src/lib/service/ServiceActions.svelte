<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import { t } from '/@/lib/i18n/translations.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { ServiceUI } from './ServiceUI';

interface Props {
  service: ServiceUI;
  detailed?: boolean;
}

let { service, detailed = false }: Props = $props();

async function deleteService(): Promise<void> {
  service.status = 'DELETING';

  await window.kubernetesDeleteService(service.name);
}
</script>

<ListItemButtonIcon
  title={t('kubernetes.resources.delete', { kind: 'Service' }) ?? 'Delete Service'}
  onClick={(): void => withConfirmation(deleteService, `delete service ${service.name}`, { title: t('kubernetes.resources.deleteTitle', { kind: 'Service' }) ?? 'Delete Service?', message: t('kubernetes.resources.deleteMessage', { kind: 'Service', name: service.name }) ?? `Are you sure you want to delete service ${service.name}?`, variant: 'delete' })}
  detailed={detailed}
  icon={faTrash} />
