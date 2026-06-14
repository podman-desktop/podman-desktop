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
import { getExtensionCompatibilityPresentation, getExtensionLifecyclePresentation } from './extension-lifecycle-status';

interface Props {
  extension?: CombinedExtensionInfoUI;
  catalogExtension?: Pick<CatalogExtensionInfoUI, 'id' | 'displayName' | 'isInstalled'>;
  class?: string;
}

let { extension, catalogExtension, class: className = '' }: Props = $props();

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

  void loadPodmanDesktopVersion().catch(() => {});
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
  extension ? getExtensionLifecyclePresentation(extension.state, extension.type) : undefined,
);

const presentation = $derived(compatibilityPresentation ?? lifecyclePresentation);

const compatibilityTooltip = $derived(
  compatibilityIssues.map(issue => formatExtensionCompatibilityIssueTooltip(issue)).join('\n\n'),
);

const failureReason = $derived(extension?.error?.message ?? 'Unknown error');
const showFailureTooltip = $derived(
  !compatibilityPresentation && extension?.state === 'failed' && !!extension?.error?.message,
);
const showCompatibilityTooltip = $derived(!!compatibilityPresentation && compatibilityIssues.length > 0);
const tooltip = $derived(
  showCompatibilityTooltip ? compatibilityTooltip : showFailureTooltip ? failureReason : undefined,
);
</script>

{#if presentation}
  {#if tooltip}
    <Tooltip top tip={tooltip}>
      <div class="min-w-0 max-w-full cursor-help">
        <div class="inline-flex items-center gap-1.5 min-w-0 max-w-full {className}">
          <span class="inline-flex w-3 shrink-0 items-center justify-center" aria-hidden="true">
            <StatusDotIcon status={presentation.statusDotStatus} size="12" />
          </span>
          <span
            class="text-sm truncate whitespace-nowrap min-w-0"
            style:color={presentation.textColorVar}>{presentation.label}</span>
        </div>
      </div>
    </Tooltip>
  {:else}
    <div class="inline-flex items-center gap-1.5 min-w-0 max-w-full {className}">
      <span class="inline-flex w-3 shrink-0 items-center justify-center" aria-hidden="true">
        <StatusDotIcon status={presentation.statusDotStatus} size="12" />
      </span>
      <span
        class="text-sm truncate whitespace-nowrap min-w-0"
        style:color={presentation.textColorVar}>{presentation.label}</span>
    </div>
  {/if}
{/if}
