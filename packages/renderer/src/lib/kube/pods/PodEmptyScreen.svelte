<script lang="ts">
import PodIcon from '/@/lib/images/PodIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen
  icon={PodIcon}
  resources={['pods']}
  titleEmpty='No pods'
  titleNotPermitted='Pods not accessible'
  message="Try switching to a different context or namespace" />
