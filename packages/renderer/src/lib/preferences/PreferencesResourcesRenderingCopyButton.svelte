<script lang="ts">
import { onMount } from 'svelte';

import CopyToClipboard from '/@/lib/ui/CopyToClipboard.svelte';

interface Props {
  path: string;
  class?: string;
}

let { path, class: className }: Props = $props();

let url: string | undefined = $state();

onMount(async () => {
  try {
    const platform = await window.getOsPlatform();

    let prefix = '';
    if (platform === 'win32') {
      prefix = 'npipe';
    } else {
      prefix = 'unix';
    }

    url = `${prefix}://${path}`;
  } catch (e) {
    console.error('unable to create a socket url from socketPath.', e);
    url = undefined;
  }
});
</script>

{#if url}
  <CopyToClipboard title={url} clipboardData={url} class={className} />
{/if}
