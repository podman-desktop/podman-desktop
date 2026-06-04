<script lang="ts">
import { capitalize } from './Util';

interface Props {
  status: string;
  size?: string;
  class?: string;
}

let { status, size = '12', class: className = '' }: Props = $props();

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

let fillColor = $derived(statusCssVars[status] ?? 'var(--pd-status-unknown)');
let label = $derived(capitalize(status));
</script>

{#if status === 'running'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    role="img"
    aria-label={label}
    class={className}
    data-testid="status-dot-icon">
    <circle cx="6" cy="6" r="6" fill={fillColor} />
  </svg>
{:else if status === 'terminated'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    role="img"
    aria-label={label}
    class={className}
    data-testid="status-dot-icon">
    <circle cx="6" cy="6" r="6" fill={fillColor} />
  </svg>
{:else if status === 'waiting'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    role="img"
    aria-label={label}
    class={className}
    data-testid="status-dot-icon">
    <circle cx="6" cy="6" r="6" fill={fillColor} />
  </svg>
{:else if status === 'stopped'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    role="img"
    aria-label={label}
    class={className}
    data-testid="status-dot-icon">
    <circle cx="6" cy="6" r="6" fill={fillColor} />
  </svg>
{:else if status === 'paused'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    role="img"
    aria-label={label}
    class={className}
    data-testid="status-dot-icon">
    <circle cx="6" cy="6" r="6" fill={fillColor} />
  </svg>
{:else if status === 'exited'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    role="img"
    aria-label={label}
    class={className}
    data-testid="status-dot-icon">
    <circle cx="6" cy="6" r="6" fill={fillColor} />
  </svg>
{:else if status === 'dead'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    role="img"
    aria-label={label}
    class={className}
    data-testid="status-dot-icon">
    <circle cx="6" cy="6" r="6" fill={fillColor} />
  </svg>
{:else if status === 'created'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    role="img"
    aria-label={label}
    class={className}
    data-testid="status-dot-icon">
    <circle cx="6" cy="6" r="6" fill={fillColor} />
  </svg>
{:else if status === 'degraded'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    role="img"
    aria-label={label}
    class={className}
    data-testid="status-dot-icon">
    <circle cx="6" cy="6" r="6" fill={fillColor} />
  </svg>
{:else}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 12 12"
    role="img"
    aria-label={label}
    class={className}
    data-testid="status-dot-icon">
    <circle cx="6" cy="6" r="6" fill={fillColor} />
  </svg>
{/if}
