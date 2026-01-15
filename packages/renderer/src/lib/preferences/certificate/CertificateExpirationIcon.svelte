<script lang="ts">
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa';

import type { CertificateInfo } from '/@api/certificate-info';

interface Props {
  cert: CertificateInfo;
}

let { cert }: Props = $props();

/**
 * Check if the certificate is expired
 */
function isExpired(cert: CertificateInfo): boolean {
  if (!cert.validTo) {
    return false; // Unknown expiration, don't mark as expired
  }
  return new Date(cert.validTo) < new Date();
}

const expired = $derived(isExpired(cert));
</script>

{#if expired}
  <Fa icon={faTriangleExclamation} class="text-[var(--pd-state-warning)] shrink-0" />
{:else if cert.validTo}
  <Fa icon={faCircleCheck} class="text-[var(--pd-state-success)] shrink-0" />
{/if}
