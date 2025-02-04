<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  FilteredEmptyScreen,
  NavPage,
  Table,
  TableColumn,
  TableDurationColumn,
  TableRow,
  TableSimpleColumn,
} from '@podman-desktop/ui-svelte';
import moment from 'moment';

import KubeActions from '/@/lib/kube/KubeActions.svelte';
import KubernetesCurrentContextConnectionBadge from '/@/lib/ui/KubernetesCurrentContextConnectionBadge.svelte';
import { cronJobSearchPattern, kubernetesCurrentContextCronJobsFiltered } from '/@/stores/kubernetes-contexts-state';

import { withBulkConfirmation } from '../actions/BulkActions';
import CronJobIcon from '../images/CronJobIcon.svelte';
import { capitalize } from '../ui/Util';
import { CronJobUtils } from './cronjob-utils';
import CronJobColumnActions from './CronJobColumnActions.svelte';
import CronJobColumnName from './CronJobColumnName.svelte';
import CronJobColumnStatus from './CronJobColumnStatus.svelte';
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
const cronjobs = $derived($kubernetesCurrentContextCronJobsFiltered.map(cronjob => cronjobUtils.getCronJobUI(cronjob)));

// Bulk deletion progress for cronjobs
let bulkDeleteInProgress = $state<boolean>(false);
let selectedItemsNumber = $state<number>(0);
async function deleteSelectedCronJobs(): Promise<void> {
  const selectedCronJobs = cronjobs.filter(cronjob => cronjob.selected);
  if (selectedCronJobs.length === 0) {
    return;
  }

  bulkDeleteInProgress = true;
  selectedCronJobs.forEach(cronjob => (cronjob.status = 'DELETING'));

  await Promise.all(
    selectedCronJobs.map(async cronjob => {
      try {
        await window.kubernetesDeleteCronJob(cronjob.name);
      } catch (e) {
        console.error('error while deleting cronjob', e);
      }
    }),
  );
  bulkDeleteInProgress = false;
}

// Columns / information
let table: Table;
let statusColumn = new TableColumn<CronJobUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: CronJobColumnStatus,
  comparator: (a, b): number => a.status.localeCompare(b.status),
});

let nameColumn = new TableColumn<CronJobUI>('Name', {
  width: '1.3fr',
  renderer: CronJobColumnName,
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

<NavPage bind:searchTerm={searchTerm} title="cronjobs">
  <svelte:fragment slot="additional-actions">
    <KubeActions />
  </svelte:fragment>

  <svelte:fragment slot="bottom-additional-actions">
    {#if selectedItemsNumber > 0}
      <Button
        on:click={(): void =>
          withBulkConfirmation(
            deleteSelectedCronJobs,
            `delete ${selectedItemsNumber} cronjob${selectedItemsNumber > 1 ? 's' : ''}`,
          )}
        title="Delete {selectedItemsNumber} selected items"
        inProgress={bulkDeleteInProgress}
        icon={faTrash} />
      <span>On {selectedItemsNumber} selected items.</span>
    {/if}
    <div class="flex grow justify-end">
      <KubernetesCurrentContextConnectionBadge />
    </div>
  </svelte:fragment>

  <div class="flex min-w-full h-full" slot="content">
    <Table
      kind="cronjob"
      bind:this={table}
      bind:selectedItemsNumber={selectedItemsNumber}
      data={cronjobs}
      columns={columns}
      row={row}
      defaultSortColumn="Name">
    </Table>

    {#if $kubernetesCurrentContextCronJobsFiltered.length === 0}
      {#if searchTerm}
        <FilteredEmptyScreen icon={CronJobIcon} kind="cronjobs" bind:searchTerm={searchTerm} />
      {:else}
        <CronJobEmptyScreen />
      {/if}
    {/if}
  </div>
</NavPage>
