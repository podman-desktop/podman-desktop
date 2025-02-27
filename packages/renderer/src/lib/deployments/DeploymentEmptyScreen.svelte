<script lang="ts">
import { onMount } from 'svelte';

import DeploymentIcon from '../images/DeploymentIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
import { listenResourcePermitted } from '../kube/resource-permission';

let deploymentsPermitted: boolean = $state(true);

onMount(() => {
  return listenResourcePermitted('deployments', (permitted: boolean) => {
    deploymentsPermitted = permitted;
  });
});
</script>

<KubernetesEmptyScreen icon={DeploymentIcon} isPermitted={deploymentsPermitted} title={deploymentsPermitted ? 'No deployments' : 'Deployments not accessible'} message="Try switching to a different context or namespace" />

