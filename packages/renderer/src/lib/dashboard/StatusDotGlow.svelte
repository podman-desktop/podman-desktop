<script lang="ts">
import type { ProviderConnectionStatus } from '@podman-desktop/api';

interface Props {
  status: ProviderConnectionStatus;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

let { status, size = 'sm', showText = false }: Props = $props();

function getStatusDotClass(status: ProviderConnectionStatus): string {
  switch (status) {
    case 'started':
      return 'bg-[var(--pd-status-running)] shadow-[0_0_4px_var(--pd-status-running)]';
    case 'stopped':
      return 'bg-[var(--pd-status-stopped)] shadow-[0_0_4px_var(--pd-status-stopped)]';
    case 'unknown':
      return 'bg-[var(--pd-status-terminated)] shadow-[0_0_4px_var(--pd-status-terminated)]';
    case 'starting':
    case 'stopping':
      return 'bg-[var(--pd-status-starting)] shadow-[0_0_4px_var(--pd-status-starting)]';
    default:
      return 'bg-[var(--pd-status-stopped)] shadow-[0_0_4px_var(--pd-status-stopped)]';
  }
}

function getStatusTextClass(status: ProviderConnectionStatus): string {
  switch (status) {
    case 'started':
      return 'text-[var(--pd-status-running)]';
    case 'stopped':
      return 'text-[var(--pd-status-stopped)]';
    case 'unknown':
      return 'text-[var(--pd-status-terminated)]';
    case 'starting':
    case 'stopping':
      return 'text-[var(--pd-status-starting)]';
    default:
      return 'text-[var(--pd-status-stopped)]';
  }
}

function getStatusLabel(status: ProviderConnectionStatus): string {
  switch (status) {
    case 'started':
      return 'Running';
    case 'stopped':
      return 'Stopped';
    case 'unknown':
      return 'Unknown';
    case 'starting':
      return 'Starting';
    case 'stopping':
      return 'Stopping';
  }
}

function getSizeClass(size: string): string {
  switch (size) {
    case 'sm':
      return 'w-2 h-2';
    case 'md':
      return 'w-3 h-3';
    case 'lg':
      return 'w-4 h-4';
    default:
      return 'w-2 h-2';
  }
}
</script>

<div class="inline-flex items-center gap-1.5">
  <div 
    class="rounded-full mx-1 {getSizeClass(size)} {getStatusDotClass(status)}"
    aria-label="Status indicator"
    role="status"></div>
  {#if showText}
    <span class="text-sm {getStatusTextClass(status)}">{getStatusLabel(status)}</span>
  {/if}
</div>