<script lang="ts">
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import InstalledExtensionCard from './InstalledExtensionCard.svelte';

interface Props {
  extensionInfos?: CombinedExtensionInfoUI[];
}

let { extensionInfos = [] }: Props = $props();
</script>

<div class="grow px-5 py-3">
  {#each extensionInfos as extension (extension.id)}
    <InstalledExtensionCard extension={extension} />
  {/each}
</div>
