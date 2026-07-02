<script lang="ts">
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { NavigationPage } from '@podman-desktop/core-api';
import {
  Button,
  FilteredEmptyScreen,
  NavPage,
  Table,
  TableColumn,
  TableDurationColumn,
  TableRow,
} from '@podman-desktop/ui-svelte';
import moment from 'moment/moment';

import NoContainerEngineEmptyScreen from '/@/lib/image/NoContainerEngineEmptyScreen.svelte';
import SecretIcon from '/@/lib/images/SecretIcon.svelte';
import SecretColumnEnvironment from '/@/lib/secrets/columns/SecretColumnEnvironment.svelte';
import SecretColumnName from '/@/lib/secrets/columns/SecretColumnName.svelte';
import SecretActions from '/@/lib/secrets/components/SecretActions.svelte';
import SecretEmptyScreen from '/@/lib/secrets/components/SecretEmptyScreen.svelte';
import type { SecretInfoUI } from '/@/lib/secrets/SecretInfoUI';
import { handleNavigation } from '/@/navigation';
import { providerInfos } from '/@/stores/providers';
import { filtered } from '/@/stores/secrets';

let searchTerm = $state('');

let secrets: Array<SecretInfoUI> = $derived(
  $filtered
    .map(info => ({
      ...info,
      Name: info.Name ?? '<none>',
      selected: false,
      status: 'UNUSED',
    }))
    .filter(info => info.Name.toLowerCase().includes(searchTerm.toLowerCase())),
);

let nameColumn = new TableColumn<SecretInfoUI>('Name', {
  align: 'left',
  renderer: SecretColumnName,
  comparator: (a, b): number => a.Name.localeCompare(b.Name),
  initialOrder: 'descending',
});

let createdColumn = new TableColumn<SecretInfoUI, Date | undefined>('CreatedAt', {
  renderMapping: (deployment): Date | undefined => (deployment.CreatedAt ? new Date(deployment.CreatedAt) : undefined),
  renderer: TableDurationColumn,
  comparator: (a, b): number => moment(b.CreatedAt).diff(moment(a.CreatedAt)),
});

let envColumn = new TableColumn<SecretInfoUI>('Environment', {
  renderer: SecretColumnEnvironment,
  comparator: (a, b): number => a.engineName.localeCompare(b.engineName),
});

const columns = [
  nameColumn,
  createdColumn,
  envColumn,
  new TableColumn<SecretInfoUI>('Actions', { align: 'right', renderer: SecretActions, overflow: true }),
];

const row = new TableRow<SecretInfoUI>({
  selectable(_): boolean {
    return false; // todo
  },
});

let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

function onCreateSecret(): void {
  handleNavigation({
    page: NavigationPage.SECRET_CREATE,
  });
}
</script>

<NavPage bind:searchTerm={searchTerm} title="secrets">
  {#snippet additionalActions()}
    {#if providerConnections.length > 0}
      <Button onclick={onCreateSecret} icon={faPlusCircle} title="Create a secret" aria-label="Create"
      >Create</Button>
    {/if}
  {/snippet}

  {#snippet content()}
    <div class="flex min-w-full h-full">

      {#if providerConnections.length === 0}
        <NoContainerEngineEmptyScreen />
      {:else if secrets.length === 0}
        {#if searchTerm}
          <FilteredEmptyScreen icon={SecretIcon} kind="secrets" bind:searchTerm={searchTerm} />
        {:else}
          <SecretEmptyScreen />
        {/if}
      {:else}
        <Table
          kind="secrets"
          data={secrets}
          columns={columns}
          row={row}
          defaultSortColumn="Id">
        </Table>
      {/if}
    </div>
  {/snippet}
</NavPage>
