<script lang="ts">
import IngressRouteIcon from '../images/IngressRouteIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen
  icon={IngressRouteIcon}
  resources={['ingresses', 'routes']}
  titleEmpty='No ingresses or routes'
  titleNotPermitted='Ingresses and routes not accessible'
  message="Try switching to a different context or namespace" />

