<script lang="ts">
import { TableColumn, TableDurationColumn, TableRow, TableSimpleColumn } from '@podman-desktop/ui-svelte';
import moment from 'moment';

import {
  configmapSearchPattern,
  kubernetesCurrentContextConfigMapsFiltered,
  kubernetesCurrentContextSecretsFiltered,
  secretSearchPattern,
} from '/@/stores/kubernetes-contexts-state';

import ConfigMapSecretIcon from '../images/ConfigMapSecretIcon.svelte';
import NameColumn from '../kube/column/Name.svelte';
import KubernetesObjectsList from '../objects/KubernetesObjectsList.svelte';
import { ConfigMapSecretUtils } from './configmap-secret-utils';
import ConfigMapSecretColumnActions from './ConfigMapSecretColumnActions.svelte';
import ConfigMapSecretColumnStatus from './ConfigMapSecretColumnStatus.svelte';
import ConfigMapSecretColumnType from './ConfigMapSecretColumnType.svelte';
import ConfigMapSecretEmptyScreen from './ConfigMapSecretEmptyScreen.svelte';
import type { ConfigMapSecretUI } from './ConfigMapSecretUI';

interface Props {
  searchTerm?: string;
}

let { searchTerm = '' }: Props = $props();

const configmapSecretUtils = new ConfigMapSecretUtils();

let statusColumn = new TableColumn<ConfigMapSecretUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: ConfigMapSecretColumnStatus,
  comparator: (a, b): number => a.status.localeCompare(b.status),
});

let nameColumn = new TableColumn<ConfigMapSecretUI>('Name', {
  width: '1.3fr',
  renderer: NameColumn,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let ageColumn = new TableColumn<ConfigMapSecretUI, Date | undefined>('Age', {
  renderMapping: (configmapSecret): Date | undefined => configmapSecret.created,
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.created).diff(moment(a.created)),
});

let keysColumn = new TableColumn<ConfigMapSecretUI, string>('Keys', {
  renderMapping: (config): string => config.keys.length.toString(),
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.keys.length - b.keys.length,
});

let typeColumn = new TableColumn<ConfigMapSecretUI>('Type', {
  overflow: true,
  width: '2fr',
  renderer: ConfigMapSecretColumnType,
  comparator: (a, b): number => a.type.localeCompare(b.type),
});

const columns = [
  statusColumn,
  nameColumn,
  typeColumn,
  keysColumn,
  ageColumn,
  new TableColumn<ConfigMapSecretUI>('Actions', { align: 'right', renderer: ConfigMapSecretColumnActions }),
];

const row = new TableRow<ConfigMapSecretUI>({ selectable: (_configmapSecret): boolean => true });
</script>

<KubernetesObjectsList
  kinds={[
    {
      resource: 'configmaps',
      transformer: configmapSecretUtils.getConfigMapSecretUI,
      delete: window.kubernetesDeleteConfigMap,
      isResource: configmapSecretUtils.isConfigMap,
      legacySearchPatternStore: configmapSearchPattern,
      legacyObjectStore: kubernetesCurrentContextConfigMapsFiltered,
    },
    {
      resource: 'secrets',
      transformer: configmapSecretUtils.getConfigMapSecretUI,
      delete: window.kubernetesDeleteSecret,
      isResource: configmapSecretUtils.isSecret,
      legacySearchPatternStore: secretSearchPattern,
      legacyObjectStore: kubernetesCurrentContextSecretsFiltered,
    },
  ]}
  singular="ConfigMap and Secret"
  plural="ConfigMaps and Secrets"
  icon={ConfigMapSecretIcon}
  searchTerm={searchTerm}
  columns={columns}
  row={row}
>
  <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
  {#snippet emptySnippet()}
    <ConfigMapSecretEmptyScreen />
  {/snippet}
</KubernetesObjectsList>
