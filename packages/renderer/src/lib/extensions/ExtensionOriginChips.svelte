<script lang="ts">
import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import ExtensionCatalogStatusChips from './ExtensionCatalogStatusChips.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
  class?: string;
}

let { extension, class: className = '' }: Props = $props();
</script>

<ExtensionCatalogStatusChips {extension} showUpdateChip={false} class={className} />
