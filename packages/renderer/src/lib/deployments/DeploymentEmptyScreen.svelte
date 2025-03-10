<script lang="ts">
import DeploymentIcon from '../images/DeploymentIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={DeploymentIcon} resource='deployments' titleEmpty='No deployments' titleNotPermitted='Deployments not accessible' message="Try switching to a different context or namespace" />

