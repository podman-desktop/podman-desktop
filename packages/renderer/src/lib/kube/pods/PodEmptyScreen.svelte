<script lang="ts">
import { t } from '/@/lib/i18n/translations.svelte';
import PodIcon from '/@/lib/images/PodIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen
  icon={PodIcon}
  resources={['pods']}
  titleEmpty={t('workloads.noPods') ?? 'No pods'}
  titleNotPermitted={t('workloads.podsNotAccessible') ?? 'Pods not accessible'}
  message={t('workloads.switchContextOrNamespace') ?? 'Try switching to a different context or namespace'} />
