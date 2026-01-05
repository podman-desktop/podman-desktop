<script lang="ts">
import { TableColumn, TableDurationColumn, TableRow } from '@podman-desktop/ui-svelte';
import moment from 'moment';

import PodIcon from '/@/lib/images/PodIcon.svelte';
import NameColumn from '/@/lib/kube/column/Name.svelte';
import StatusColumn from '/@/lib/kube/column/Status.svelte';
import KubernetesObjectsList from '/@/lib/objects/KubernetesObjectsList.svelte';
import { kubernetesCurrentContextPodsFiltered, podSearchPattern } from '/@/stores/kubernetes-contexts-state';

import { PodUtils } from './pod-utils';
import PodColumnActions from './PodColumnActions.svelte';
import PodColumnContainers from './PodColumnContainers.svelte';
import PodEmptyScreen from './PodEmptyScreen.svelte';
import type { PodUI } from './PodUI';

let {
  searchTerm = '',
}: {
  searchTerm?: string;
} = $props();

$effect(() => {
  podSearchPattern.set(searchTerm);
});

const podUtils = new PodUtils();

let statusColumn = new TableColumn<PodUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: StatusColumn,
  comparator: (a, b): number => b.status.localeCompare(a.status),
});

let nameColumn = new TableColumn<PodUI>('Name', {
  width: '2fr',
  renderer: NameColumn,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let containersColumn = new TableColumn<PodUI>('Containers', {
  renderer: PodColumnContainers,
  comparator: (a, b): number => a.containers.length - b.containers.length,
  initialOrder: 'descending',
  overflow: true,
});

let ageColumn = new TableColumn<PodUI, Date | undefined>('Age', {
  renderMapping: (pod): Date | undefined => pod.created,
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.created).diff(moment(a.created)),
});

const columns = [
  statusColumn,
  nameColumn,
  containersColumn,
  ageColumn,
  new TableColumn<PodUI>('Actions', { align: 'right', width: '150px', renderer: PodColumnActions, overflow: true }),
];

const row = new TableRow<PodUI>({ selectable: (_pod): boolean => true });
</script>

<KubernetesObjectsList
  kinds={[{
    resource: 'pods',
    transformer: podUtils.getPodUI.bind(podUtils),
    delete: window.kubernetesDeletePod,
    isResource: (): boolean => true,
    legacySearchPatternStore: podSearchPattern,
    legacyObjectStore: kubernetesCurrentContextPodsFiltered,
  }]}
  singular="pod"
  plural="pods"
  icon={PodIcon}
  searchTerm={searchTerm}
  columns={columns}
  row={row}
>
  <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
  {#snippet emptySnippet()}
    <PodEmptyScreen />
  {/snippet}
</KubernetesObjectsList>
