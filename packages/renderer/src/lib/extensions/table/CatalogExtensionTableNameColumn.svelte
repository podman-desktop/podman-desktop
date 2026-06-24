<script lang="ts">
import type { CatalogExtensionInfoUI } from '/@/lib/extensions/catalog-extension-info-ui';
import ExtensionFeaturedNameLabel from '/@/lib/extensions/ExtensionFeaturedNameLabel.svelte';
import ExtensionTruncatedText from '/@/lib/extensions/ExtensionTruncatedText.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
}

let { extension }: Props = $props();
</script>

<div class="flex flex-col gap-1 min-w-0 py-1">
  <ExtensionFeaturedNameLabel
    displayName={extension.displayName}
    isFeatured={extension.isFeatured}
    nameClass="font-semibold text-[var(--pd-content-header)]" />
  <ExtensionTruncatedText text={extension.shortDescription} class="text-sm text-[var(--pd-content-text)]" />
</div>
