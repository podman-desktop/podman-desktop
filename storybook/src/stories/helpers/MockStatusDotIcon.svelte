<script lang="ts">
interface Props {
  status: string;
  size?: string;
}

const { status, size = '12' }: Props = $props();

const statusCssVars: Record<string, string> = {
  running: 'var(--pd-status-running)',
  terminated: 'var(--pd-status-terminated)',
  waiting: 'var(--pd-status-waiting)',
  stopped: 'var(--pd-status-stopped)',
  paused: 'var(--pd-status-paused)',
  exited: 'var(--pd-status-exited)',
  dead: 'var(--pd-status-dead)',
  created: 'var(--pd-status-created)',
  degraded: 'var(--pd-status-degraded)',
  unknown: 'var(--pd-status-unknown)',
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

let fillColor = $derived(statusCssVars[status] ?? 'var(--pd-status-unknown)');
let label = $derived(capitalize(status));
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 12 12" role="img" aria-label={label}>
  <circle cx="6" cy="6" r="6" fill={fillColor} />
</svg>
