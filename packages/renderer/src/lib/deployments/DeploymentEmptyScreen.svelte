<script lang="ts">
import DeploymentIcon from '/@/lib/images/DeploymentIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={DeploymentIcon} resources={['deployments']} titleEmpty='No deployments' titleNotPermitted='Deployments not accessible' message="Try switching to a different context or namespace" />

