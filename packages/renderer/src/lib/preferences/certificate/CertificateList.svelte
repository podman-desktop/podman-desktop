<script lang="ts">
import { Button, FilteredEmptyScreen, NavPage, Table, TableColumn, TableRow } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';

import SlideToggle from '/@/lib/ui/SlideToggle.svelte';
import { certificatesInfos, filtered, searchPattern } from '/@/stores/certificates';
import type { CertificateInfo } from '/@api/certificate-info';

import CertificateColumnSimple from './CertificateColumnSimple.svelte';
import CertificateEmptyScreen from './CertificateEmptyScreen.svelte';
import CertificateIcon from './CertificateIcon.svelte';

interface CertificateInfoUI extends CertificateInfo {
  name: string;
}

interface Props {
  searchTerm?: string;
}

let { searchTerm = $bindable('') }: Props = $props();
let checked = $state(true);
$effect(() => {
  searchPattern.set(searchTerm);
});

let certificates: CertificateInfoUI[] = $state([]);

let certificatesUnsubscribe: Unsubscriber;

onMount(async () => {
  certificatesUnsubscribe = filtered.subscribe(value => {
    certificates = value.map(cert => ({
      ...cert,
      name: getDisplayName(cert),
    }));
  });
});

onDestroy(() => {
  if (certificatesUnsubscribe) {
    certificatesUnsubscribe();
  }
});

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

/**
 * Format a date for display, returning 'Unknown' if undefined
 */
function formatExpirationDate(date: Date | undefined): string {
  if (!date) {
    return 'Unknown';
  }
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

let nameColumn = new TableColumn<CertificateInfoUI, string>('Certificate Name', {
  width: '2fr',
  renderMapping: (cert): string => cert.subject ?? 'Unknown',
  renderer: CertificateColumnSimple,
  comparator: (a, b): number => getDisplayName(a).localeCompare(getDisplayName(b)),
});

let issuerColumn = new TableColumn<CertificateInfoUI, string>('Issuer', {
  width: '2fr',
  renderMapping: (cert): string => cert.issuer ?? 'Unknown',
  renderer: CertificateColumnSimple,
  comparator: (a, b): number => getIssuerDisplayName(a).localeCompare(getIssuerDisplayName(b)),
});

let serialColumn = new TableColumn<CertificateInfoUI, string>('Serial Number', {
  width: '1fr',
  renderMapping: (cert): string => cert.serialNumber ?? 'Unknown',
  renderer: CertificateColumnSimple,
  comparator: (a, b): number => (a.serialNumber ?? '').localeCompare(b.serialNumber ?? ''),
});

let expiresColumn = new TableColumn<CertificateInfoUI, string>('Expires On', {
  width: '1fr',
  renderMapping: (cert): string => formatExpirationDate(cert.validTo),
  renderer: CertificateColumnSimple,
  comparator: (a, b): number => {
    const dateA = a.validTo ? new Date(a.validTo).getTime() : 0;
    const dateB = b.validTo ? new Date(b.validTo).getTime() : 0;
    return dateA - dateB;
  },
});

const columns = [nameColumn, issuerColumn, serialColumn, expiresColumn];

const row = new TableRow<CertificateInfoUI>({});

/**
 * Utility function for the Table to get the key to use for each item
 */
function key(item: CertificateInfoUI): string {
  return `${item.fingerprint256 || item.serialNumber || item.subjectCommonName}`;
}

/**
 * Utility function for the Table to get the label to use for each item
 */
function label(item: CertificateInfoUI): string {
  return getDisplayName(item);
}

function onChecked(state: boolean): void {
  checked = state;
}
</script>

<NavPage bind:searchTerm={searchTerm} title="Certificates">
  {#snippet additionalActions()}
    <Button class="mr-5">Synchronize into podman-machine-default</Button>
  {/snippet}
  {#snippet content()}
    <div class="flex flex-col px-2 py-2 w-full">
      <div class="bg-(--pd-invert-content-card-bg) rounded-md mx-5"> 
        <div class="flex flex-col px-2 py-2 w-full text-(--pd-invert-content-card-text) space-y-4">
          <dif class="flex flex-row justify-between">
            <div class="flex flex-col">
              <div class="flex flex-row text-(--pd-invert-content-card-text)">
                <div class="flex flex-row space-x-2 items-center">
                  <span class="font-semibold">Synchronize Certificates</span>
                </div>
              </div>
              <div class="pt-1 text-(--pd-invert-content-card-text) text-sm pr-2">Automatically synchronize certificates to all Podman machines.</div>        
            </div>
            <SlideToggle
              id="sync-all-certificates"
              name="Automatic Synchronize"
              left
              bind:checked={checked}
              on:checked={(event): void => onChecked(event.detail)}
              aria-label="Automatic Ceritficates Synchronization">
              <span class="text-xs">{checked ? 'Enabled' : 'Disabled'}</span>
            </SlideToggle>
          </dif>
        </div>
      </div>
      <div class="self-start text-(--pd-invert-content-card-text) mx-5 my-5">
        Manage host-based certificates in Podman Desktop with automatic synchronization to your Podman Machine.
      </div>
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
  {/snippet}
</NavPage>

