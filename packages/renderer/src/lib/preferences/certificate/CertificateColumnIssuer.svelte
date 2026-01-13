<script lang="ts">
import type { CertificateInfo } from '/@api/certificate-info';

interface Props {
  object: CertificateInfo;
}

let { object }: Props = $props();

// Use pre-extracted issuerCommonName from main process (CN → O → full DN fallback)
let displayName = $derived(object.subject === object.issuer ? 'Self-signed' : object.issuerCommonName || 'Unknown');
let titleText = $derived(object.issuer || 'Unknown');
</script>

<div class="mx-1 text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis whitespace-nowrap">
  <span title={titleText}>{displayName}</span>
</div>
