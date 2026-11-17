<script lang="ts">
import type { SecretInfo } from '@desktop-framework/api';
import { NavigationPage } from '@desktop-framework/api';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
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

import { withBulkConfirmation } from '/@/lib/actions/BulkActions';
import { getFilteredEmptyLabels } from '/@/lib/i18n/filtered-empty-labels';
import { getTableLabels } from '/@/lib/i18n/table-labels';
import { t } from '/@/lib/i18n/translations.svelte';
import NoContainerEngineEmptyScreen from '/@/lib/image/NoContainerEngineEmptyScreen.svelte';
import SecretIcon from '/@/lib/images/SecretIcon.svelte';
import SecretColumnEnvironment from '/@/lib/secrets/columns/SecretColumnEnvironment.svelte';
import SecretColumnName from '/@/lib/secrets/columns/SecretColumnName.svelte';
import SecretActions from '/@/lib/secrets/components/SecretActions.svelte';
import SecretEmptyScreen from '/@/lib/secrets/components/SecretEmptyScreen.svelte';
import type { SecretInfoUI } from '/@/lib/secrets/SecretInfoUI';
import EnvironmentDropdown from '/@/lib/ui/EnvironmentDropdown.svelte';
import { handleNavigation } from '/@/navigation';
import { providerInfos } from '/@/stores/providers';
import { filtered, searchPattern } from '/@/stores/secrets';

let selectedEnvironment = $state('');

let secrets: Array<SecretInfoUI> = $derived(
  $filtered
    .map((info: SecretInfo) => ({
      ...info,
      Name: info.Name ?? '<none>',
      selected: false,
    }))
    .filter(info => (selectedEnvironment ? info.engineId === selectedEnvironment : true)),
);

let selectedItemsNumber: number = $state(0);

let nameColumn = new TableColumn<SecretInfoUI>('Name', {
  align: 'left',
  renderer: SecretColumnName,
  comparator: (a, b): number => a.Name.localeCompare(b.Name),
  initialOrder: 'descending',
});

let createdColumn = new TableColumn<SecretInfoUI, Date | undefined>('Created At', {
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
    return true;
  },
});

let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

let bulkDeleteInProgress = $state(false);
async function bulkDeleteSecrets(): Promise<void> {
  const selected = secrets.filter(secret => secret.selected);

  try {
    bulkDeleteInProgress = true;
    await Promise.allSettled(selected.map(secret => window.removeSecret(secret.engineId, secret.Id)));
  } finally {
    bulkDeleteInProgress = false;
  }
}

function gotoCreateSecret(): void {
  handleNavigation({ page: NavigationPage.SECRET_CREATE });
}
</script>

<NavPage bind:searchTerm={$searchPattern} title={t('kubernetes.resources.secrets.title') ?? 'secrets'} searchPlaceholder={t('common.search.placeholder')} searchAriaLabel={t('common.search')}>
  {#snippet additionalActions()}
    {#if providerConnections.length > 0}
      <Button onclick={gotoCreateSecret} icon={faPlusCircle} title={t('kubernetes.resources.secrets.create') ?? 'Create a secret'}>{t('kubernetes.resources.create') ?? 'Create'}</Button>
    {/if}
  {/snippet}

  {#snippet bottomAdditionalActions()}
    <EnvironmentDropdown bind:selectedEnvironment={selectedEnvironment} />
    {#if selectedItemsNumber > 0}
      <Button
        onclick={(): void =>
          withBulkConfirmation(
            bulkDeleteSecrets,
            `delete ${selectedItemsNumber} secret${selectedItemsNumber > 1 ? 's' : ''}`,
            { title: t('kubernetes.resources.secrets.deleteTitle') ?? 'Delete Secrets?', message: t('kubernetes.resources.secrets.deleteMessage', { count: selectedItemsNumber }) ?? `Are you sure you want to delete ${selectedItemsNumber} secret${selectedItemsNumber > 1 ? 's' : ''}?`, variant:'delete' }
          )}
        title={t('kubernetes.resources.deleteSelected', { count: selectedItemsNumber }) ?? `Delete ${selectedItemsNumber} selected items`}
        inProgress={bulkDeleteInProgress}
        icon={faTrash} />
      <span>{t('kubernetes.resources.selected', { count: selectedItemsNumber }) ?? `On ${selectedItemsNumber} selected items.`}</span>
    {/if}
  {/snippet}

  {#snippet content()}
    <div class="flex min-w-full h-full">

      {#if providerConnections.length === 0}
        <NoContainerEngineEmptyScreen />
      {:else if secrets.length === 0}
        {#if $searchPattern}
          <FilteredEmptyScreen labels={getFilteredEmptyLabels('secrets', $searchPattern)} icon={SecretIcon} kind="secrets" bind:searchTerm={$searchPattern} />
        {:else}
          <SecretEmptyScreen />
        {/if}
      {:else}
        <Table
          labels={getTableLabels()}
          kind="secrets"
          bind:selectedItemsNumber={selectedItemsNumber}
          data={secrets}
          columns={columns}
          row={row}
          key={(secret): string => `${secret.engineId}:${secret.Id}`}
          label={(secret): string => secret.Name}
          defaultSortColumn="Id">
        </Table>
      {/if}
    </div>
  {/snippet}
</NavPage>
