<script lang="ts">
import CronJobIcon from '../images/CronJobIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={CronJobIcon} title="No cronjobs" message="Try switching to a different context or namespace" />
