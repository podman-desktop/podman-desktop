<script lang="ts">
import { TableColumn, TableDurationColumn, TableRow } from '@podman-desktop/ui-svelte';
import moment from 'moment';

import {
  deploymentSearchPattern,
  kubernetesCurrentContextDeploymentsFiltered,
} from '/@/stores/kubernetes-contexts-state';

import DeploymentIcon from '../images/DeploymentIcon.svelte';
import KubernetesObjectsList from '../objects/KubernetesObjectsList.svelte';
import { DeploymentUtils } from './deployment-utils';
import DeploymentColumnActions from './DeploymentColumnActions.svelte';
import DeploymentColumnConditions from './DeploymentColumnConditions.svelte';
import DeploymentColumnName from './DeploymentColumnName.svelte';
import DeploymentColumnPods from './DeploymentColumnPods.svelte';
import DeploymentColumnStatus from './DeploymentColumnStatus.svelte';
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
  renderer: DeploymentColumnStatus,
  comparator: (a, b): number => a.status.localeCompare(b.status),
});

let nameColumn = new TableColumn<DeploymentUI>('Name', {
  renderer: DeploymentColumnName,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let conditionsColumn = new TableColumn<DeploymentUI>('Conditions', {
  width: '2fr',
  overflow: true,
  renderer: DeploymentColumnConditions,
});

let podsColumn = new TableColumn<DeploymentUI>('Pods', {
  renderer: DeploymentColumnPods,
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
  new TableColumn<DeploymentUI>('Actions', { align: 'right', renderer: DeploymentColumnActions }),
];

const row = new TableRow<DeploymentUI>({ selectable: (_deployment): boolean => true });
</script>

<KubernetesObjectsList
  kinds={[{
    resource: 'deployments',
    transformer: deploymentUtils.getDeploymentUI,
    delete: window.kubernetesDeleteDeployment,
    isResource: (): boolean => true,
    searchPatternStore: deploymentSearchPattern,
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

