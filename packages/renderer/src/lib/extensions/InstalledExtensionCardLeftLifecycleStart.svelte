<script lang="ts">
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import LoadingIconButton from '/@/lib/ui/LoadingIconButton.svelte';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

interface Props {
  extension: CombinedExtensionInfoUI;
}

let { extension }: Props = $props();

let inProgress = $state(false);

async function startExtension(): Promise<void> {
  inProgress = true;
  await window.startExtension(extension.id);
  inProgress = false;
}
</script>

{#if extension.state === 'stopped' || extension.state === 'failed'}
  <LoadingIconButton
    clickAction={startExtension}
    action="start"
    icon={faPlay}
    state={{ status: extension.state, inProgress }}
    />
{/if}
