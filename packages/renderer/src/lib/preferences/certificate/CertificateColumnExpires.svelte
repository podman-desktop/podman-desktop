<script lang="ts">
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa';

import type { CertificateInfo } from '/@api/certificate-info';

interface Props {
  object: CertificateInfo;
}

let { object }: Props = $props();

/**
 * Check if the certificate is expired
 */
function isExpired(cert: CertificateInfo): boolean {
  if (!cert.validTo) {
    return false; // Unknown expiration, don't mark as expired
  }
  return new Date(cert.validTo) < new Date();
}

/**
 * Format a date for display, returning 'Unknown' if undefined
 */
function formatExpirationDate(date: string | undefined): string {
  if (!date) {
    return 'Unknown';
  }
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const expired = $derived(isExpired(object));
const displayDate = $derived(formatExpirationDate(object.validTo));
const tooltipText = $derived(expired ? `Expired: ${displayDate}` : `Valid until: ${displayDate}`);
</script>

<div class="mx-1 flex items-center gap-2 overflow-hidden whitespace-nowrap">
  {#if expired}
    <Fa icon={faTriangleExclamation} class="text-[var(--pd-state-warning)] shrink-0" />
  {:else if object.validTo}
    <Fa icon={faCircleCheck} class="text-[var(--pd-state-success)] shrink-0" />
  {/if}
  <span class="text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis" title={tooltipText}>
    {displayDate}
  </span>
</div>
