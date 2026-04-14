<script lang="ts">
import PVCIcon from '/@/lib/images/PVCIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={PVCIcon} resources={['persistentvolumeclaims']} titleEmpty='No PVCs' titleNotPermitted='PVCs not accessible' message="Try switching to a different context or namespace" />
