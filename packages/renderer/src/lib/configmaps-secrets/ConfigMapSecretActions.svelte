<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import { t } from '/@/lib/i18n/translations.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import { ConfigMapSecretUtils } from './configmap-secret-utils';
import type { ConfigMapSecretUI } from './ConfigMapSecretUI';

interface Props {
  configMapSecret: ConfigMapSecretUI;
  detailed?: boolean;
}

let { configMapSecret, detailed = false }: Props = $props();

const configmapSecretUtils = new ConfigMapSecretUtils();
let resourceKind = $derived(configmapSecretUtils.isSecret(configMapSecret) ? 'Secret' : 'ConfigMap');

async function deleteConfigMapSecret(): Promise<void> {
  configMapSecret.status = 'DELETING';

  if (configmapSecretUtils.isSecret(configMapSecret)) {
    await window.kubernetesDeleteSecret(configMapSecret.name);
  } else {
    await window.kubernetesDeleteConfigMap((configMapSecret as ConfigMapSecretUI).name);
  }
}
</script>

<ListItemButtonIcon
  title={t('kubernetes.resources.delete', { kind: resourceKind }) ?? `Delete ${resourceKind}`}
  onClick={(): void =>
    withConfirmation(
      deleteConfigMapSecret,
      `delete ${configmapSecretUtils.isSecret(configMapSecret) ? 'secret' : 'configmap'} ${configMapSecret.name}`,
      { title: t('kubernetes.resources.deleteTitle', { kind: resourceKind }) ?? `Delete ${resourceKind}?`, message: t('kubernetes.resources.deleteMessage', { kind: resourceKind, name: configMapSecret.name }) ?? `Are you sure you want to delete ${configmapSecretUtils.isSecret(configMapSecret) ? 'secret' : 'configmap'} ${configMapSecret.name}?`, variant: 'delete' },
    )}
  detailed={detailed}
  icon={faTrash} />
