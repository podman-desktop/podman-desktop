<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
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
  title="Delete Service"
  onClick={(): void => withConfirmation(deleteService, `delete service ${service.name}`, { title: 'Delete Service?', variant: 'delete' })}
  detailed={detailed}
  icon={faTrash} />
