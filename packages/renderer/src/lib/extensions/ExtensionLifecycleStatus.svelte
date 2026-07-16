<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import StatusDotIcon from '/@/lib/ui/StatusDotIcon.svelte';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';
import { combinedInstalledExtensions } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  formatExtensionCompatibilityIssueTooltip,
  resolveExtensionCompatibilityIssues,
} from './extension-compatibility';
import {
  getExtensionCompatibilityPresentation,
  getExtensionLifecyclePresentation,
  getExtensionVersionUpdatePresentation,
} from './extension-lifecycle-status';
import { shouldHideExtensionErrorPresentation } from './extension-lifecycle-toggle';
import { EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT } from './extension-lifecycle-user-toggle';
import { versionUpdateStatesStore } from './extension-version-update.svelte';

interface Props {
  extension?: CombinedExtensionInfoUI;
  catalogExtension?: Pick<CatalogExtensionInfoUI, 'id' | 'displayName' | 'isInstalled'>;
  showTooltip?: boolean;
  /** Catalog context (kept for call-site compatibility; label is always "Installed"). */
  catalogInstalledPresence?: boolean;
  /** Compact status: hide idle labels (tooltip keeps the text). Prefer showing labels. */
  compact?: boolean;
  class?: string;
}

let {
  extension,
  catalogExtension,
  showTooltip = true,
  catalogInstalledPresence = false,
  compact = false,
  class: className = '',
}: Props = $props();

let podmanDesktopVersion = $state('');
let uiRevision = $state(0);

onMount(() => {
  async function loadPodmanDesktopVersion(): Promise<void> {
    try {
      const version = await window.getPodmanDesktopVersion?.();
      if (version) {
        podmanDesktopVersion = version;
        uiRevision += 1;
      }
    } catch {
      // Ignore version lookup failures in the status indicator.
    }
  }

  const handleLifecycleToggle = (): void => {
    uiRevision += 1;
  };

  void loadPodmanDesktopVersion().catch(() => {});
  window.addEventListener(EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT, handleLifecycleToggle);

  return (): void => {
    window.removeEventListener(EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT, handleLifecycleToggle);
  };
});

const extensionId = $derived(catalogExtension?.id ?? extension?.id);

const versionUpdatePresentation = $derived.by(() => {
  if (!extensionId) {
    return undefined;
  }

  const updateState = $versionUpdateStatesStore[extensionId];
  if (updateState?.status === 'updating') {
    const direction =
      updateState.direction ?? (updateState.message.toLowerCase().includes('downgrad') ? 'downgrade' : 'upgrade');
    return getExtensionVersionUpdatePresentation(direction);
  }

  return undefined;
});

const compatibilityIssues = $derived.by(() => {
  uiRevision;
  if (!catalogExtension) {
    return [];
  }
  return resolveExtensionCompatibilityIssues(
    catalogExtension,
    $combinedInstalledExtensions,
    podmanDesktopVersion || undefined,
  );
});

const compatibilityPresentation = $derived(
  compatibilityIssues[0] ? getExtensionCompatibilityPresentation(compatibilityIssues[0]) : undefined,
);

const lifecyclePresentation = $derived(
  extension
    ? getExtensionLifecyclePresentation(extension.state, extension.type, {
        catalogInstalledPresence,
      })
    : undefined,
);

const presentation = $derived.by(() => {
  if (versionUpdatePresentation) {
    return versionUpdatePresentation;
  }

  if (extension && shouldHideExtensionErrorPresentation(extension.state)) {
    return lifecyclePresentation;
  }
  return compatibilityPresentation ?? lifecyclePresentation;
});

const compatibilityTooltip = $derived(
  compatibilityIssues.map(issue => formatExtensionCompatibilityIssueTooltip(issue)).join('\n\n'),
);

const failureReason = $derived(extension?.error?.message ?? 'Unknown error');
const showFailureTooltip = $derived(
  !compatibilityPresentation &&
    extension?.state === 'failed' &&
    !!extension?.error?.message &&
    !shouldHideExtensionErrorPresentation(extension.state),
);
const showCompatibilityTooltip = $derived(!!compatibilityPresentation && compatibilityIssues.length > 0);
const tooltip = $derived(
  showCompatibilityTooltip ? compatibilityTooltip : showFailureTooltip ? failureReason : presentation?.label,
);

const showLabel = $derived(!!presentation);
</script>

{#if presentation}
  {#if (!!tooltip && showTooltip) || (compact && !showLabel)}
    <Tooltip top tip={tooltip ?? presentation.label}>
      <div class="min-w-0 max-w-full cursor-help">
        <div class="inline-flex items-center gap-1.5 min-w-0 max-w-full {className}">
          <span class="inline-flex w-3 shrink-0 items-center justify-center" aria-hidden="true">
            <StatusDotIcon status={presentation.statusDotStatus} size="12" />
          </span>
          {#if showLabel}
            <span
              class="text-sm truncate whitespace-nowrap min-w-0"
              style:color={presentation.textColorVar}>{presentation.label}</span>
          {/if}
        </div>
      </div>
    </Tooltip>
  {:else}
    <div class="inline-flex items-center gap-1.5 min-w-0 max-w-full {className}">
      <span class="inline-flex w-3 shrink-0 items-center justify-center" aria-hidden="true">
        <StatusDotIcon status={presentation.statusDotStatus} size="12" />
      </span>
      {#if showLabel}
        <span
          class="text-sm truncate whitespace-nowrap min-w-0"
          style:color={presentation.textColorVar}>{presentation.label}</span>
      {/if}
    </div>
  {/if}
{/if}
