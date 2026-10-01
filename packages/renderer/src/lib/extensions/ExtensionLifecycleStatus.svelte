<script module lang="ts">
export type ExtensionLifecycleStatus =
  | 'installed'
  | 'disabled'
  | 'enabling'
  | 'disabling'
  | 'missing-dependency'
  | 'failed'
  | 'incompatible'
  | 'upgrading'
  | 'downgrading';
</script>

<script lang="ts">
import StatusDotIcon from '/@/lib/ui/StatusDotIcon.svelte';

interface Props {
  status: ExtensionLifecycleStatus;
  class?: string;
}

interface LifecycleStatusPresentation {
  icon: string;
  color: string;
  label: string;
}

const presentations: Record<ExtensionLifecycleStatus, LifecycleStatusPresentation> = {
  installed: {
    icon: 'running',
    color: 'var(--pd-status-running)',
    label: 'Installed',
  },
  disabled: {
    icon: 'stopped',
    color: 'var(--pd-status-stopped)',
    label: 'Disabled',
  },
  enabling: {
    icon: 'waiting',
    color: 'var(--pd-status-waiting)',
    label: 'Enabling',
  },
  disabling: {
    icon: 'waiting',
    color: 'var(--pd-status-waiting)',
    label: 'Disabling',
  },
  'missing-dependency': {
    icon: 'degraded',
    color: 'var(--pd-status-degraded)',
    label: 'Missing dependency',
  },
  failed: {
    icon: 'terminated',
    color: 'var(--pd-status-terminated)',
    label: 'Failed',
  },
  incompatible: {
    icon: 'degraded',
    color: 'var(--pd-status-degraded)',
    label: 'Incompatible',
  },
  upgrading: {
    icon: 'stopped',
    color: 'var(--pd-status-stopped)',
    label: 'Upgrading',
  },
  downgrading: {
    icon: 'stopped',
    color: 'var(--pd-status-stopped)',
    label: 'Downgrading',
  },
};

let { status, class: className = '' }: Props = $props();

const presentation = $derived(presentations[status]);
</script>

<div
  class="flex min-w-0 max-w-full items-center gap-1.5 {className}"
  data-testid="extension-lifecycle-status"
  data-status={status}>
  <span class="inline-flex w-3 shrink-0 items-center justify-center" aria-hidden="true">
    <StatusDotIcon status={presentation.icon} size="12" />
  </span>
  <span class="min-w-0 truncate whitespace-nowrap text-sm" style:color={presentation.color}>
    {presentation.label}
  </span>
</div>
