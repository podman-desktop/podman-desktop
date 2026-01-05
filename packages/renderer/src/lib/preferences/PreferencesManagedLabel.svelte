<script lang="ts">
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import Label from '/@/lib/ui/Label.svelte';
</script>

<Label tip="This setting is managed by your organization." right>
  <div class="flex flex-row space-x-1 items-center">
    <Icon icon={faLock} size="xs"/>
    <span>Managed</span>
  </div>
</Label>
