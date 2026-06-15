<script lang="ts">
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

import LoadingIconButton from '/@/lib/ui/LoadingIconButton.svelte';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import {
  canToggleExtensionLifecycle,
  getExtensionLifecycleToggleAction,
  getExtensionLifecycleToggleLabel,
  isExtensionLifecycleEnabled,
} from './extension-lifecycle-toggle';

interface Props {
  extension: CombinedExtensionInfoUI;
}

let { extension }: Props = $props();

let inProgress = $state(false);

const toggleLabel = $derived(getExtensionLifecycleToggleLabel(extension.state));
const toggleAction = $derived(getExtensionLifecycleToggleAction(extension.state));
const toggleIcon = $derived(isExtensionLifecycleEnabled(extension.state) ? faStop : faPlay);
const isToggleEnabled = $derived(canToggleExtensionLifecycle(extension.state));

async function toggleExtension(): Promise<void> {
  if (!isToggleEnabled) {
    return;
  }

  inProgress = true;
  if (isExtensionLifecycleEnabled(extension.state)) {
    await window.stopExtension(extension.id);
  } else {
    await window.startExtension(extension.id);
  }
  inProgress = false;
}
</script>

<LoadingIconButton
  clickAction={toggleExtension}
  action={toggleAction}
  icon={toggleIcon}
  tooltip={toggleLabel}
  ariaLabel={toggleLabel}
  state={{
    status:
      extension.type === 'dd' && isExtensionLifecycleEnabled(extension.state)
        ? 'unsupported'
        : extension.state,
    inProgress,
    action: toggleAction,
  }} />
