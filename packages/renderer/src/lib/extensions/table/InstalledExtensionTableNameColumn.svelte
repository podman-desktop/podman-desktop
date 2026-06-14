<script lang="ts">
import { isNewlyInstalled } from '/@/lib/extensions/extension-catalog-settings.svelte';
import ExtensionDetailsLink from '/@/lib/extensions/ExtensionDetailsLink.svelte';
import ExtensionTruncatedText from '/@/lib/extensions/ExtensionTruncatedText.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();
</script>

<div class="flex flex-col gap-1 min-w-0 py-1 pr-6">
  <div class="flex items-center gap-2 min-w-0">
    <ExtensionDetailsLink
      displayIcon={false}
      class="text-[color:var(--pd-card-header-text)] font-semibold truncate min-w-0"
      extension={object.extension} />
    {#if isNewlyInstalled(object.catalogExtension.id)}
      <span class="rounded bg-[var(--pd-badge-gray)] px-2 py-0.5 text-xs text-white shrink-0">New</span>
    {/if}
  </div>
  {#if object.extension.description}
    <ExtensionTruncatedText text={object.extension.description} class="text-sm text-[var(--pd-content-text)]" />
  {/if}
</div>
