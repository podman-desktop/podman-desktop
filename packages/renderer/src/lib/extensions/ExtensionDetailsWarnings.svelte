<script lang="ts">
import { faCircleExclamation, faTriangleExclamation, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import {
  type ExtensionDetailsWarning,
  formatExtensionDetailsWarningLine,
  formatExtensionDetailsWarningTooltip,
} from './extension-details-warning';

interface Props {
  warnings: ExtensionDetailsWarning[];
  /** banner = details page; compact-bar = installed list; icon = tooltip only */
  variant?: 'banner' | 'compact-bar' | 'icon';
  class?: string;
}

let { warnings, variant = 'banner', class: className = '' }: Props = $props();

const tooltipText = $derived(warnings.map(warning => formatExtensionDetailsWarningTooltip(warning)).join('\n\n'));
const primaryWarning = $derived(warnings[0]);

function borderColor(warning: ExtensionDetailsWarning): string {
  return warning.severity === 'error' ? 'var(--pd-state-error)' : 'var(--pd-state-warning)';
}

function backgroundColor(warning: ExtensionDetailsWarning): string {
  return warning.severity === 'error' ? 'var(--pd-state-error)' : 'var(--pd-state-warning)';
}

function iconClass(warning: ExtensionDetailsWarning): string {
  return warning.severity === 'error'
    ? 'mt-0.5 shrink-0 text-[var(--pd-state-error)]'
    : 'mt-0.5 shrink-0 text-[var(--pd-state-warning)]';
}

function warningIcon(warning: ExtensionDetailsWarning): IconDefinition {
  return warning.severity === 'error' ? faCircleExclamation : faTriangleExclamation;
}
</script>

{#if warnings.length > 0}
  {#if variant === 'icon'}
    <Tooltip top tip={tooltipText}>
      <span
        class="inline-flex shrink-0 text-[var(--pd-state-warning)] cursor-help {className}"
        role="img"
        aria-label={primaryWarning?.title}>
        <Icon icon={faTriangleExclamation} size="sm" />
      </span>
    </Tooltip>
  {:else if variant === 'compact-bar'}
    <div
      class="flex items-start gap-2 rounded-md border px-2 py-1.5 text-xs {className}"
      style:border-color={borderColor(primaryWarning!)}
      style:background-color="color-mix(in srgb, {backgroundColor(primaryWarning!)} 10%, transparent)"
      role="alert">
      <Icon
        class={iconClass(primaryWarning!)}
        icon={warningIcon(primaryWarning!)}
        size="sm" />
      <p class="min-w-0 flex-1 break-words text-[var(--pd-content-text)]" role="note">
        {formatExtensionDetailsWarningLine(primaryWarning!)}
      </p>
    </div>
  {:else}
    <div class="flex flex-col gap-2 {className}" role="region" aria-label="Extension warnings">
      {#each warnings as warning (warning.key)}
        <div
          class="flex items-start gap-2 rounded-md border px-3 py-2 text-sm"
          style:border-color={borderColor(warning)}
          style:background-color="color-mix(in srgb, {backgroundColor(warning)} 10%, transparent)">
          <Icon
            class={iconClass(warning)}
            icon={warningIcon(warning)}
            size="sm" />
          <p class="min-w-0 flex-1 break-words text-[var(--pd-content-text)]" role="note">
            {formatExtensionDetailsWarningLine(warning)}
          </p>
        </div>
      {/each}
    </div>
  {/if}
{/if}
