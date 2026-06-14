<script lang="ts">
import type { InstalledExtensionTableRow } from '/@/lib/extensions/installed-extension-table-row';
import ExtensionIcon from '/@/lib/preferences/ExtensionIcon.svelte';

interface Props {
  object: InstalledExtensionTableRow;
}

let { object }: Props = $props();
</script>

<div class="flex items-center py-1">
  <ExtensionIcon extension={object.extension} />
</div>
