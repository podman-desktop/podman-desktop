<script lang="ts">
import JobIcon from '../images/JobIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={JobIcon} resources={['jobs']} titleEmpty='No jobs' titleNotPermitted='Jobs not accessible' message="Try switching to a different context or namespace" />
