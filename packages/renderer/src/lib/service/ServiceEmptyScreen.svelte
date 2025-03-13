<script lang="ts">
import ServiceIcon from '../images/ServiceIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={ServiceIcon} resources={['services']} titleEmpty='No services' titleNotPermitted='Services not accessible' message="Try switching to a different context or namespace" />
