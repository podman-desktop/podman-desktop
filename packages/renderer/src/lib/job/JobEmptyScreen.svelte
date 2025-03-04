<script lang="ts">
import JobIcon from '../images/JobIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={JobIcon} title="No jobs" message="Try switching to a different context or namespace" />
