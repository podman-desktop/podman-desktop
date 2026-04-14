<script lang="ts">
import type { ForwardConfig } from '@podman-desktop/core-api';
import { StatusIcon } from '@podman-desktop/ui-svelte';

import EthernetIcon from './EthernetIcon.svelte';

interface Props {
  object: ForwardConfig;
}
let { object }: Props = $props();
</script>

{#if object}
  <StatusIcon status="RUNNING" icon={EthernetIcon} />
{/if}
