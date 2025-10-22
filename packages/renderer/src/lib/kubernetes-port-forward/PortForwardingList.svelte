<script lang="ts">
import { faEthernet } from '@fortawesome/free-solid-svg-icons';
import { EmptyScreen, NavPage, TableColumn, TableRow, TableSimpleColumn } from '@podman-desktop/ui-svelte';

import PortForwardActions from '/@/lib/kubernetes-port-forward/PortForwardActions.svelte';
import PortForwardIcon from '/@/lib/kubernetes-port-forward/PortForwardIcon.svelte';
import TableSvelte5 from '/@/lib/table/TableSvelte5.svelte';
import { kubernetesCurrentContextPortForwards } from '/@/stores/kubernetes-contexts-state';
import type { ForwardConfig, WorkloadKind } from '/@api/kubernetes-port-forward-model';

import PodNameColumn from './PortForwardNameColumn.svelte';

const columns = [
  new TableColumn<ForwardConfig>('Status', {
    align: 'center',
    width: '70px',
    renderer: PortForwardIcon,
  }),
  new TableColumn<ForwardConfig>('Name', {
    align: 'left',
    renderer: PodNameColumn,
    comparator: (a, b): number => a.name.localeCompare(b.name),
  }),
  new TableColumn<ForwardConfig, string>('Type', {
    align: 'left',
    renderer: TableSimpleColumn,
    renderMapping: (config): WorkloadKind => config.kind,
    comparator: (a, b): number => a.kind.localeCompare(b.kind),
  }),
  new TableColumn<ForwardConfig, string>('Local Port', {
    align: 'left',
    renderer: TableSimpleColumn,
    renderMapping: (config): string => String(config.forward.localPort),
    comparator: (a, b): number => a.forward.localPort - b.forward.localPort,
  }),
  new TableColumn<ForwardConfig, string>('Remote Port', {
    align: 'left',
    renderer: TableSimpleColumn,
    renderMapping: (config): string => String(config.forward.remotePort),
    comparator: (a, b): number => a.forward.remotePort - b.forward.remotePort,
  }),
  new TableColumn<ForwardConfig>('Actions', {
    align: 'right',
    renderer: PortForwardActions,
  }),
];

const row = new TableRow<ForwardConfig>({});

/**
 * Utility function for the Table to get the key to use for each item
 */
function key(config: ForwardConfig): string {
  return config.id;
}

/**
 * Utility function for the Table to get the label to display for each item
 */
function label(config: ForwardConfig): string {
  return config.name;
}
</script>

<NavPage searchEnabled={false} title="Port forwarding">
  {#snippet content()}
  <div class="flex min-w-full h-full">
    {#if $kubernetesCurrentContextPortForwards.length > 0}
      <TableSvelte5
        kind="port"
        data={$kubernetesCurrentContextPortForwards}
        columns={columns}
        row={row}
        defaultSortColumn="Name"
        key={key}
        label={label}
      >
      </TableSvelte5>
    {:else}
      <EmptyScreen message="To forward ports, open the Summary tab on the relevant resource (Pod, Service, or Deployment)" icon={faEthernet} title="No port forwarding configured"/>
    {/if}
  </div>
  {/snippet}
</NavPage>
