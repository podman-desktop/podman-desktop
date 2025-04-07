<script lang="ts">
import { faSquare as faOutlineSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare, faMinusSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { createEventDispatcher, type Snippet } from 'svelte';
import Fa from 'svelte-fa';

const dispatch = createEventDispatcher<{ click: boolean }>();

interface Props {
  onclick?: () => void;
  children?: Snippet;
  class?: string;
  'aria-label'?: string;
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
  onclick = (): void => {
    checked = !checked;
    dispatch('click', checked);
  },
  children,
  class: className = '',
  'aria-label': ariaLabel,
  checked = $bindable(),
  disabled = false,
  indeterminate = false,
  disabledTooltip = '',
  title = '',
  id = undefined,
  name = undefined,
  required = false,
}: Props = $props();

const faSize = '1.33x';
</script>

<label class="flex flex-row items-center {className}">
  <div class="relative p-2 self-start" class:mt-0.5={!!children} class:mr-1={!!children}>
    <div
      class="grid absolute left-0 top-0"
      title={disabled ? disabledTooltip : title}
      class:cursor-pointer={!disabled}
      class:cursor-not-allowed={disabled}>
      {#if disabled}
        <Fa size={faSize} icon={faSquare} class="text-[var(--pd-input-checkbox-disabled)]" />
      {:else if indeterminate}
        <Fa
          size={faSize}
          icon={faMinusSquare}
          class="text-[var(--pd-input-checkbox-indeterminate)] hover:text-[var(--pd-input-checkbox-focused-indeterminate)]" />
      {:else if checked}
        <Fa
          size={faSize}
          icon={faCheckSquare}
          class="text-[var(--pd-input-checkbox-checked)] hover:text-[var(--pd-input-checkbox-focused-checked)]" />
      {:else}
        <Fa
          size={faSize}
          icon={faOutlineSquare}
          class="text-[var(--pd-input-checkbox-unchecked)] hover:text-[var(--pd-input-checkbox-focused-unchecked)]" />
      {/if}
    </div>
    <input
      aria-label={ariaLabel ?? title}
      type="checkbox"
      id={id}
      name={name}
      bind:checked={checked}
      disabled={disabled}
      required={required}
      class:cursor-pointer={!disabled}
      class:cursor-not-allowed={disabled}
      class="opacity-0 absolute top-0 left-0 w-px h-px text-xl"
      {onclick} />
  </div>
  {@render children?.()}
</label>
