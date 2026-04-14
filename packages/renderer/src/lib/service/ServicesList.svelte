<script lang="ts">
import { TableColumn, TableDurationColumn, TableRow, TableSimpleColumn } from '@podman-desktop/ui-svelte';
import moment from 'moment';

import ServiceIcon from '/@/lib/images/ServiceIcon.svelte';
import NameColumn from '/@/lib/kube/column/Name.svelte';
import StatusColumn from '/@/lib/kube/column/Status.svelte';
import KubernetesObjectsList from '/@/lib/objects/KubernetesObjectsList.svelte';
import { kubernetesCurrentContextServicesFiltered, serviceSearchPattern } from '/@/stores/kubernetes-contexts-state';

import ActionsColumn from './columns/Actions.svelte';
import TypeColumn from './columns/Type.svelte';
import { ServiceUtils } from './service-utils';
import ServiceEmptyScreen from './ServiceEmptyScreen.svelte';
import type { ServiceUI } from './ServiceUI';

interface Props {
  searchTerm?: string;
}

let { searchTerm = '' }: Props = $props();

$effect(() => {
  serviceSearchPattern.set(searchTerm);
});

const serviceUtils = new ServiceUtils();

let statusColumn = new TableColumn<ServiceUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: StatusColumn,
  comparator: (a, b): number => a.status.localeCompare(b.status),
});

let nameColumn = new TableColumn<ServiceUI>('Name', {
  width: '1.3fr',
  renderer: NameColumn,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let typeColumn = new TableColumn<ServiceUI>('Type', {
  renderer: TypeColumn,
  overflow: true,
  comparator: (a, b): number => a.type.localeCompare(b.type),
});

let clusterIPColumn = new TableColumn<ServiceUI, string>('Cluster IP', {
  renderMapping: (service): string => service.clusterIP,
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.clusterIP.localeCompare(b.clusterIP),
});

let portsColumn = new TableColumn<ServiceUI, string>('Ports', {
  width: '2fr',
  renderMapping: (service): string => service.ports,
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.ports.localeCompare(b.ports),
});

let ageColumn = new TableColumn<ServiceUI, Date | undefined>('Age', {
  renderMapping: (service): Date | undefined => service.created,
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.created).diff(moment(a.created)),
});

const columns = [
  statusColumn,
  nameColumn,
  typeColumn,
  clusterIPColumn,
  portsColumn,
  ageColumn,
  new TableColumn<ServiceUI>('Actions', { align: 'right', renderer: ActionsColumn }),
];

const row = new TableRow<ServiceUI>({ selectable: (_service): boolean => true });
</script>

<KubernetesObjectsList
  kinds={[{
    resource: 'services',
    transformer: serviceUtils.getServiceUI,
    delete: window.kubernetesDeleteService,
    isResource: (): boolean => true,
    legacySearchPatternStore: serviceSearchPattern,
    legacyObjectStore: kubernetesCurrentContextServicesFiltered,
  }]}
  singular="service"
  plural="services"
  icon={ServiceIcon}
  searchTerm={searchTerm}
  columns={columns}
  row={row}
>
  <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
  {#snippet emptySnippet()}
    <ServiceEmptyScreen />
  {/snippet}
</KubernetesObjectsList>
