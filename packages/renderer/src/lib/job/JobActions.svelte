<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';

import ListItemButtonIcon from '../ui/ListItemButtonIcon.svelte';
import type { JobUI } from './JobUI';

let {
  job,
  detailed = false,
}: {
  job: JobUI;
  detailed?: boolean;
} = $props();

async function deleteJob(): Promise<void> {
  job.status = 'DELETING';

  await window.kubernetesDeleteJob(job.name);
}
</script>

<ListItemButtonIcon
  title="Delete Job"
  onClick={(): void => withConfirmation(deleteJob, `delete job ${job.name}`)}
  detailed={detailed}
  icon={faTrash} />
