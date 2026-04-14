<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { DeploymentUI } from './DeploymentUI';

interface Props {
  deployment: DeploymentUI;
  detailed?: boolean;
}

let { deployment, detailed = false }: Props = $props();

async function deleteDeployment(): Promise<void> {
  deployment.status = 'DELETING';

  await window.kubernetesDeleteDeployment(deployment.name);
}
</script>

<ListItemButtonIcon
  title="Delete Deployment"
  onClick={(): void => withConfirmation(deleteDeployment, `delete deployment ${deployment.name}`)}
  detailed={detailed}
  icon={faTrash} />
