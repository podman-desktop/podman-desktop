<script lang="ts">
import type { SelectableExtensionDevelopmentFolderInfoUI } from './development-folder-info-ui';
import SelectableExtensionDevelopmentFolderActionStart from './SelectableExtensionDevelopmentFolderActionStart.svelte';
import SelectableExtensionDevelopmentFolderActionStop from './SelectableExtensionDevelopmentFolderActionStop.svelte';
import SelectableExtensionDevelopmentFolderActionDelete from './SelectableExtensionDevelopmentFolderActionUntrack.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();
</script>

<SelectableExtensionDevelopmentFolderActionStart {extensionFolder} />
<SelectableExtensionDevelopmentFolderActionStop {extensionFolder} />
<SelectableExtensionDevelopmentFolderActionDelete {extensionFolder} />
