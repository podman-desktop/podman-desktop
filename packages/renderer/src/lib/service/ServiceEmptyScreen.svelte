<script lang="ts">
import { t } from '/@/lib/i18n/translations.svelte';
import ServiceIcon from '/@/lib/images/ServiceIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={ServiceIcon} resources={['services']} titleEmpty={t('kubernetes.resources.services.empty') ?? 'No services'} titleNotPermitted={t('kubernetes.resources.services.inaccessible') ?? 'Services not accessible'} message={t('kubernetes.resources.switchContext') ?? 'Try switching to a different context or namespace'} />
