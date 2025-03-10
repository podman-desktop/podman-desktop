<script lang='ts'>
import { EmptyScreen } from '@podman-desktop/ui-svelte';
import type { ComponentProps } from 'svelte';
import { onDestroy, onMount } from 'svelte';

import KubernetesCheckConnection from '/@/lib/ui/KubernetesCheckConnection.svelte';
import type { IDisposable } from '/@api/disposable';

import { listenResourcePermitted } from '../kube/resource-permission';

let { icon, resource, titleEmpty, titleNotPermitted, ...restProps }: ComponentProps<EmptyScreen> = $props();

let resourcePermitted: boolean = $state(true);
let disposable: IDisposable | undefined;

onMount(async () => {
  disposable = await listenResourcePermitted(resource, (permitted: boolean) => {
    resourcePermitted = permitted;
  });
});

onDestroy(() => {
  disposable?.dispose();
});
</script>

<EmptyScreen icon={icon} title={resourcePermitted ? titleEmpty : titleNotPermitted} {...restProps}>
  <KubernetesCheckConnection />
</EmptyScreen>
