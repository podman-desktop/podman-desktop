<script lang="ts">
import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import Actions from '/@/lib/extensions/dev-mode/selectable/Actions.svelte';

interface Props {
  object: SelectableExtensionDevelopmentFolderInfoUI;
}
let { object }: Props = $props();
</script>

<Actions extensionFolder={object} />
