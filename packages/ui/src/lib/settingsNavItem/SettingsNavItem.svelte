<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import type { Component } from 'svelte';

import Icon from '../icons/Icon.svelte';
import { isFontAwesomeIcon } from '../utils/icon-utils';

interface Props {
  title: string;
  href: string;
  section?: boolean;
  expanded?: boolean;
  child?: boolean;
  selected?: boolean;
  icon?: IconDefinition | Component;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
}

let {
  title,
  href,
  section = false,
  expanded = $bindable(),
  child = false,
  selected = false,
  icon = undefined,
  iconPosition = 'left',
  onClick = (): void => {},
}: Props = $props();

function click(): void {
  expanded = !expanded;
  onClick();
}
</script>

<a class="no-underline" href={href} aria-label={title} onclick={click}>
  <div
    class="flex w-full pr-1 py-2 justify-between items-center cursor-pointer border-l-[4px]"
    class:pl-3={!child}
    class:pl-6={child}
    class:leading-none={child}
    class:text-md={!child}
    class:font-medium={!child}
    class:bg-[var(--pd-secondary-nav-selected-bg)]={selected}
    class:border-[var(--pd-secondary-nav-bg)]={!selected}
    class:border-[var(--pd-secondary-nav-selected-highlight)]={selected}
    class:text-[color:var(--pd-secondary-nav-text-selected)]={selected}
    class:text-[color:var(--pd-secondary-nav-text)]={!selected}
    class:hover:text-[color:var(--pd-secondary-nav-text-hover)]={!selected}
    class:hover:bg-[var(--pd-secondary-nav-text-hover-bg)]={!selected}
    class:hover:border-[var(--pd-secondary-nav-text-hover-bg)]={!selected}>
    <span
      class="group-hover:block flex gap-x-4 items-center"
      class:flex-row={iconPosition === 'left'}
      class:flex-row-reverse={iconPosition === 'right'}
      class:capitalize={!child}>
      {#if icon}
        {#if isFontAwesomeIcon(icon)}
          <Icon icon={icon}/>
        {:else}
          <Icon icon={icon} size=14/>
        {/if}
      {/if}
      <span>{title}</span>
    </span>
    {#if section}
      <div class="px-2 relative w-4 h-4 text-[color:var(--pd-secondary-nav-expander)]">
        {#if expanded}
          <Icon icon='fas fa-angle-down' class="text-md absolute left-0 top-0.5 transform origin-center transition-transform duration-200 -rotate-90" />
        {:else}
          <Icon icon='fas fa-angle-right' class="text-md absolute left-0 top-0.5 transform origin-center transition-transform duration-200 rotate-90" />
        {/if}
      </div>
    {/if}
  </div>
</a>
