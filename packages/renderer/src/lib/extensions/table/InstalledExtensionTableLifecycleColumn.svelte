<script lang="ts">
import ExtensionLifecycleStatus from '/@/lib/extensions/ExtensionLifecycleStatus.svelte';
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();
</script>

<div class="py-1 min-w-0">
  <ExtensionLifecycleStatus
    extension={object.extension}
    catalogExtension={object.catalogExtension} />
</div>
