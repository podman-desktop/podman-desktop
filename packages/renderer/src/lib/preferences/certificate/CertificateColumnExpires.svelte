<script lang="ts">
import type { CertificateInfo } from '/@api/certificate-info';

import { formatExpirationDate, isExpired } from './certificate-util';
import CertificateExpirationIcon from './CertificateExpirationIcon.svelte';

interface Props {
  object: CertificateInfo;
}

let { object }: Props = $props();

const expired = $derived(isExpired(object));
const displayDate = $derived(formatExpirationDate(object.validTo));
const tooltipText = $derived(
  !object.validTo ? 'Expiration date: Unknown' : expired ? `Expired: ${displayDate}` : `Valid until: ${displayDate}`,
);
</script>

<div class="mx-1 flex items-center gap-2 overflow-hidden">
  <span class="flex items-center gap-1 text-[var(--pd-table-body-text-highlight)] whitespace-nowrap" title={tooltipText}>
    <CertificateExpirationIcon cert={object} />
    <span class="overflow-hidden text-ellipsis">{displayDate}</span>
  </span>
</div>
