<script lang="ts">
import { TableColumn, TableDurationColumn, TableRow, TableSimpleColumn } from '@podman-desktop/ui-svelte';
import moment from 'moment';

import NodeIcon from '/@/lib/images/NodeIcon.svelte';
import NameColumn from '/@/lib/kube/column/Name.svelte';
import StatusColumn from '/@/lib/kube/column/Status.svelte';
import KubernetesObjectsList from '/@/lib/objects/KubernetesObjectsList.svelte';
import { kubernetesCurrentContextNodesFiltered, nodeSearchPattern } from '/@/stores/kubernetes-contexts-state';

import RolesColumn from './columns/Roles.svelte';
import { NodeUtils } from './node-utils';
import NodeEmptyScreen from './NodeEmptyScreen.svelte';
import type { NodeUI } from './NodeUI';

interface Props {
  searchTerm?: string;
}

let { searchTerm = '' }: Props = $props();

$effect(() => {
  nodeSearchPattern.set(searchTerm);
});

const nodeUtils = new NodeUtils();

let statusColumn = new TableColumn<NodeUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: StatusColumn,
  comparator: (a, b): number => a.status.localeCompare(b.status),
});

let nameColumn = new TableColumn<NodeUI>('Name', {
  renderer: NameColumn,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let rolesColumn = new TableColumn<NodeUI>('Roles', {
  renderer: RolesColumn,
  overflow: true,
  comparator: (a, b): number => a.role.localeCompare(b.role),
});

let ageColumn = new TableColumn<NodeUI, Date | undefined>('Age', {
  renderMapping: (node): Date | undefined => node.created,
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.created).diff(moment(a.created)),
});

let versionColumn = new TableColumn<NodeUI, string>('Version', {
  renderMapping: (node): string => node.version,
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.version.localeCompare(b.version),
});

let osImageColumn = new TableColumn<NodeUI, string>('OS', {
  width: '1.5fr',
  renderMapping: (node): string => node.osImage,
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.osImage.localeCompare(b.osImage),
});

let kernelVersionColumn = new TableColumn<NodeUI, string>('Kernel', {
  renderMapping: (node): string => node.kernelVersion,
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.kernelVersion.localeCompare(b.kernelVersion),
});

const columns = [statusColumn, nameColumn, rolesColumn, versionColumn, osImageColumn, kernelVersionColumn, ageColumn];

const row = new TableRow<NodeUI>({});
</script>

<KubernetesObjectsList
  kinds={[{
    resource: 'nodes',
    transformer: nodeUtils.getNodeUI.bind(nodeUtils),
    delete: async (): Promise<void> => {},
    isResource: (): boolean => true,
    legacySearchPatternStore: nodeSearchPattern,
    legacyObjectStore: kubernetesCurrentContextNodesFiltered,
  }]}
  singular="node"
  plural="nodes"
  icon={NodeIcon}
  searchTerm={searchTerm}
  columns={columns}
  row={row}
  >
    <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
    {#snippet emptySnippet()}
      <NodeEmptyScreen />
    {/snippet}
  </KubernetesObjectsList>
