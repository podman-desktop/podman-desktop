<script lang="ts">
import PodIcon from '../../images/PodIcon.svelte';
import KubernetesEmptyScreen from '../KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen
  icon={PodIcon}
  title="No pods"
  message="Try switching to a different context or namespace" />
