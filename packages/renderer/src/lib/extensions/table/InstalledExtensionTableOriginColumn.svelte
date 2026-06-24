<script lang="ts">
import ExtensionCatalogStatusChips from '/@/lib/extensions/ExtensionCatalogStatusChips.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();
</script>

<div class="py-1 min-w-0">
  <ExtensionCatalogStatusChips extension={object.catalogExtension} nowrap showUpdateChip={false} />
</div>
