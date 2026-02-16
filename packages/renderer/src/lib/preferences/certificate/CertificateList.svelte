<script lang="ts">
import type { CertificateInfo } from '@podman-desktop/core-api';
import { FilteredEmptyScreen, SearchInput, Table, TableColumn, TableRow } from '@podman-desktop/ui-svelte';
import { onDestroy } from 'svelte';

import SettingsPage from '/@/lib/preferences/SettingsPage.svelte';
import { certificatesInfos, filtered, searchPattern } from '/@/stores/certificates';

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
    <div class="flex w-full max-w-[905px] mt-4 pl-7">
      <SearchInput title="certificates" searchTerm={searchTerm} oninput={updateSearchValue} class="w-[200px]"/>
    </div>
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
