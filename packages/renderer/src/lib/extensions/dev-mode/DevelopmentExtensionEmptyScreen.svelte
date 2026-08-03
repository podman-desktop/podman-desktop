<script lang="ts">
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';

let extDevelopementLink = $derived(await window.getExtensionDevelopmentDocsLink());

async function openExtensionDocumentation(): Promise<void> {
  if (extDevelopementLink) {
    await window.openExternal(extDevelopementLink);
  }
}
</script>

<EmptyScreen
  icon={faCog}
  title="Local extensions (developer mode)"
  message="Enable Preferences > Extensions > Development Mode to test local extensions">
  {#if extDevelopementLink}
    <div class="flex gap-2 justify-center">
      <Button type="link" on:click={openExtensionDocumentation}>How to write your first extension</Button>
    </div>
  {/if}
</EmptyScreen>
