<script lang='ts'>
import { EmptyScreen } from '@podman-desktop/ui-svelte';
import type { ComponentProps } from 'svelte';
import { onDestroy, onMount } from 'svelte';

import KubernetesCheckConnection from '/@/lib/ui/KubernetesCheckConnection.svelte';
import type { IDisposable } from '/@api/disposable';

import { listenResourcePermitted } from '../kube/resource-permission';

interface Props extends ComponentProps<EmptyScreen> {
  resources: string[];
  titleEmpty: string;
  titleNotPermitted: string;
}

let { icon, resources, titleEmpty, titleNotPermitted, ...restProps }: Props = $props();

let resourcePermitted: boolean = $state(false);
let disposables: IDisposable[] = [];

onMount(async () => {
  for (let i = 0; i < resources?.length; i++) {
    const disposable = await listenResourcePermitted(resources[i], (permitted: boolean) => {
      resourcePermitted = resourcePermitted || permitted;
    });
    disposables.push(disposable);
  }
});

onDestroy(() => {
  disposables.forEach(disposable => {
    disposable?.dispose();
  });
});
</script>

<EmptyScreen icon={icon} title={resourcePermitted ? titleEmpty : titleNotPermitted} {...restProps}>
  <KubernetesCheckConnection />
</EmptyScreen>
