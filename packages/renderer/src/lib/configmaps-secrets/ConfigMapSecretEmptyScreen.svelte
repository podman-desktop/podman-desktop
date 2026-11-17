<script lang="ts">
import { t } from '/@/lib/i18n/translations.svelte';
import ConfigMapSecretIcon from '/@/lib/images/ConfigMapSecretIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen
  icon={ConfigMapSecretIcon}
  resources={['configmaps', 'secrets']}
  titleEmpty={t('kubernetes.resources.configmapsSecrets.empty') ?? 'No configmaps or secrets'}
  titleNotPermitted={t('kubernetes.resources.configmapsSecrets.inaccessible') ?? 'Configmaps and secrets not accessible'}
  message={t('kubernetes.resources.switchContext') ?? 'Try switching to a different context or namespace'} />
