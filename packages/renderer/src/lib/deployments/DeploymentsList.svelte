<script lang="ts">
import { TableColumn, TableDurationColumn, TableRow } from '@podman-desktop/ui-svelte';
import moment from 'moment';

import DeploymentIcon from '/@/lib/images/DeploymentIcon.svelte';
import NameColumn from '/@/lib/kube/column/Name.svelte';
import StatusColumn from '/@/lib/kube/column/Status.svelte';
import KubernetesObjectsList from '/@/lib/objects/KubernetesObjectsList.svelte';
import {
  deploymentSearchPattern,
  kubernetesCurrentContextDeploymentsFiltered,
} from '/@/stores/kubernetes-contexts-state';

import ActionsColumn from './columns/Actions.svelte';
import ConditionsColumn from './columns/Conditions.svelte';
import PodsColumn from './columns/Pods.svelte';
import { DeploymentUtils } from './deployment-utils';
import DeploymentEmptyScreen from './DeploymentEmptyScreen.svelte';
import type { DeploymentUI } from './DeploymentUI';

interface Props {
  searchTerm?: string;
}

let { searchTerm = '' }: Props = $props();

const deploymentUtils = new DeploymentUtils();

let statusColumn = new TableColumn<DeploymentUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: StatusColumn,
  comparator: (a, b): number => a.status.localeCompare(b.status),
});

let nameColumn = new TableColumn<DeploymentUI>('Name', {
  renderer: NameColumn,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let conditionsColumn = new TableColumn<DeploymentUI>('Conditions', {
  width: '2fr',
  overflow: true,
  renderer: ConditionsColumn,
});

let podsColumn = new TableColumn<DeploymentUI>('Pods', {
  renderer: PodsColumn,
});

let ageColumn = new TableColumn<DeploymentUI, Date | undefined>('Age', {
  renderMapping: (deployment): Date | undefined => deployment.created,
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.created).diff(moment(a.created)),
});

const columns = [
  statusColumn,
  nameColumn,
  conditionsColumn,
  podsColumn,
  ageColumn,
  new TableColumn<DeploymentUI>('Actions', { align: 'right', renderer: ActionsColumn }),
];

const row = new TableRow<DeploymentUI>({ selectable: (_deployment): boolean => true });
</script>

<KubernetesObjectsList
  kinds={[{
    resource: 'deployments',
    transformer: deploymentUtils.getDeploymentUI,
    delete: window.kubernetesDeleteDeployment,
    isResource: (): boolean => true,
    legacySearchPatternStore: deploymentSearchPattern,
    legacyObjectStore: kubernetesCurrentContextDeploymentsFiltered,
  }]}
  singular="deployment"
  plural="deployments"
  icon={DeploymentIcon}
  searchTerm={searchTerm}
  columns={columns}
  row={row}
  >
    <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
    {#snippet emptySnippet()}
      <DeploymentEmptyScreen />
    {/snippet}
  </KubernetesObjectsList>

