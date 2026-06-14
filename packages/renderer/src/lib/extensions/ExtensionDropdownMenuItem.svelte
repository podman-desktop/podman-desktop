<script lang="ts">
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import type { Component } from 'svelte';
import { getContext } from 'svelte';

import { EXTENSION_DROPDOWN_MENU_CONTEXT, type ExtensionDropdownMenuContext } from './extension-dropdown-menu-context';

interface Props {
  title: string;
  detail?: string;
  icon: IconDefinition | Component | string;
  enabled?: boolean;
  hidden?: boolean;
  keepMenuOpen?: boolean;
  onClick?: (event: Event) => void;
}

let {
  title,
  detail = '',
  icon,
  enabled = true,
  hidden = false,
  keepMenuOpen = false,
  onClick = (): void => {},
}: Props = $props();

const menuContext = getContext<ExtensionDropdownMenuContext | undefined>(EXTENSION_DROPDOWN_MENU_CONTEXT);

const enabledClasses =
  'hover:bg-[var(--pd-dropdown-item-hover-bg)] hover:text-[var(--pd-dropdown-item-hover-text)] hover:rounded-md text-[var(--pd-dropdown-item-text)] hover:cursor-pointer';
const disabledClasses =
  'bg-transparent hover:bg-transparent text-[var(--pd-dropdown-disabled-item-text)] cursor-default pointer-events-none';

function handleClick(event: Event): void {
  if (!enabled) {
    event.stopPropagation();
    return;
  }
  if (keepMenuOpen) {
    event.stopPropagation();
    onClick(event);
    return;
  }
  menuContext?.closeMenu();
  onClick(event);
}
</script>

{#if !hidden}
  <div class={`p-2.5 ${enabled ? enabledClasses : disabledClasses}`} role="none" onclick={handleClick}>
    <span class="group flex items-center no-underline h-auto min-h-4" tabindex="-1">
      <Icon class="w-4 text-md shrink-0 self-start mt-0.5" {icon} />
      <span class="ml-2 flex flex-col">
        <span class="whitespace-nowrap">{title}</span>
        {#if detail}
          <span class="text-xs text-[var(--pd-dropdown-disabled-item-text)] whitespace-nowrap">{detail}</span>
        {/if}
      </span>
    </span>
  </div>
{/if}
