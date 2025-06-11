<script lang="ts">
import { faSquare as faOutlineSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare, faMinusSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { createEventDispatcher, type Snippet } from 'svelte';

import Icon from '../icons/Icon.svelte';

const dispatch = createEventDispatcher<{ click: boolean }>();

interface Props {
  onclick?: (checked: boolean) => void;
  children?: Snippet;
  class?: string;
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  disabledTooltip?: string;
  title?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

let {
  onclick,
  children,
  class: className = '',
  checked = $bindable(),
  disabled = false,
  indeterminate = false,
  disabledTooltip = '',
  title = '',
  id,
  name,
  required = false,
}: Props = $props();

const faSize = '1.33x';

function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
  const checked = event.currentTarget.checked;
  if (onclick) {
    onclick(checked);
  } else {
    dispatch('click', checked);
  }
}
</script>

<label class="flex flex-row items-center {className}">
  <div class="relative p-2 self-start" class:mt-0.5={!!children} class:mr-1={!!children}>
    <div
      class="grid absolute left-0 top-0"
      title={disabled ? disabledTooltip : title}
      class:cursor-pointer={!disabled}
      class:cursor-not-allowed={disabled}>
      {#if disabled}
        <Icon size={faSize} icon={faSquare} class="text-[var(--pd-input-checkbox-disabled)]"/>
      {:else if indeterminate}
        <Icon size={faSize}
          icon={faMinusSquare}
          class="text-[var(--pd-input-checkbox-indeterminate)] hover:text-[var(--pd-input-checkbox-focused-indeterminate)]"/>
      {:else if checked}
        <Icon size={faSize}
          icon={faCheckSquare}
          class="text-[var(--pd-input-checkbox-checked)] hover:text-[var(--pd-input-checkbox-focused-checked)]"/>
     {:else}
        <Icon size={faSize}
          icon={faOutlineSquare}
          class="text-[var(--pd-input-checkbox-unchecked)] hover:text-[var(--pd-input-checkbox-focused-unchecked)]"/>
      {/if}
    </div>
    <input
      aria-label={title}
      type="checkbox"
      id={id}
      name={name}
      bind:checked={checked}
      disabled={disabled}
      required={required}
      class:cursor-pointer={!disabled}
      class:cursor-not-allowed={disabled}
      class="opacity-0 absolute top-0 left-0 w-px h-px text-xl"
      onclick={handleClick} />
  </div>
  {@render children?.()}
</label>
