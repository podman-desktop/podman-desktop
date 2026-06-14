<script lang="ts">
import type { CatalogExtensionInfoUI } from '/@/lib/extensions/catalog-extension-info-ui';
import { catalogTableCallbacks } from '/@/lib/extensions/catalog-extension-table-context';
import CatalogExtensionActions from '/@/lib/extensions/CatalogExtensionActions.svelte';
import FeaturedExtensionDownload from '/@/lib/featured/FeaturedExtensionDownload.svelte';

interface Props {
  object: CatalogExtensionInfoUI;
}

let { object }: Props = $props();
</script>

<div class="flex shrink-0 items-center justify-end gap-1 py-1">
  {#if !object.isInstalled && object.fetchable}
    <FeaturedExtensionDownload oninstall={catalogTableCallbacks.oninstall} extension={object} />
  {/if}
  <CatalogExtensionActions
    extension={object}
    onChangeVersion={(): void => catalogTableCallbacks.onChangeVersion(object)} />
</div>
