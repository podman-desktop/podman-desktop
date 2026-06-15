<script lang="ts">
import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';

import ActionToggle from './ActionToggle.svelte';
import ActionUntrack from './ActionUntrack.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();
</script>

<ActionToggle {extensionFolder} />
<ActionUntrack {extensionFolder} />
