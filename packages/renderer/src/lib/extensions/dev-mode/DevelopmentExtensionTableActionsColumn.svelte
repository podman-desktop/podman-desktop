<script lang="ts">
import type { SelectableExtensionDevelopmentFolderInfoUI } from './development-folder-info-ui';
import SelectableExtensionDevelopmentFolderActions from './SelectableExtensionDevelopmentFolderActions.svelte';

export let object: SelectableExtensionDevelopmentFolderInfoUI;
</script>

<SelectableExtensionDevelopmentFolderActions extensionFolder={object} />
