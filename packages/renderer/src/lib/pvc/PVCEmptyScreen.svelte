<script lang="ts">
import PVCIcon from '../images/PVCIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={PVCIcon} resources={['persistentvolumeclaims']} titleEmpty='No PVCs' titleNotPermitted='PVCs not accessible' message="Try switching to a different context or namespace" />
