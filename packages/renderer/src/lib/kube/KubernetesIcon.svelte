<script lang="ts">
import type { Component } from 'svelte';

import KubeIcon from '/@/lib/images/KubeIcon.svelte';

import { icon } from './kube-icon-utils';

interface Props {
  kind: string;
  size?: string;
}
let { kind, size = '1em' }: Props = $props();

let Icon: Component = $derived.by(() => {
  return icon[kind] || KubeIcon;
});
</script>

<Icon size={size}/>
