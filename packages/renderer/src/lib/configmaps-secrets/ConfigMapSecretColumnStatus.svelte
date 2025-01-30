<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import ConfigMapSecretIcon from '../images/ConfigMapSecretIcon.svelte';
import type { ConfigMapSecretUI } from './ConfigMapSecretUI';

interface Props {
  object: ConfigMapSecretUI;
}
let { object }: Props = $props();
</script>

<StatusIcon icon={ConfigMapSecretIcon} status={object.status} />
