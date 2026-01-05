<script lang="ts">
import ServiceIcon from '/@/lib/images/ServiceIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={ServiceIcon} resources={['services']} titleEmpty='No services' titleNotPermitted='Services not accessible' message="Try switching to a different context or namespace" />
