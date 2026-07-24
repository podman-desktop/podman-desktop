<script lang="ts">
import type { CatalogExtensionInfoUI } from '/@/lib/extensions/catalog-extension-info-ui';
import ExtensionCatalogChips from '/@/lib/extensions/ExtensionCatalogChips.svelte';

interface Props {
  object: CatalogExtensionInfoUI;
}

let { object }: Props = $props();
</script>

<div class="py-1">
  <ExtensionCatalogChips extension={object} />
</div>
