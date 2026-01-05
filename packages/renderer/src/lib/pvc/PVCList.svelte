<script lang="ts">
import { TableColumn, TableDurationColumn, TableRow, TableSimpleColumn } from '@podman-desktop/ui-svelte';
import moment from 'moment';

import PVCIcon from '/@/lib/images/PVCIcon.svelte';
import NameColumn from '/@/lib/kube/column/Name.svelte';
import StatusColumn from '/@/lib/kube/column/Status.svelte';
import KubernetesObjectsList from '/@/lib/objects/KubernetesObjectsList.svelte';
import {
  kubernetesCurrentContextPersistentVolumeClaimsFiltered,
  persistentVolumeClaimSearchPattern,
} from '/@/stores/kubernetes-contexts-state';

import ActionsColumn from './columns/Actions.svelte';
import ModeColumn from './columns/Mode.svelte';
import { PVCUtils } from './pvc-utils';
import PVCEmptyScreen from './PVCEmptyScreen.svelte';
import type { PVCUI } from './PVCUI';

interface Props {
  searchTerm?: string;
}

let { searchTerm = '' }: Props = $props();

$effect(() => {
  persistentVolumeClaimSearchPattern.set(searchTerm);
});

const pvcUtils = new PVCUtils();

let statusColumn = new TableColumn<PVCUI>('Status', {
  align: 'center',
  width: '70px',
  renderer: StatusColumn,
  comparator: (a, b): number => a.status.localeCompare(b.status),
});

let nameColumn = new TableColumn<PVCUI>('Name', {
  renderer: NameColumn,
  comparator: (a, b): number => a.name.localeCompare(b.name),
});

let storageClassColumn = new TableColumn<PVCUI, string>('Storage', {
  renderMapping: (pvc): string => pvc.storageClass,
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.storageClass.localeCompare(b.storageClass),
});

let accessModesColumn = new TableColumn<PVCUI>('Mode', {
  renderer: ModeColumn,
  overflow: true,
  comparator: (a, b): number => a.accessModes.join().localeCompare(b.accessModes.join()),
});

let sizeColumn = new TableColumn<PVCUI, string>('Size', {
  renderMapping: (pvc): string => pvc.size,
  renderer: TableSimpleColumn,
  comparator: (a, b): number => a.size.localeCompare(b.size),
});

let ageColumn = new TableColumn<PVCUI, Date | undefined>('Age', {
  renderMapping: (pvc): Date | undefined => pvc.created,
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.created).diff(moment(a.created)),
});

const columns = [
  statusColumn,
  nameColumn,
  accessModesColumn,
  storageClassColumn,
  sizeColumn,
  ageColumn,
  new TableColumn<PVCUI>('Actions', { align: 'right', renderer: ActionsColumn }),
];

const row = new TableRow<PVCUI>({ selectable: (_pvc): boolean => true });
</script>

<KubernetesObjectsList
  kinds={[{
    resource: 'persistentvolumeclaims',
    transformer: pvcUtils.getPVCUI,
    delete: window.kubernetesDeletePersistentVolumeClaim,
    isResource: (): boolean => true,
    legacySearchPatternStore: persistentVolumeClaimSearchPattern,
    legacyObjectStore: kubernetesCurrentContextPersistentVolumeClaimsFiltered,
  }]}
  singular="PVC"
  plural="PVCs"
  icon={PVCIcon}
  searchTerm={searchTerm}
  columns={columns}
  row={row}
  >
  <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
  {#snippet emptySnippet()}
    <PVCEmptyScreen />
  {/snippet}
</KubernetesObjectsList>
