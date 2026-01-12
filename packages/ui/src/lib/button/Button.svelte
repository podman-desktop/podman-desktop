<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { Component, Snippet } from 'svelte';
import { createEventDispatcher } from 'svelte';

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
  padding = 'px-4 ' +
    (type === 'tab' ? 'pb-1' : type === 'secondary' ? 'py-[4px]' : type === 'danger' ? 'py-[3px]' : 'py-[5px]'),
  class: classNames,
  hidden,
  'aria-label': ariaLabel,
  onclick = dispatch.bind(undefined, 'click'),
  children,
}: Props = $props();

let classes = $derived.by(() => {
  let result: string = '';
  if (disabled || inProgress) {
    if (type === 'primary') {
      result = 'bg-[var(--pd-button-disabled)]';
    } else if (type === 'secondary') {
      result = 'border-[1px] border-[var(--pd-button-disabled)] bg-[var(--pd-button-disabled)]';
    } else if (type === 'danger') {
      result =
        'border-2 border-[var(--pd-button-danger-disabled-border)] text-[var(--pd-button-danger-disabled-text)] bg-[var(--pd-button-danger-disabled-bg)]';
    }
    if (type !== 'danger') {
      result += ' text-[var(--pd-button-disabled-text)]';
    }
  } else if (type === 'primary') {
    result =
      'bg-[var(--pd-button-primary-bg)] text-[var(--pd-button-text)] border-none hover:bg-[var(--pd-button-primary-hover-bg)]';
  } else if (type === 'secondary') {
    result =
      'border-[1px] border-[var(--pd-button-secondary)] text-[var(--pd-button-secondary)] hover:bg-[var(--pd-button-secondary-hover)] hover:border-[var(--pd-button-secondary-hover)] hover:text-[var(--pd-button-text)]';
  } else if (type === 'danger') {
    result =
      'border-2 border-[var(--pd-button-danger-border)] bg-[var(--pd-button-danger-bg)] text-[var(--pd-button-danger-text)] hover:bg-[var(--pd-button-danger-hover-bg)] hover:text-[var(--pd-button-danger-hover-text)]';
  } else if (type === 'tab') {
    result = 'border-b-[3px] border-[var(--pd-button-tab-border)]';
  } else {
    // link
    result = 'border-none text-[var(--pd-button-link-text)] hover:bg-[var(--pd-button-link-hover-bg)]';
  }

  if (type !== 'tab') {
    result += ' rounded-[4px]';
  }

  return result;
});
</script>

<button
  type="button"
  class="relative {padding} box-border whitespace-nowrap select-none transition-all outline-transparent focus:outline-[var(--pd-button-primary-hover-bg)] {classes} {classNames}"
  class:border-[var(--pd-button-tab-border-selected)]={type === 'tab' && selected}
  class:hover:border-[var(--pd-button-tab-hover-border)]={type === 'tab' && !selected}
  class:text-[var(--pd-button-tab-text-selected)]={type === 'tab' && selected}
  class:text-[var(--pd-button-tab-text)]={type === 'tab' && !selected}
  hidden={hidden}
  title={title}
  aria-label={ariaLabel}
  onclick={onclick}
  disabled={disabled || inProgress}>
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
