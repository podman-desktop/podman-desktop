<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';

import ListItemButtonIcon from '../ui/ListItemButtonIcon.svelte';
import { ConfigMapSecretUtils } from './configmap-secret-utils';
import type { ConfigMapSecretUI } from './ConfigMapSecretUI';

export let configMapSecret: ConfigMapSecretUI;
export let detailed = false;

const configmapSecretUtils = new ConfigMapSecretUtils();

async function deleteConfigMapSecret(): Promise<void> {
  configMapSecret.status = 'DELETING';

  setTimeout(() => {
    if (configmapSecretUtils.isSecret(configMapSecret)) {
      window.kubernetesDeleteSecret(configMapSecret.name);
    } else {
      window.kubernetesDeleteConfigMap((configMapSecret as ConfigMapSecretUI).name);
    }
  }, 5_000);
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
