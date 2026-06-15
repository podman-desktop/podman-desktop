<script lang="ts">
import CatalogExtensionActions from '/@/lib/extensions/CatalogExtensionActions.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();
</script>

<div class="flex items-center justify-end py-1">
  <CatalogExtensionActions
    extension={object.catalogExtension}
    returnScreen="installed" />
</div>
