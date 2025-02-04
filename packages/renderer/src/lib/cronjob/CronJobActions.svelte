<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { createEventDispatcher } from 'svelte';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';

import ListItemButtonIcon from '../ui/ListItemButtonIcon.svelte';
import type { CronJobUI } from './CronJobUI';

export let cronjob: CronJobUI;
export let detailed = false;

const dispatch = createEventDispatcher<{ update: CronJobUI }>();

export let onUpdate: (cronjob: CronJobUI) => void = cronjob => {
  dispatch('update', cronjob);
};

async function deleteCronJob(): Promise<void> {
  cronjob.status = 'DELETING';
  onUpdate(cronjob);

  await window.kubernetesDeleteCronJob(cronjob.name);
}
</script>

<ListItemButtonIcon
  title="Delete CronJob"
  onClick={(): void => withConfirmation(deleteCronJob, `delete cronjob ${cronjob.name}`)}
  detailed={detailed}
  icon={faTrash} />
