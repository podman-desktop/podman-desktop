<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { JobUI } from './JobUI';

interface Props {
  job: JobUI;
  detailed?: boolean;
}
let { job, detailed = false }: Props = $props();

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
