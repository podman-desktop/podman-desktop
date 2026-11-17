<script lang="ts">
import { faStop } from '@fortawesome/free-solid-svg-icons';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import { t } from '/@/lib/i18n/translations.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();

async function stopExtension(): Promise<void> {
  if (!extensionFolder.extension) {
    return;
  }
  await window.stopExtension(extensionFolder.extension.id);
}
</script>

<ListItemButtonIcon
  title={t('workloads.stopExtension') ?? 'Stop the extension'}
  onClick={stopExtension}
  hidden={!extensionFolder.extension || extensionFolder.extension?.state === 'stopped'}
  icon={faStop} />
