<script lang="ts">
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa';

import type { CertificateInfo } from '/@api/certificate-info';

import { isExpired } from './certificate-util';

interface Props {
  cert: CertificateInfo;
}

let { cert }: Props = $props();

const expired = $derived(isExpired(cert));
</script>

{#if expired}
  <Fa icon={faTriangleExclamation} class="text-[var(--pd-state-warning)] shrink-0" />
{:else if cert.validTo}
  <Fa icon={faCircleCheck} class="text-[var(--pd-state-success)] shrink-0" />
{/if}
