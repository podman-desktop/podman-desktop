<script lang="ts">
import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';

import ActionStart from './ActionStart.svelte';
import ActionStop from './ActionStop.svelte';
import ActionUntrack from './ActionUntrack.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();
</script>

<ActionStart {extensionFolder} />
<ActionStop {extensionFolder} />
<ActionUntrack {extensionFolder} />
