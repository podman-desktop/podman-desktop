<script lang="ts">
import CronJobIcon from '../images/CronJobIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={CronJobIcon} resources={['cronjobs']} titleEmpty={['No cronjobs']} titleNotPermitted={['Cronjobs not accessible']} message="Try switching to a different context or namespace" />
