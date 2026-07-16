<script lang="ts">
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import { getExtensionEffectiveLifecycleState } from '/@/lib/extensions/extension-effective-lifecycle-state';
import {
  canToggleExtensionLifecycle,
  getExtensionLifecycleToggleLabel,
  isExtensionLifecycleEnabled,
} from '/@/lib/extensions/extension-lifecycle-toggle';
import { markExtensionUserDisabled, markExtensionUserEnabled } from '/@/lib/extensions/extension-lifecycle-user-toggle';
import {
  getPrototypeTransientLifecycleState,
  prototypeLifecycleOverlayRevisionStore,
} from '/@/lib/extensions/extension-prototype-lifecycle-overlay.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();

let lifecycleToggleInProgress = $state(false);

const extensionId = $derived(extensionFolder.installedExtension?.id ?? extensionFolder.extension?.id);

const extensionState = $derived.by(() => {
  $prototypeLifecycleOverlayRevisionStore;
  if (!extensionId) {
    return 'stopped';
  }
  const baseState = extensionFolder.installedExtension?.state ?? extensionFolder.extension?.state ?? 'stopped';
  return getExtensionEffectiveLifecycleState(extensionId, baseState);
});

const toggleLabel = $derived(getExtensionLifecycleToggleLabel(extensionState));
const toggleIcon = $derived(isExtensionLifecycleEnabled(extensionState) ? faToggleOn : faToggleOff);

const transientState = $derived.by(() => {
  $prototypeLifecycleOverlayRevisionStore;
  if (!extensionId) {
    return undefined;
  }
  return getPrototypeTransientLifecycleState(extensionId);
});

const lifecycleInFlight = $derived(
  lifecycleToggleInProgress ||
    extensionState === 'starting' ||
    extensionState === 'stopping' ||
    transientState === 'starting' ||
    transientState === 'stopping',
);

const canToggle = $derived(!!extensionId && canToggleExtensionLifecycle(extensionState) && !lifecycleInFlight);

async function toggleExtension(): Promise<void> {
  if (!extensionId || !canToggle || lifecycleToggleInProgress) {
    return;
  }

  lifecycleToggleInProgress = true;
  try {
    // Mark first so Status shows Enabling/Disabling immediately (Catalog parity).
    if (isExtensionLifecycleEnabled(extensionState)) {
      markExtensionUserDisabled(extensionId);
      if (!extensionFolder.prototypeDefault) {
        try {
          await window.stopExtension(extensionId);
        } catch (error: unknown) {
          console.error(`Failed to stop extension ${extensionId}`, error);
        }
      }
      return;
    }

    markExtensionUserEnabled(extensionId);
    if (!extensionFolder.prototypeDefault) {
      try {
        await window.startExtension(extensionId);
      } catch (error: unknown) {
        console.error(`Failed to start extension ${extensionId}`, error);
      }
    }
  } finally {
    lifecycleToggleInProgress = false;
  }
}
</script>

{#if extensionId}
  <Tooltip top tip={lifecycleInFlight ? `${toggleLabel} in progress` : toggleLabel}>
    <span class="inline-flex {canToggle ? '' : '[&_button]:pointer-events-none'}">
      <ListItemButtonIcon
        title={toggleLabel}
        onClick={toggleExtension}
        enabled={canToggle}
        inProgress={lifecycleInFlight}
        icon={toggleIcon} />
    </span>
  </Tooltip>
{/if}
