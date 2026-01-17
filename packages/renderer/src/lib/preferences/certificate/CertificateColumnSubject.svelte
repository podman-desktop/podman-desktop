<script lang="ts">
import type { CertificateInfo } from '/@api/certificate-info';

import { getSubjectDisplayName } from './certificate-util';

interface Props {
  object: CertificateInfo;
}

let { object }: Props = $props();

let displayName = $derived(getSubjectDisplayName(object));
let titleText = $derived(object.subject || 'Unknown');
</script>

<div class="mx-1 text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis whitespace-nowrap">
  <span title={titleText}>{displayName}</span>
</div>
