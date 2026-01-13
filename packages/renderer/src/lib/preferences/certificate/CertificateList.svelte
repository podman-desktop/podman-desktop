<script lang="ts">
import { FilteredEmptyScreen, SearchInput, Table, TableColumn, TableRow } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';

import SettingsPage from '/@/lib/preferences/SettingsPage.svelte';
import { certificatesInfos, filtered, searchPattern } from '/@/stores/certificates';
import type { CertificateInfo } from '/@api/certificate-info';

import CertificateColumnExpires from './CertificateColumnExpires.svelte';
import CertificateColumnIssuer from './CertificateColumnIssuer.svelte';
import CertificateColumnSimple from './CertificateColumnSimple.svelte';
import CertificateColumnSubject from './CertificateColumnSubject.svelte';
import CertificateEmptyScreen from './CertificateEmptyScreen.svelte';
import CertificateIcon from './CertificateIcon.svelte';

interface CertificateInfoUI extends CertificateInfo {
  name: string;
}

interface Props {
  searchTerm?: string;
}

let { searchTerm = $bindable('') }: Props = $props();

$effect(() => {
  searchPattern.set(searchTerm);
});

let certificates: CertificateInfoUI[] = $derived($filtered.map((cert) => ({
  ...cert,
  name: getDisplayName(cert),
})));

/**
 * Get display name for certificate (Subject: CN → Full DN → 'Unknown')
 */
function getDisplayName(cert: CertificateInfo): string {
  return cert.subjectCommonName || cert.subject || 'Unknown';
}

/**
 * Get issuer display name (Issuer: CN → Full DN → 'Unknown')
 */
function getIssuerDisplayName(cert: CertificateInfo): string {
  return cert.issuerCommonName || cert.issuer || 'Unknown';
}

let nameColumn = new TableColumn<CertificateInfoUI, CertificateInfoUI>('Certificate Name', {
  width: '2fr',
  renderMapping: (cert): CertificateInfoUI => cert,
  renderer: CertificateColumnSubject,
  comparator: (a, b): number => getDisplayName(a).localeCompare(getDisplayName(b)),
});

let issuerColumn = new TableColumn<CertificateInfoUI, CertificateInfoUI>('Issuer', {
  width: '2fr',
  renderMapping: (cert): CertificateInfoUI => cert,
  renderer: CertificateColumnIssuer,
  comparator: (a, b): number => getIssuerDisplayName(a).localeCompare(getIssuerDisplayName(b)),
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
 */
function key(item: CertificateInfoUI): string {
  return `${item.serialNumber}:${item.issuer}`;
}

/**
 * Utility function for the Table to get the label to use for each item
 */
function label(item: CertificateInfoUI): string {
  return getDisplayName(item);
}

let updateSearchValueTimeout: NodeJS.Timeout;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateSearchValue(event: any): void {
  clearTimeout(updateSearchValueTimeout);
  updateSearchValueTimeout = setTimeout(() => (searchTerm = event.target.value), 500);
}
</script>

<SettingsPage title="Certificates">
  {#snippet subtitle()}
    <span class="self-start text-(--pd-invert-content-card-text)">
      Manage host-based certificates in Podman Desktop with automatic synchronization to your Podman Machine.
    </span>
  {/snippet}
  {#snippet header()}
    <SearchInput  title="preferences" class="mt-4" oninput={updateSearchValue} />
  {/snippet}
    <div class="flex flex-col px-2 py-2 w-full">
      <div class="flex min-w-full h-full">
        {#if $certificatesInfos.length === 0}
          <CertificateEmptyScreen />
        {:else if certificates.length === 0}
          {#if searchTerm}
            <FilteredEmptyScreen icon={CertificateIcon} kind="certificates" bind:searchTerm={searchTerm} />
          {:else}
            <CertificateEmptyScreen />
          {/if}
        {:else}
          <Table
            kind="certificate"
            data={certificates}
            columns={columns}
            row={row}
            defaultSortColumn="Certificate Name"
            key={key}
            label={label}
            enableLayoutConfiguration={true}
            on:update={(): CertificateInfoUI[] => (certificates = certificates)}>
          </Table>
        {/if}
      </div>
    </div>
</SettingsPage>

