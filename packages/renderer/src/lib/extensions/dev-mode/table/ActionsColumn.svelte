<script lang="ts">
import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import Actions from '/@/lib/extensions/dev-mode/selectable/Actions.svelte';

export let object: SelectableExtensionDevelopmentFolderInfoUI;
</script>

<Actions extensionFolder={object} />
