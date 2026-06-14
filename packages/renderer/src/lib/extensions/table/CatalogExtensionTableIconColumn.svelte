<script lang="ts">
import type { CatalogExtensionInfoUI } from '/@/lib/extensions/catalog-extension-info-ui';
import CatalogExtensionIcon from '/@/lib/extensions/CatalogExtensionIcon.svelte';

interface Props {
  object: CatalogExtensionInfoUI;
}

let { object }: Props = $props();
</script>

<div class="py-1">
  <CatalogExtensionIcon iconHref={object.iconHref} displayName={object.displayName} />
</div>
