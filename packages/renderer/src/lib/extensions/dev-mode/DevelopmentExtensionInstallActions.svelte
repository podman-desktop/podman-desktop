<script lang="ts">
import { faDownload, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';

interface Props {
  enableCustomExtensions?: boolean;
  onInstallCustom?: () => void;
  onAddLocalFolder: () => void;
}

let { enableCustomExtensions = true, onInstallCustom, onAddLocalFolder }: Props = $props();
</script>

{#if enableCustomExtensions && onInstallCustom}
  <Button type="secondary" icon={faDownload} on:click={onInstallCustom} aria-label="Install custom">
    Install custom
  </Button>
{/if}
<Button type="secondary" icon={faFolderPlus} on:click={onAddLocalFolder}>
  Add a local folder extension...
</Button>
