<script lang="ts">
import { EmptyScreen } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';
import VolumeIcon from '/@/lib/images/VolumeIcon.svelte';

const commandLine = 'podman volume create myFirstVolume';
</script>

<EmptyScreen
  icon={VolumeIcon}
  title={t('resources.no-volumes') ?? 'No volumes'}
  message={t('resources.create-a-volume-using-the-following-command-line') ?? 'Create a volume using the following command line:'}
  commandline={commandLine}
  onclick={(): Promise<void> => window.clipboardWriteText(commandLine)} />
