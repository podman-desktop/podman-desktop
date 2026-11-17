<script lang="ts">
import { t } from '/@/lib/i18n/translations.svelte';
import CronJobIcon from '/@/lib/images/CronJobIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
</script>

<KubernetesEmptyScreen icon={CronJobIcon} resources={['cronjobs']} titleEmpty={t('kubernetes.resources.cronjobs.empty') ?? 'No cronjobs'} titleNotPermitted={t('kubernetes.resources.cronjobs.inaccessible') ?? 'Cronjobs not accessible'} message={t('kubernetes.resources.switchContext') ?? 'Try switching to a different context or namespace'} />
