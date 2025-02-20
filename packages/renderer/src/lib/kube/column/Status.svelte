<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';
import { type Component } from 'svelte';

import KubeIcon from '/@/lib/images/KubeIcon.svelte';

import type { KubernetesObjectUI } from '../../objects/KubernetesObjectUI';
import { icon } from '../kube-icon-utils';

interface Props {
  object: KubernetesObjectUI;
}

let { object }: Props = $props();

const Icon: Component = $derived.by(() => {
  return icon[object?.kind ?? ''] ?? KubeIcon;
});
</script>

<StatusIcon icon={Icon} status={object.status} />
