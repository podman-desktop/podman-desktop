<script lang="ts">
import { t } from '/@/lib/i18n/translations.svelte';
import JobIcon from '/@/lib/images/JobIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={JobIcon} resources={['jobs']} titleEmpty={t('kubernetes.resources.jobs.empty') ?? 'No jobs'} titleNotPermitted={t('kubernetes.resources.jobs.inaccessible') ?? 'Jobs not accessible'} message={t('kubernetes.resources.switchContext') ?? 'Try switching to a different context or namespace'} />
