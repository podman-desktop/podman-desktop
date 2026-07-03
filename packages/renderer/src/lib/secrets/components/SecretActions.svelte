<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import type { SecretInfo } from '@podman-desktop/core-api';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

interface Props {
  object: SecretInfo;
  detailed?: boolean;
}

let { object, detailed = false }: Props = $props();

let loading: boolean = $state(false);

function onDeleteSecret(): void {
  withConfirmation(
    async () => {
      try {
        loading = true;
        await window.removeSecret(object.engineId, object.Id);
      } finally {
        loading = false;
      }
    },
    `delete secret ${object.Name}`,
    { title: 'Delete Secret?', variant: 'delete' },
  );
}
</script>

<ListItemButtonIcon
  title="Delete Secret"
  onClick={onDeleteSecret}
  icon={faTrash}
  inProgress={loading}
  detailed={detailed}
  enabled={true} />
