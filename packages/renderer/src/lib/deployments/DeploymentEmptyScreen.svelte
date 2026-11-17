<script lang="ts">
import { t } from '/@/lib/i18n/translations.svelte';
import DeploymentIcon from '/@/lib/images/DeploymentIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={DeploymentIcon} resources={['deployments']} titleEmpty={t('kubernetes.resources.deployments.empty') ?? 'No deployments'} titleNotPermitted={t('kubernetes.resources.deployments.inaccessible') ?? 'Deployments not accessible'} message={t('kubernetes.resources.switchContext') ?? 'Try switching to a different context or namespace'} />
