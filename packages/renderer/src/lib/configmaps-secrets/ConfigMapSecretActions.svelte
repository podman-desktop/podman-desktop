<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import { ConfigMapSecretUtils } from './configmap-secret-utils';
import type { ConfigMapSecretUI } from './ConfigMapSecretUI';

export let configMapSecret: ConfigMapSecretUI;
export let detailed = false;

const configmapSecretUtils = new ConfigMapSecretUtils();

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
  title={`Delete ${configmapSecretUtils.isSecret(configMapSecret) ? 'Secret' : 'ConfigMap'}`}
  onClick={(): void =>
    withConfirmation(
      deleteConfigMapSecret,
      `delete ${configmapSecretUtils.isSecret(configMapSecret) ? 'secret' : 'configmap'} ${configMapSecret.name}`,
    )}
  detailed={detailed}
  icon={faTrash} />
