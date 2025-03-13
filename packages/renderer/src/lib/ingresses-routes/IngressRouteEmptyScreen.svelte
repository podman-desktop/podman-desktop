<script lang="ts">
import IngressRouteIcon from '../images/IngressRouteIcon.svelte';
import KubernetesEmptyScreen from '../kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen
  icon={IngressRouteIcon}
  resources={['ingresses', 'routes']}
  titleEmpty={['No ingresses', 'No routes']}
  titleNotPermitted={['Ingresses not accessible', 'Routes not accessible']}
  message="Try switching to a different context or namespace" />

