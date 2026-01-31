<script lang="ts">
import { faPaste } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

interface Props {
  clipboardData: string;
  title: string;
  class?: string;
}

let { clipboardData, title, class: className = '' }: Props = $props();

async function copyTextToClipboard(): Promise<void> {
  await window.clipboardWriteText(clipboardData);
}
</script>

<div class="float-right">
  <Tooltip bottom tip="Copy to Clipboard">
    <button
      title="Copy To Clipboard"
      class="ml-5 {className}"
      aria-label="Copy To Clipboard"
      onclick={copyTextToClipboard}>
      <Icon icon={faPaste} />
    </button>
  </Tooltip>
</div>
<div class="mt-1 my-auto text-xs truncate {className}" aria-label="{title} copy to clipboard" title={title}>
  {title}
</div>
