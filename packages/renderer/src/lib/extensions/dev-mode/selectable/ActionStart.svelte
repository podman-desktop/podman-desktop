<script lang="ts">
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import { t } from '/@/lib/i18n/translations.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

interface Props {
  extensionFolder: SelectableExtensionDevelopmentFolderInfoUI;
}
const { extensionFolder }: Props = $props();

async function startExtension(): Promise<void> {
  if (!extensionFolder.extension) {
    return;
  }
  await window.startExtension(extensionFolder.extension.id);
}
</script>

<ListItemButtonIcon
  title={t('workloads.startExtension') ?? 'Start the extension'}
  onClick={startExtension}
  hidden={!extensionFolder.extension || extensionFolder.extension?.state === 'started'}
  icon={faPlay} />
