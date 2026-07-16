<script lang="ts">
import type { ProviderConnectionStatus } from '@podman-desktop/api';

import StatusDotIcon from './StatusDotIcon.svelte';

interface Props {
  /** Lifecycle status of the provider connection / machine. */
  status?: ProviderConnectionStatus;
  size?: string;
  class?: string;
}

/** Maps provider connection lifecycle statuses to StatusDotIcon keys. */
const connectionStatusToDotStatus = {
  started: 'running',
  stopped: 'stopped',
  starting: 'waiting',
  stopping: 'stopped',
  unknown: 'unknown',
} as const satisfies Record<ProviderConnectionStatus, string>;

/**
 * StatusDot glyph for a provider connection / machine lifecycle status.
 * Used in Environment column labels and related provider chrome.
 */
let { status = 'unknown', size = '12', class: className = '' }: Props = $props();

let dotStatus = $derived(connectionStatusToDotStatus[status]);
</script>

<StatusDotIcon status={dotStatus} {size} class={className} />
