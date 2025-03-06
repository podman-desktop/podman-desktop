<script lang="ts">
import { onDestroy, onMount } from 'svelte';

import type { IDisposable } from '/@api/disposable';

import DeploymentIcon from '../images/DeploymentIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
import { listenResourcePermitted } from '../kube/resource-permission';

let deploymentsPermitted: boolean = $state(true);
let disposable: IDisposable | undefined;

onMount(async () => {
  disposable = await listenResourcePermitted('deployments', (permitted: boolean) => {
    deploymentsPermitted = permitted;
  });
});

onDestroy(() => {
  disposable?.dispose();
});
</script>

<KubernetesEmptyScreen icon={DeploymentIcon} isPermitted={deploymentsPermitted} title={deploymentsPermitted ? 'No deployments' : 'Deployments not accessible'} message="Try switching to a different context or namespace" />

