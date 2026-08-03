<script lang="ts">
import { EmptyScreen } from '@podman-desktop/ui-svelte';

import SecretIcon from '/@/lib/images/SecretIcon.svelte';

const commandLine = `printf "secretdata" | podman secret create mysecret -`;
</script>

<EmptyScreen
  icon={SecretIcon}
  title="No secrets"
  message="Create your first secret using the following command line:"
  commandline={commandLine}
  onclick={(): Promise<void> => window.clipboardWriteText(commandLine)} />
