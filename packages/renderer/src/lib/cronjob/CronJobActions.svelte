<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';

import ListItemButtonIcon from '../ui/ListItemButtonIcon.svelte';
import type { CronJobUI } from './CronJobUI';

let {
  cronjob,
  detailed = false,
}: {
  cronjob: CronJobUI;
  detailed: boolean;
} = $props();

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
