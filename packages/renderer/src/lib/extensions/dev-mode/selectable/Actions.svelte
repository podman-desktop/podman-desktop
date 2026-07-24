<script lang="ts">
import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';

import ActionToggle from './ActionToggle.svelte';
import ActionUntrack from './ActionUntrack.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();
</script>

<div class="flex items-center justify-end gap-0.5" onclick={(event): void => event.stopPropagation()} role="presentation">
  <ActionToggle {extensionFolder} />
  <ActionUntrack {extensionFolder} />
</div>
