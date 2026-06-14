<script lang="ts">
import type { CatalogExtensionInfoUI } from '/@/lib/extensions/catalog-extension-info-ui';
import CatalogExtensionIcon from '/@/lib/extensions/CatalogExtensionIcon.svelte';

interface Props {
  object: CatalogExtensionInfoUI;
}

let { object }: Props = $props();
</script>

<CatalogExtensionIcon iconHref={object.iconHref} displayName={object.displayName} />
