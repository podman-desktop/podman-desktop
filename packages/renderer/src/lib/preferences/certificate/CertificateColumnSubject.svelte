<script lang="ts">
import type { CertificateInfo } from '/@api/certificate-info';

interface Props {
  object: CertificateInfo;
}

let { object }: Props = $props();

// Use pre-extracted subjectCommonName from main process (CN → O → full DN fallback)
let displayName = $derived(object.subjectCommonName || 'Unknown');
let titleText = $derived(object.subject || 'Unknown');
</script>

<div class="mx-1 text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis whitespace-nowrap">
  <span title={titleText}>{displayName}</span>
</div>
