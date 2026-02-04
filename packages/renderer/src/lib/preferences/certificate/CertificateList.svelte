<script lang="ts">
import { faArrowsRotate, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import type { SplitButtonOption } from '@podman-desktop/ui-svelte';
import {
  Button,
  FilteredEmptyScreen,
  SearchInput,
  SplitButton,
  Table,
  TableColumn,
  TableRow,
} from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onDestroy } from 'svelte';

import SettingsPage from '/@/lib/preferences/SettingsPage.svelte';
import { certificatesInfos, certificateSyncTargets, filtered, searchPattern } from '/@/stores/certificates';
import type { CertificateInfo } from '/@api/certificate-info';

import { getIssuerDisplayNameWithSelfSigned, getSubjectDisplayName } from './certificate-util';
import CertificateColumnExpires from './CertificateColumnExpires.svelte';
import CertificateColumnIssuer from './CertificateColumnIssuer.svelte';
import CertificateColumnSimple from './CertificateColumnSimple.svelte';
import CertificateColumnSubject from './CertificateColumnSubject.svelte';
import CertificateEmptyScreen from './CertificateEmptyScreen.svelte';
import CertificateIcon from './CertificateIcon.svelte';

interface CertificateInfoUI extends CertificateInfo {
  name: string;
  _index: number; // Fallback for unique key when serialNumber/issuer are empty
}

interface Props {
  searchTerm?: string;
}

let { searchTerm = $bindable('') }: Props = $props();

$effect(() => {
  searchPattern.set(searchTerm);
});

// Create options for the SplitButton from sync targets (only trusted extensions are included)
let options: SplitButtonOption[] = $derived(
  $certificateSyncTargets.map(target => ({
    id: target.id,
    label: target.name,
  })),
);

// Show simple button when there's exactly one target
let showSimpleButton = $derived(options.length === 1);

// Enable multiple selection when there are multiple targets
let useMultipleSelection = $derived(options.length > 1);

// Track selected option IDs (empty array = no selection)
let selectedOptionIds = $state<string[]>([]);

// Clear selection if current selection is no longer valid
$effect(() => {
  const validIds = selectedOptionIds.filter(id => options.some(o => o.id === id));
  if (validIds.length !== selectedOptionIds.length) {
    selectedOptionIds = validIds;
  }
});

// Get the first selected option for display
let selectedOption = $derived(options.find(o => selectedOptionIds.includes(o.id)));

// Sync progress state
let syncInProgress = $state(false);
// Error state - true if sync failed
let syncError = $state(false);

// Clear errors when starting a new sync
function clearErrors(): void {
  syncError = false;
}

// Unified sync function for both single and multiple targets
async function synchronizeToTargets(selectedOptions: SplitButtonOption[]): Promise<void> {
  if (selectedOptions.length === 0) return;

  clearErrors();
  syncInProgress = true;
  try {
    const targetIds = selectedOptions.map(option => option.id);
    const result = await window.synchronizeCertificatesToTargets(targetIds);
    if (result.errors.length > 0) {
      syncError = true;
    }
  } catch (err: unknown) {
    syncError = true;
  } finally {
    syncInProgress = false;
  }
}

// Open task manager to show error details
function openTaskManager(): void {
  window
    .executeCommand('show-task-manager')
    .catch((err: unknown) => console.error('Failed to open task manager:', err));
}

let certificates: CertificateInfoUI[] = $derived(
  $filtered.map((cert, index) => ({
    ...cert,
    name: getSubjectDisplayName(cert),
    _index: index,
  })),
);

let nameColumn = new TableColumn<CertificateInfoUI, CertificateInfoUI>('Certificate Name', {
  width: '2fr',
  renderMapping: (cert): CertificateInfoUI => cert,
  renderer: CertificateColumnSubject,
  comparator: (a, b): number => getSubjectDisplayName(a).localeCompare(getSubjectDisplayName(b)),
});

let issuerColumn = new TableColumn<CertificateInfoUI, CertificateInfoUI>('Issuer', {
  width: '2fr',
  renderMapping: (cert): CertificateInfoUI => cert,
  renderer: CertificateColumnIssuer,
  comparator: (a, b): number =>
    getIssuerDisplayNameWithSelfSigned(a).localeCompare(getIssuerDisplayNameWithSelfSigned(b)),
});

let serialColumn = new TableColumn<CertificateInfoUI, string>('Serial Number', {
  width: '1fr',
  renderMapping: (cert): string => cert.serialNumber ?? 'Unknown',
  renderer: CertificateColumnSimple,
  comparator: (a, b): number => (a.serialNumber ?? '').localeCompare(b.serialNumber ?? ''),
});

