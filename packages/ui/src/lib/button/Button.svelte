<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { Component, Snippet } from 'svelte';
import { createEventDispatcher, onMount } from 'svelte';

import Icon from '../icons/Icon.svelte';
import Spinner from '../progress/Spinner.svelte';
import type { ButtonType } from './Button';

interface Props {
  title?: string;
  inProgress?: boolean;
  disabled?: boolean;
  type?: ButtonType;
  icon?: IconDefinition | Component | string;
  selected?: boolean;
  padding?: string;
  class?: string;
  hidden?: boolean;
  'aria-label'?: string;
  onclick?: () => void;
  children?: Snippet;
}

// support legacy usage (on:click)
const dispatch = createEventDispatcher<{ click: undefined }>();

let {
  title,
  inProgress = false,
  disabled = false,
  type = 'primary',
  icon,
  selected,
  padding,
  class: classNames,
  hidden,
  'aria-label': ariaLabel,
  onclick = dispatch.bind(undefined, 'click'),
  children,
}: Props = $props();

let actualPadding = $derived(padding ?? 'px-[16px] ' + (type === 'tab' ? 'pb-1' : 'py-[5px]'));

let classes = $derived.by(() => {
  let result: string = '';
  if (disabled || inProgress) {
    result = 'bg-[var(--pd-button-disabled-bg)] text-[var(--pd-button-disabled-text)] border border-transparent';
  } else if (type === 'primary') {
    result =
      'bg-[var(--pd-button-primary-bg)] text-[var(--pd-button-primary-text)] border border-[var(--pd-button-primary-border)] hover:bg-[var(--pd-button-primary-hover-bg)] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pd-button-focus-ring)]';
  } else if (type === 'secondary') {
    result =
      'bg-[var(--pd-button-secondary-bg)] text-[var(--pd-button-secondary-text)] border border-[var(--pd-button-secondary-border)] hover:bg-[var(--pd-button-secondary-hover-bg)] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pd-button-focus-ring)]';
  } else if (type === 'danger') {
    result =
      'bg-[var(--pd-button-danger-bg)] text-[var(--pd-button-danger-text)] border border-[var(--pd-button-danger-border)] hover:bg-[var(--pd-button-danger-hover-bg)] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pd-button-focus-ring-danger)]';
  } else if (type === 'tab') {
    result =
      'border-b-[3px] border-[var(--pd-button-tab-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pd-button-focus-ring)]';
  } else {
    // link
    result =
      'bg-[var(--pd-button-link-bg)] text-[var(--pd-button-link-text)] border border-transparent hover:bg-[var(--pd-button-link-hover-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pd-button-focus-ring)]';
  }

  // Set cursor states
  if (disabled) {
    result += ' cursor-not-allowed';
  } else if (inProgress) {
    result += ' cursor-wait';
  } else {
    result += ' cursor-pointer';
  }

  if (type !== 'tab') {
    result += ' rounded-[6px]';
  }

  return result;
});

onMount(() => {
  // Icon-only button: icon is present, no title, and no visible children/slot content
  if (icon !== undefined && !title && !children) {
    // Check if is the ariaLabel defined
    if (!ariaLabel) console.warn('Icon buttons should have defined visible aria-label');
  }
});
</script>

<button
  type="button"
  class="relative {actualPadding} motion-reduce:transition-none min-h-[28px] min-w-[28px] leading-[15px] select-none {classes} {classNames}"
  class:border-[var(--pd-button-tab-border-selected)]={type === 'tab' && selected && !disabled && !inProgress}
  class:hover:border-[var(--pd-button-tab-hover-border)]={type === 'tab' && !selected && !disabled && !inProgress}
  class:text-[var(--pd-button-tab-text-selected)]={type === 'tab' && selected && !disabled && !inProgress}
  class:text-[var(--pd-button-tab-text)]={type === 'tab' && !selected}
  hidden={hidden}
  title={title}
  aria-label={ariaLabel}
  onclick={onclick}
  disabled={disabled || inProgress}
  aria-disabled={disabled || inProgress}
  aria-busy={inProgress}>
  {#if icon ?? inProgress}
    <div
      class="flex flex-row p-0 m-0 bg-transparent justify-center items-center space-x-[4px]"
      class:py-[3px]={!children}>
      {#if inProgress}
        <Spinner size="1em" />
      {:else if icon}
        <Icon icon={icon}/>
      {/if}
      {#if children}
        <span>{@render children()}</span>
      {/if}
    </div>
  {:else}
    {@render children?.()}
  {/if}
</button>
