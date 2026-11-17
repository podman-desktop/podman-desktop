<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import { t } from '/@/lib/i18n/translations.svelte';
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
  title={t('kubernetes.resources.delete', { kind: 'CronJob' }) ?? 'Delete CronJob'}
  onClick={(): void => withConfirmation(deleteCronJob, `delete cronjob ${cronjob.name}`, { title: t('kubernetes.resources.deleteTitle', { kind: 'CronJob' }) ?? 'Delete CronJob?', message: t('kubernetes.resources.deleteMessage', { kind: 'CronJob', name: cronjob.name }) ?? `Are you sure you want to delete cronjob ${cronjob.name}?`, variant: 'delete' })}
  detailed={detailed}
  icon={faTrash} />
