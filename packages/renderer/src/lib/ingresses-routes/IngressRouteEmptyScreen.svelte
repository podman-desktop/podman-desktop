<script lang="ts">
import { t } from '/@/lib/i18n/translations.svelte';
import IngressRouteIcon from '/@/lib/images/IngressRouteIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen
  icon={IngressRouteIcon}
  resources={['ingresses', 'routes']}
  titleEmpty={t('kubernetes.resources.ingressesRoutes.empty') ?? 'No ingresses or routes'}
  titleNotPermitted={t('kubernetes.resources.ingressesRoutes.inaccessible') ?? 'Ingresses and routes not accessible'}
  message={t('kubernetes.resources.switchContext') ?? 'Try switching to a different context or namespace'} />
