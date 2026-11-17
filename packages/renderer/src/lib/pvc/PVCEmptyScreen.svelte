<script lang="ts">
import { t } from '/@/lib/i18n/translations.svelte';
import PVCIcon from '/@/lib/images/PVCIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={PVCIcon} resources={['persistentvolumeclaims']} titleEmpty={t('kubernetes.resources.pvcs.empty') ?? 'No PVCs'} titleNotPermitted={t('kubernetes.resources.pvcs.inaccessible') ?? 'PVCs not accessible'} message={t('kubernetes.resources.switchContext') ?? 'Try switching to a different context or namespace'} />
