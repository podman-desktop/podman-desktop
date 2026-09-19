<script lang="ts">
import Markdown from '/@/lib/markdown/Markdown.svelte';

interface Props {
  message?: string;
  hidden: boolean;
}

let { message = '', hidden }: Props = $props();
</script>

{#if !hidden}
  <div class="ml-6 mt-2">
    <Markdown markdown={message} />
  </div>
{/if}
