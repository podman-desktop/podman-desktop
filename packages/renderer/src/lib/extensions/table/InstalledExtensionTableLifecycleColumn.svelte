<script lang="ts">
import ExtensionLifecycleStatus from '/@/lib/extensions/ExtensionLifecycleStatus.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();
</script>

<div class="min-w-0 w-full max-w-full overflow-hidden py-1">
  <ExtensionLifecycleStatus
    extension={object.extension}
    catalogExtension={object.catalogExtension}
    class="w-full max-w-full justify-start" />
</div>
