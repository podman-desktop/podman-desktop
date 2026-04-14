<script lang="ts">
interface Props {
  status: string;
}

let { status }: Props = $props();

let statusName = $derived.by((): string => {
  switch (status) {
    case 'ready':
    case 'started':
      return 'Running';
    case 'stopped':
    case 'configured':
      return 'Off';
    case 'error':
      return 'Error';
    case 'starting':
      return 'Starting';
    case 'stopping':
      return 'Stopping';
    case 'not-installed':
      return 'Not installed';
    case 'installed':
      return 'Installed but not ready';
    case 'configuring':
      return 'Configuring';
    default:
      return 'Unknown';
  }
});
</script>

<span
  aria-label="Connection Status Name"
  class:text-[var(--pd-status-running)]={statusName === 'Running'}
  class:text-[var(--pd-status-stopped)]={statusName === 'Off'}
  class:text-[var(--pd-status-terminated)]={statusName === 'Error' || statusName === 'Stopping'}
  class:text-[var(--pd-status-starting)]={statusName === 'Starting'}
  class:text-[var(--pd-status-not-running)]={statusName === 'Not installed' || statusName === 'Installed but not ready' || statusName === 'Configuring'}
  class:text-[var(--pd-status-unknown)]={statusName === 'Unknown'}>
  {statusName}
</span>
