<script lang="ts">
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';

async function openExtensionDocumentation(): Promise<void> {
  await window.openExternal('https://podman-desktop.io/docs/extensions/developing');
}
</script>

<EmptyScreen
  icon={faCog}
  title="Local extensions (developer mode)"
  message="Enable Preferences > Extensions > Development Mode to test local extensions">
  <div class="flex gap-2 justify-center">
    <Button type="link" on:click={openExtensionDocumentation}>How to write your first extension</Button>
  </div>
</EmptyScreen>
