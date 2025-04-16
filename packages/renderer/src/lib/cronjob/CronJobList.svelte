<script lang="ts">
import { TableColumn, TableDurationColumn, TableRow, TableSimpleColumn } from '@podman-desktop/ui-svelte';
import moment from 'moment';

import { cronJobSearchPattern, kubernetesCurrentContextCronJobsFiltered } from '/@/stores/kubernetes-contexts-state';

import CronJobIcon from '../images/CronJobIcon.svelte';
import NameColumn from '../kube/column/Name.svelte';
import StatusColumn from '../kube/column/Status.svelte';
import KubernetesObjectsList from '../objects/KubernetesObjectsList.svelte';
import { capitalize } from '../ui/Util';
import { CronJobUtils } from './cronjob-utils';
import CronJobColumnActions from './CronJobColumnActions.svelte';
import CronJobEmptyScreen from './CronJobEmptyScreen.svelte';
import type { CronJobUI } from './CronJobUI';

// Search and "utility" functions for CronJob
interface Props {
  searchTerm?: string;
}
let { searchTerm = '' }: Props = $props();
$effect(() => {
  cronJobSearchPattern.set(searchTerm);
});
const cronjobUtils = new CronJobUtils();

let statusColumn = new TableColumn<CronJobUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: StatusColumn,
  comparator: (a, b): number => a.status.localeCompare(b.status),
});

let nameColumn = new TableColumn<CronJobUI>('Name', {
  width: '1.3fr',
  renderer: NameColumn,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let ageColumn = new TableColumn<CronJobUI, Date | undefined>('Age', {
  renderMapping: (cronjob): Date | undefined => cronjob.created,
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.created).diff(moment(a.created)),
});

let scheduleColumn = new TableColumn<CronJobUI, string>('Schedule', {
  renderMapping: (cronjob): string => cronjob.schedule,
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.schedule.localeCompare(b.schedule),
});

let suspendColumn = new TableColumn<CronJobUI, string>('Suspended', {
  renderMapping: (cronjob): string => capitalize(cronjob.suspended.toString()),
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.suspended.toString().localeCompare(b.suspended.toString()),
});

// This column just lists the number of active jobs at the moment, we do not link to the pods, etc (yet).. maybe in the future
let activeColumn = new TableColumn<CronJobUI, string>('Active', {
  renderMapping: (cronjob): string => cronjob.active?.toString() ?? '',
  renderer: TableSimpleColumn,
  comparator: (a, b): number => (a.active?.toString() ?? '').localeCompare(b.active?.toString() ?? ''),
});

let lastScheduleColumn = new TableColumn<CronJobUI, Date | undefined>('Last scheduled', {
  renderMapping: (cronjob): Date | undefined => cronjob.lastScheduleTime,
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.lastScheduleTime).diff(moment(a.lastScheduleTime)),
});

const columns = [
  statusColumn,
  nameColumn,
  scheduleColumn,
  lastScheduleColumn,
  suspendColumn,
  activeColumn,
  ageColumn,
  new TableColumn<CronJobUI>('Actions', { align: 'right', renderer: CronJobColumnActions }),
];

const row = new TableRow<CronJobUI>({ selectable: (_cronjob): boolean => true });
</script>

<KubernetesObjectsList
  kinds={[{
    resource: 'cronjobs',
    transformer: cronjobUtils.getCronJobUI,
    delete: window.kubernetesDeleteCronJob,
    isResource: (): boolean => true,
    legacySearchPatternStore: cronJobSearchPattern,
    legacyObjectStore: kubernetesCurrentContextCronJobsFiltered,
  }]}
  singular="CronJob"
  plural="CronJobs"
  icon={CronJobIcon}
  searchTerm={searchTerm}
  columns={columns}
  row={row}
  >
  <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
  {#snippet emptySnippet()}
    <CronJobEmptyScreen />
  {/snippet}
</KubernetesObjectsList>
