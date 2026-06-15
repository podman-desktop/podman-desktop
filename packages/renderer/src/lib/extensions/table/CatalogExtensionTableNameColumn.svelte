<script lang="ts">
import type { CatalogExtensionInfoUI } from '/@/lib/extensions/catalog-extension-info-ui';
import { isNewBadgeActive, newBadgeRevision } from '/@/lib/extensions/extension-catalog-settings.svelte';
import ExtensionNewBadge from '/@/lib/extensions/ExtensionNewBadge.svelte';
import ExtensionTruncatedText from '/@/lib/extensions/ExtensionTruncatedText.svelte';

interface Props {
  extension: CatalogExtensionInfoUI;
}

let { extension }: Props = $props();

const isNew = $derived.by(() => {
  newBadgeRevision.value;
  return isNewBadgeActive(extension.id);
});
</script>

<div class="flex flex-col gap-1 min-w-0 py-1">
  <div class="flex min-w-0 max-w-full items-center gap-1.5">
    <span class="truncate font-semibold text-[var(--pd-content-header)]">{extension.displayName}</span>
    {#if isNew}
      <ExtensionNewBadge />
    {/if}
  </div>
  <ExtensionTruncatedText text={extension.shortDescription} class="text-sm text-[var(--pd-content-text)]" />
</div>
