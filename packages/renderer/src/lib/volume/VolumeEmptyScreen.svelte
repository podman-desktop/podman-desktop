<script lang="ts">
import { EmptyScreen } from '@podman-desktop/ui-svelte';

import VolumeIcon from '/@/lib/images/VolumeIcon.svelte';

const commandLine = 'podman volume create myFirstVolume';
</script>

<EmptyScreen
  icon={VolumeIcon}
  title="No volumes"
  message="Create a volume using the following command line:"
  commandline={commandLine}
  onclick={(): Promise<void> => window.clipboardWriteText(commandLine)} />
