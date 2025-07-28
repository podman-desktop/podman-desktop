<script lang="ts">
import { CloseButton, Modal } from '@podman-desktop/ui-svelte';
import { type Snippet } from 'svelte';

interface Props {
  title: string;
  onclose: () => void;
  icon?: Snippet;
  content?: Snippet;
  validation?: Snippet;
  buttons?: Snippet;
}

let { title, onclose, icon, content, validation, buttons }: Props = $props();
</script>

<Modal name={title} on:close={onclose}>
  <div class="flex items-center justify-between pl-4 pr-3 py-3 space-x-2 text-[var(--pd-modal-header-text)]">
    {@render icon?.()}
    <h1 class="grow text-lg font-bold capitalize">{title}</h1>

    <CloseButton onclick={onclose} />
  </div>

  <div class="relative max-h-80 overflow-auto text-[var(--pd-modal-text)] px-10 py-4">
    {@render content?.()}
  </div>

  <div class="px-5 py-5 mt-2 flex flex-row w-full space-x-5">
    {#if validation}
      <div class="grow">
        {@render validation?.()}
      </div>
    {/if}
    {@render buttons?.()}
  </div>
</Modal>
