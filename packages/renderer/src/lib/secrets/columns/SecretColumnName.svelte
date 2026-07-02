<script lang="ts">
import { NavigationPage } from '@podman-desktop/core-api';

import type { SecretInfoUI } from '/@/lib/secrets/SecretInfoUI';
import { handleNavigation } from '/@/navigation';

interface Props {
  object: SecretInfoUI;
}

let { object }: Props = $props();

function onOpenSecretDetails(): void {
  console.log(object);
  handleNavigation({
    page: NavigationPage.SECRET,
    parameters: {
      engineId: object.engineId,
      id: object.Id,
    },
  });
}
</script>

<button
  class="hover:cursor-pointer flex text-(--pd-table-body-text-highlight) max-w-full overflow-hidden text-ellipsis"
  onclick={onOpenSecretDetails}>
  {object.Name}
</button>
