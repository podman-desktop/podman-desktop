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
import type { HTMLAttributes } from 'svelte/elements';

import StatusDotIcon from '/@/lib/ui/StatusDotIcon.svelte';

interface Props extends HTMLAttributes<HTMLDivElement> {
  status: ExtensionLifecycleStatus;
}

interface LifecycleStatusPresentation {
  icon: string;
  textClass: string;
  label: string;
}

const presentations: Record<ExtensionLifecycleStatus, LifecycleStatusPresentation> = {
  installed: {
    icon: 'running',
    textClass: 'text-(--pd-status-running)',
    label: 'Installed',
  },
  disabled: {
    icon: 'stopped',
    textClass: 'text-(--pd-status-stopped)',
    label: 'Disabled',
  },
  enabling: {
    icon: 'waiting',
    textClass: 'text-(--pd-status-waiting)',
    label: 'Enabling',
  },
  disabling: {
    icon: 'waiting',
    textClass: 'text-(--pd-status-waiting)',
    label: 'Disabling',
  },
  'missing-dependency': {
    icon: 'degraded',
    textClass: 'text-(--pd-status-degraded)',
    label: 'Missing dependency',
  },
  failed: {
    icon: 'terminated',
    textClass: 'text-(--pd-status-terminated)',
    label: 'Failed',
  },
  incompatible: {
    icon: 'degraded',
    textClass: 'text-(--pd-status-degraded)',
    label: 'Incompatible',
  },
  upgrading: {
    icon: 'stopped',
    textClass: 'text-(--pd-status-stopped)',
    label: 'Upgrading',
  },
  downgrading: {
    icon: 'stopped',
    textClass: 'text-(--pd-status-stopped)',
    label: 'Downgrading',
  },
};

let { status, class: className = '', ...restProps }: Props = $props();

const presentation = $derived(presentations[status]);
</script>

<div
  class="flex min-w-0 max-w-full items-center gap-1.5 {className}"
  data-testid="extension-lifecycle-status"
  data-status={status}
  {...restProps}>
  <span class="inline-flex w-3 shrink-0 items-center justify-center" aria-hidden="true">
    <StatusDotIcon status={presentation.icon} size="12" />
  </span>
  <span class="min-w-0 truncate whitespace-nowrap text-sm {presentation.textClass}">
    {presentation.label}
  </span>
</div>
