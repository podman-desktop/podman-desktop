<script lang="ts">
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';

async function openExtensionDocumentation(): Promise<void> {
  await window.openExternal('https://podman-desktop.io/docs/extensions/developing');
}
</script>

<EmptyScreen
  icon={faCog}
  title="Usage of local extensions (developer mode)"
  message="Please enable development mode feature in the preferences">
  <div class="flex gap-2 justify-center">
    <Button type="link" on:click={openExtensionDocumentation}>Documentation: How to write your first extension</Button>
  </div>
</EmptyScreen>
