<script lang="ts">
import ConfigMapSecretIcon from '/@/lib/images/ConfigMapSecretIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen
  icon={ConfigMapSecretIcon}
  resources={['configmaps', 'secrets']}
  titleEmpty='No configmaps or secrets'
  titleNotPermitted='Configmaps and secrets not accessible'
  message="Try switching to a different context or namespace" />

