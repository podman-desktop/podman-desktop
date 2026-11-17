<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import { t } from '/@/lib/i18n/translations.svelte';
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
  title={t('kubernetes.resources.delete', { kind: 'Deployment' }) ?? 'Delete Deployment'}
  onClick={(): void => withConfirmation(deleteDeployment, `delete deployment ${deployment.name}`, { title: t('kubernetes.resources.deleteTitle', { kind: 'Deployment' }) ?? 'Delete Deployment?', message: t('kubernetes.resources.deleteMessage', { kind: 'Deployment', name: deployment.name }) ?? `Are you sure you want to delete deployment ${deployment.name}?`, variant: 'delete' })}
  detailed={detailed}
  icon={faTrash} />
