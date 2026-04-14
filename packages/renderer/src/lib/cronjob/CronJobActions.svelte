<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { CronJobUI } from './CronJobUI';

interface Props {
  cronjob: CronJobUI;
  detailed?: boolean;
}
let { cronjob, detailed = false }: Props = $props();

async function deleteCronJob(): Promise<void> {
  cronjob.status = 'DELETING';

  await window.kubernetesDeleteCronJob(cronjob.name);
}
</script>

<ListItemButtonIcon
  title="Delete CronJob"
  onClick={(): void => withConfirmation(deleteCronJob, `delete cronjob ${cronjob.name}`)}
  detailed={detailed}
  icon={faTrash} />
