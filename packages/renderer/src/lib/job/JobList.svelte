<script lang="ts">
import { TableColumn, TableDurationColumn, TableRow } from '@podman-desktop/ui-svelte';
import moment from 'moment';

import JobIcon from '/@/lib/images/JobIcon.svelte';
import NameColumn from '/@/lib/kube/column/Name.svelte';
import StatusColumn from '/@/lib/kube/column/Status.svelte';
import KubernetesObjectsList from '/@/lib/objects/KubernetesObjectsList.svelte';
import { jobSearchPattern, kubernetesCurrentContextJobsFiltered } from '/@/stores/kubernetes-contexts-state';

import ActionsColumn from './columns/Actions.svelte';
import CompletionsColumn from './columns/Completions.svelte';
import ConditionsColumn from './columns/Conditions.svelte';
import { JobUtils } from './job-utils';
import JobEmptyScreen from './JobEmptyScreen.svelte';
import type { JobUI } from './JobUI';

// Search and "utility" functions for Job
interface Props {
  searchTerm?: string;
}
let { searchTerm = '' }: Props = $props();
$effect(() => {
  jobSearchPattern.set(searchTerm);
});
const jobUtils = new JobUtils();

let statusColumn = new TableColumn<JobUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: StatusColumn,
  comparator: (a, b): number => a.status.localeCompare(b.status),
});

let nameColumn = new TableColumn<JobUI>('Name', {
  width: '1.3fr',
  renderer: NameColumn,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let ageColumn = new TableColumn<JobUI, Date | undefined>('Age', {
  renderMapping: (job): Date | undefined => job.created,
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.created).diff(moment(a.created)),
});

let conditionColumn = new TableColumn<JobUI>('Conditions', {
  renderer: ConditionsColumn,
  comparator: (a, b): number => a.condition.localeCompare(b.condition),
});

let completionColumn = new TableColumn<JobUI>('Completions', {
  renderer: CompletionsColumn,
  comparator: (a, b): number => a.succeeded.toString().localeCompare(b.succeeded.toString()),
});

const columns = [
  statusColumn,
  nameColumn,
  conditionColumn,
  completionColumn,
  ageColumn,
  new TableColumn<JobUI>('Actions', { align: 'right', renderer: ActionsColumn }),
];

const row = new TableRow<JobUI>({ selectable: (_job): boolean => true });
</script>

<KubernetesObjectsList
  kinds={[{
    resource: 'jobs',
    transformer: jobUtils.getJobUI,
    delete: window.kubernetesDeleteJob,
    isResource: (): boolean => true,
    legacySearchPatternStore: jobSearchPattern,
    legacyObjectStore: kubernetesCurrentContextJobsFiltered,
  }]}
  singular="Job"
  plural="Jobs"
  icon={JobIcon}
  searchTerm={searchTerm}
  columns={columns}
  row={row}
  >
  <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
  {#snippet emptySnippet()}
    <JobEmptyScreen />
  {/snippet}
</KubernetesObjectsList>
