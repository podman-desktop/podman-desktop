<script lang="ts">
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import InstalledExtensionCardLeftLifecycleDelete from './InstalledExtensionCardLeftLifecycleDelete.svelte';
import InstalledExtensionCardLeftLifecycleToggle from './InstalledExtensionCardLeftLifecycleToggle.svelte';

interface Props {
  extension: CombinedExtensionInfoUI;
}

let { extension }: Props = $props();
</script>

<div class="flex bg-[var(--pd-action-button-bg)] w-fit rounded-lg" role="group" aria-label="Extension Actions">
  <InstalledExtensionCardLeftLifecycleToggle extension={extension} />
  <InstalledExtensionCardLeftLifecycleDelete extension={extension} />
</div>
