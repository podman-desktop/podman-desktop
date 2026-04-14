<script lang="ts">
import { StatusIcon } from '@podman-desktop/ui-svelte';
import { type Component } from 'svelte';

import KubeIcon from '/@/lib/images/KubeIcon.svelte';
import { icon } from '/@/lib/kube/kube-icon-utils';

import type { Props } from './props';

let { object }: Props = $props();

const Icon: Component = $derived.by(() => {
  return icon[object?.kind ?? ''] ?? KubeIcon;
});
</script>

<StatusIcon icon={Icon} status={object.status} />
