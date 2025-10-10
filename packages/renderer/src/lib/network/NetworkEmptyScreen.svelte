<script lang="ts">
import { EmptyScreen } from '@podman-desktop/ui-svelte';
import { ContainerIcon } from '@podman-desktop/ui-svelte/icons';

const firstNetwork = 'my-first-network';
const commandLine = `podman network create ${firstNetwork}`;
</script>

<EmptyScreen
  icon={ContainerIcon}
  title="No networks"
  message="Create your first network using the following command line:"
  commandline={commandLine}
  onclick={(): Promise<void> => window.clipboardWriteText(commandLine)} />
