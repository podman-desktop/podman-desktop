<script lang="ts">
import type { CertificateInfo } from '/@api/certificate-info';

interface Props {
  object: CertificateInfo;
}

let { object }: Props = $props();

// Use pre-extracted subjectCommonName from main process (CN → O → full DN fallback)
// Fallback: subjectCommonName → subject → 'Unknown'
let displayName = $derived(object.subjectCommonName || object.subject || 'Unknown');
let titleText = $derived(object.subject || 'Unknown');
</script>

<div class="mx-1 text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis whitespace-nowrap">
  <span title={titleText}>{displayName}</span>
</div>
