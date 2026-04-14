<script lang="ts">
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import type { Snippet } from 'svelte';

import FlatMenu from '/@/lib/ui/FlatMenu.svelte';

interface Props {
  dropdownMenu?: boolean;
  dropdownMenuAsMenuActionItem?: boolean;
  onBeforeToggle?: () => void;
  children?: Snippet;
}

let {
  dropdownMenu = false,
  dropdownMenuAsMenuActionItem = false,
  onBeforeToggle = (): void => {},
  children,
}: Props = $props();
</script>

{#if dropdownMenu}
  <DropdownMenu shownAsMenuActionItem={dropdownMenuAsMenuActionItem} onBeforeToggle={onBeforeToggle}
    >{@render children?.()}</DropdownMenu>
{:else}
  <FlatMenu>{@render children?.()}</FlatMenu>
{/if}
