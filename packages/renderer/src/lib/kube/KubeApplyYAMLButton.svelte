<script lang="ts">
import type { KubernetesObject } from '@kubernetes/client-node';
import { Button } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';
import SolidKubeIcon from '/@/lib/images/SolidKubeIcon.svelte';

let inProgress = false;

async function kubeApply(): Promise<void> {
  let contextName = await window.kubernetesGetCurrentContextName();
  if (!contextName) {
    return;
  }

  const result = await window.openDialog({
    title: t('workloads.selectYamlToApply') ?? 'Select a .yaml file to apply',
    selectors: ['openFile', 'multiSelections'],
    filters: [
      {
        name: t('workloads.yamlFiles') ?? 'YAML files',
        extensions: ['yaml', 'yml', 'YAML', 'YML'],
      },
    ],
  });

  if (!result || result.length === 0) {
    return;
  }

  inProgress = true;
  try {
    const namespace = await window.kubernetesGetCurrentNamespace();
    let objects: KubernetesObject[] = await window.kubernetesApplyResourcesFromFile(contextName, result, namespace);
    if (objects.length === 0) {
      await window.showMessageBox({
        title: t('workloads.applyKubernetesYaml') ?? 'Apply Kubernetes YAML',
        type: 'warning',
        message: t('workloads.noResourcesApplied') ?? 'No resource(s) were applied.',
        buttons: [t('workloads.dismiss') ?? 'Dismiss'],
      });
    } else if (objects.length === 1) {
      await window.showMessageBox({
        title: t('workloads.applyKubernetesYaml') ?? 'Apply Kubernetes YAML',
        type: 'info',
        message:
          t('workloads.appliedResource', { name: objects[0].kind ?? 'unknown resource' }) ??
          `Successfully applied 1 ${objects[0].kind ?? 'unknown resource'}.`,
        buttons: [t('workloads.dismiss') ?? 'Dismiss'],
      });
    } else {
      const counts = objects.reduce(
        (acc, obj) => {
          acc[obj.kind ?? 'unknown'] = (acc[obj.kind ?? 'unknown'] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      const resources = Object.entries(counts)
        .map(obj => `${obj[1]} ${obj[0]}`)
        .join(', ');

      await window.showMessageBox({
        title: t('workloads.applyKubernetesYaml') ?? 'Apply Kubernetes YAML',
        type: 'info',
        message:
          t('workloads.appliedResources', { count: objects.length, resources }) ??
          `Successfully applied ${objects.length} resources (${resources}).`,
        buttons: [t('workloads.dismiss') ?? 'Dismiss'],
      });
    }
  } catch (error) {
    await window.showMessageBox({
      title: t('workloads.applyKubernetesYamlFailed') ?? 'Apply Kubernetes YAML Failed',
      type: 'error',
      message: (t('workloads.couldNotApplyYaml') ?? 'Could not apply Kubernetes YAML: ') + error,
      buttons: [t('workloads.dismiss') ?? 'Dismiss'],
    });
  }
  inProgress = false;
}
</script>

<Button on:click={kubeApply} title={t('workloads.applyYaml') ?? 'Apply YAML'} icon={SolidKubeIcon} inProgress={inProgress}>{t('workloads.applyYaml') ?? 'Apply YAML'}</Button>
