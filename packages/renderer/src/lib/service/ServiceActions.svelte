<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { ServiceUI } from './ServiceUI';

export let service: ServiceUI;
export let detailed = false;

async function deleteService(): Promise<void> {
  service.status = 'DELETING';

  await window.kubernetesDeleteService(service.name);
}
</script>

<ListItemButtonIcon
  title="Delete Service"
  onClick={(): void => withConfirmation(deleteService, `delete service ${service.name}`)}
  detailed={detailed}
  icon={faTrash} />