let expiresColumn = new TableColumn<CertificateInfoUI, CertificateInfoUI>('Expires On', {
  width: '1fr',
  renderMapping: (cert): CertificateInfoUI => cert,
  renderer: CertificateColumnExpires,
  comparator: (a, b): number => {
    const dateA = a.validTo ? new Date(a.validTo).getTime() : 0;
    const dateB = b.validTo ? new Date(b.validTo).getTime() : 0;
    return dateA - dateB;
  },
});

const columns = [nameColumn, issuerColumn, serialColumn, expiresColumn];

const row = new TableRow<CertificateInfoUI>({});

/**
 * Utility function for the Table to get the key to use for each item.
 * Uses serialNumber + issuer which is guaranteed unique per RFC 5280.
 * Falls back to index for unparseable certificates with empty fields.
 */
function key(item: CertificateInfoUI): string {
  if (!item.serialNumber && !item.issuer) {
    return `unparseable-${item._index}`;
  }
  return `${item.serialNumber}:${item.issuer}`;
}

/**
 * Utility function for the Table to get the label to use for each item
 */
function label(item: CertificateInfoUI): string {
  return getSubjectDisplayName(item);
}

let updateSearchValueTimeout: ReturnType<typeof setTimeout> | undefined;

function updateSearchValue(event: Event): void {
  clearTimeout(updateSearchValueTimeout);
  const target = event.target as HTMLInputElement;
  updateSearchValueTimeout = setTimeout(() => (searchTerm = target.value), 500);
}

// Cleanup timeout on component unmount to prevent memory leak
onDestroy(() => {
  clearTimeout(updateSearchValueTimeout);
});
</script>

<SettingsPage title="Certificates">
  {#snippet subtitle()}
    <span class="self-start text-(--pd-invert-content-card-text)">
      Manage host-based certificates in Podman Desktop with automatic synchronization to your Podman Machine.
    </span>
  {/snippet}
  {#snippet header()}
  <div class="flex flex-col w-full">  
    <div class="flex w-full max-w-[905px] justify-between items-center mt-4 pl-7 pr-10 self-center">
      <SearchInput title="certificates" searchTerm={searchTerm} oninput={updateSearchValue} class="w-[200px]"/>
      {#if showSimpleButton}
        <Button
          icon={faArrowsRotate}
          onclick={(): void => { synchronizeToTargets([options[0]]).catch((err: unknown) => console.error('Failed to synchronize certificates:', err)); }}
          inProgress={syncInProgress}>
          Synchronize to {options[0].label}
        </Button>
      {:else}
        <SplitButton
          options={options}
          selectedOptionIds={selectedOptionIds}
          multipleSelection={useMultipleSelection}
          emptyLabel="No synchronization targets available"
          noSelectionLabel="Synchronize to ..."
          icon={faArrowsRotate}
          onAction={synchronizeToTargets}
          onSelect={(selected): void => { selectedOptionIds = selected.map(o => o.id); }}
          inProgress={syncInProgress}>
          {#if selectedOptionIds.length > 1}
            Synchronize to ({selectedOptionIds.length})
          {:else}
            Synchronize to {selectedOption?.label}
          {/if}
        </SplitButton>
      {/if}
    </div>
    {#if syncError}
      <div class="flex w-full max-w-[905px] mt-2 pl-7 pr-10 self-center justify-end" role="alert">
        <button
          class="flex items-center text-[var(--pd-state-error)] text-sm hover:underline cursor-pointer"
          aria-label="Open task manager to see error details"
          title="Open task manager to see error details"
          onclick={openTaskManager}>
          <Icon size="1.1x" class="mr-2 text-[var(--pd-state-error)]" icon={faCircleExclamation} />
          <span>Error: certificates couldn't be synced</span>
        </button>
      </div>
    {/if}
  </div>
  {/snippet}
    <div class="flex flex-col -mx-5 py-2 w-full">
      {#if $certificatesInfos.length === 0}
        <CertificateEmptyScreen />
      {:else if certificates.length === 0}
        <FilteredEmptyScreen icon={CertificateIcon} kind="certificates" bind:searchTerm={searchTerm} />
      {:else}
        <Table
          kind="certificate"
          data={certificates}
          columns={columns}
          row={row}
          defaultSortColumn="Certificate Name"
          key={key}
          label={label}
          enableLayoutConfiguration={true}>
        </Table>
      {/if}
    </div>
</SettingsPage>
