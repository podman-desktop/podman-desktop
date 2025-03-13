<script lang='ts'>
import { EmptyScreen } from '@podman-desktop/ui-svelte';
import type { ComponentProps } from 'svelte';
import { onDestroy, onMount } from 'svelte';

import KubernetesCheckConnection from '/@/lib/ui/KubernetesCheckConnection.svelte';
import type { IDisposable } from '/@api/disposable';

import { listenResourcePermitted } from '../kube/resource-permission';

interface Props extends ComponentProps<EmptyScreen> {
  resources: string[];
  titleEmpty: string[];
  titleNotPermitted: string[];
}

let { icon, resources, titleEmpty, titleNotPermitted, ...restProps }: Props = $props();

let resourcesPermitted: boolean[] = $state(resources?.map(r => r !== ''));
let disposables: IDisposable[] = [];
let title = $derived.by(() => {
  let resourcesTitle = '';
  const lengthOfResources = resources?.length;

  // For each resource select text based on whether the resource is permitted
  for (let i = 0; i < lengthOfResources; i++) {
    if (resourcesPermitted[i]) {
      resourcesTitle += titleEmpty[i];
    } else {
      resourcesTitle += titleNotPermitted[i];
    }

    // Adding new line
    if (i + 1 < lengthOfResources) resourcesTitle += '\n';
  }
  return resourcesTitle;
});

onMount(async () => {
  for (let i = 0; i < resources?.length; i++) {
    const disposable = await listenResourcePermitted(resources[i], (permitted: boolean) => {
      resourcesPermitted[i] = permitted;
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

<EmptyScreen icon={icon} title={title} {...restProps}>
  <KubernetesCheckConnection />
</EmptyScreen>
