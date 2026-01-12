<script lang="ts">
import JobIcon from '/@/lib/images/JobIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={JobIcon} resources={['jobs']} titleEmpty='No jobs' titleNotPermitted='Jobs not accessible' message="Try switching to a different context or namespace" />
