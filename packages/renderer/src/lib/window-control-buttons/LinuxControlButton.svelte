<script lang="ts">
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faXmark, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount } from 'svelte';
import type { IconSize } from 'svelte-fa';

const iconSize: IconSize | undefined = '0.875x';

interface Props {
  name: string;
  action?: () => void;
}

let { name, action = (): void => {} }: Props = $props();

let icon = $state<IconDefinition>();
let titleName = $state<string>();

onMount(() => {
  if (name === 'Minimize') {
    icon = faMinus;
  } else if (name === 'Maximize') {
    icon = faSquare;
  } else if (name === 'Close') {
    icon = faXmark;
  }
  titleName = name;
});
</script>

<button
  onclick={action}
  title={titleName}
  aria-label={name}
  class="h-[25px] w-[25px] cursor-pointer text-[var(--pd-titlebar-text)] hover:rounded-full hover:bg-[var(--pd-titlebar-hover-bg)] flex place-items-center justify-center">
  {#if icon}
    <Icon size={iconSize} icon={icon} />
  {/if}
</button>
