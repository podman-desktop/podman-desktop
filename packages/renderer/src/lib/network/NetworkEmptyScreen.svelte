<script lang="ts">
import { EmptyScreen } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';
import NetworkIcon from '/@/lib/images/NetworkIcon.svelte';

const firstNetwork = 'my-first-network';
const commandLine = `podman network create ${firstNetwork}`;
</script>

<EmptyScreen
  icon={NetworkIcon}
  title={t('resources.no-networks') ?? 'No networks'}
  message={t('resources.create-your-first-network-using-the-following-command-line') ?? 'Create your first network using the following command line:'}
  commandline={commandLine}
  onclick={(): Promise<void> => window.clipboardWriteText(commandLine)} />
