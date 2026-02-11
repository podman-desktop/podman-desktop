<script lang="ts">
import type { CertificateInfo } from '@podman-desktop/core-api';

import { getIssuerDisplayNameWithSelfSigned } from './certificate-util';

interface Props {
  object: CertificateInfo;
}

let { object }: Props = $props();

let displayName = $derived(getIssuerDisplayNameWithSelfSigned(object));
let titleText = $derived(object.issuer || 'Unknown');
</script>

<div class="mx-1 text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis whitespace-nowrap">
  <span title={titleText}>{displayName}</span>
</div>
