<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import { t } from '/@/lib/i18n/translations.svelte';
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
  title={t('kubernetes.resources.delete', { kind: 'Job' }) ?? 'Delete Job'}
  onClick={(): void => withConfirmation(deleteJob, `delete job ${job.name}`, { title: t('kubernetes.resources.deleteTitle', { kind: 'Job' }) ?? 'Delete Job?', message: t('kubernetes.resources.deleteMessage', { kind: 'Job', name: job.name }) ?? `Are you sure you want to delete job ${job.name}?`, variant: 'delete' })}
  detailed={detailed}
  icon={faTrash} />
