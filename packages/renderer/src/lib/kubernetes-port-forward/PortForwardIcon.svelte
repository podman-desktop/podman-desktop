<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';

import type { ForwardConfig } from '/@api/kubernetes-port-forward-model';

import EthernetIcon from './EthernetIcon.svelte';

interface Props {
  object: ForwardConfig;
}
let { object }: Props = $props();
</script>

{#if object}
  <StatusIcon status="RUNNING" icon={EthernetIcon} />
{/if}
