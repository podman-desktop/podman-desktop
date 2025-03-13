<script lang="ts">
import ConfigMapSecretIcon from '../images/ConfigMapSecretIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen
  icon={ConfigMapSecretIcon}
  resources={['configmaps', 'secrets']}
  titleEmpty={['No configmaps', 'No secrets']}
  titleNotPermitted={['Configmaps not accessible', 'Secrets not accessible']}
  message="Try switching to a different context or namespace" />

