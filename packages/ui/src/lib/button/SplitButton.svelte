<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { Component, Snippet } from 'svelte';

import Icon from '../icons/Icon.svelte';
import Spinner from '../progress/Spinner.svelte';
import type { ButtonType } from './Button';

export interface SplitButtonOption {
  id: string;
  label: string;
  icon?: IconDefinition | Component | string;
  description?: string;
  disabled?: boolean;
}

interface Props {
  title?: string;
  inProgress?: boolean;
  disabled?: boolean;
  type?: Exclude<ButtonType, 'link' | 'tab'>;
  icon?: IconDefinition | Component | string;
  options: SplitButtonOption[];
  /** Selected option ID(s) - works for both single and multi-select modes */
  selectedOptionIds?: string[];
  /** Enable multiple selection mode */
  multipleSelection?: boolean;
  emptyLabel?: string;
  /** Label shown when options exist but none are actionable (all disabled) */
  noActionLabel?: string;
  /** Label shown when options exist but none is selected (clicking opens dropdown) */
  noSelectionLabel: string;
  class?: string;
  'aria-label'?: string;
  /** Called when main button is clicked with all selected options */
  onAction?: (options: SplitButtonOption[]) => void;
  /** Called when selection changes with all selected options */
  onSelect?: (options: SplitButtonOption[]) => void;
  children?: Snippet;
}

let {
  title,
  inProgress = false,
  disabled = false,
  type = 'primary',
  icon,
  options,
  selectedOptionIds = $bindable([]),
  multipleSelection = false,
  emptyLabel = 'No options available',
  noActionLabel = 'Show options...',
  noSelectionLabel,
  class: classNames = '',
  'aria-label': ariaLabel,
  onAction,
  onSelect,
  children,
}: Props = $props();

let showDropdown = $state(false);
let buttonRef = $state<HTMLDivElement>();

const isEmpty = $derived(options.length === 0);
// First selected option (used for button display)
const selectedOption = $derived(options.find(o => selectedOptionIds.includes(o.id)));
// All selected options
const selectedOptions = $derived(options.filter(o => selectedOptionIds.includes(o.id)));
// Check if an option is selected
const isOptionSelected = (optionId: string): boolean => selectedOptionIds.includes(optionId);
// Check if any option is actionable (not disabled)
const hasActionableOption = $derived(options.some(o => !o.disabled));
// Check if no option is selected (for button display purposes)
const hasNoSelection = $derived(!isEmpty && hasActionableOption && selectedOptionIds.length === 0);
// Main action is disabled when explicitly disabled or no options exist
const isMainDisabled = $derived(disabled || isEmpty);
// Dropdown can be opened even if selected option is disabled (to see/change options)
const isDropdownDisabled = $derived(disabled || isEmpty);
// Show "no action" mode when options exist but none are actionable
const isNoActionMode = $derived(!isEmpty && !hasActionableOption);

function handleEscape({ key }: KeyboardEvent): void {
  if (key === 'Escape') {
    showDropdown = false;
  }
}

function onWindowClick(e: MouseEvent): void {
  if (!buttonRef?.contains(e.target as Node)) {
    showDropdown = false;
  }
}

function handleMainClick(): void {
  if (inProgress) return;

  // In "no action" or "no selection" mode, clicking main button opens dropdown
  if (isNoActionMode || hasNoSelection) {
    showDropdown = !showDropdown;
    return;
  }

  if (!isMainDisabled && selectedOptions.length > 0) {
    // Close dropdown before executing action
    showDropdown = false;
    onAction?.(selectedOptions);
  }
}

function handleDropdownClick(e: MouseEvent): void {
  e.stopPropagation();
  if (!isDropdownDisabled && !inProgress) {
    showDropdown = !showDropdown;
  }
}

function selectOption(option: SplitButtonOption): void {
  if (option.disabled) return;

  if (multipleSelection) {
    // Toggle selection in multi-select mode
    if (selectedOptionIds.includes(option.id)) {
      selectedOptionIds = selectedOptionIds.filter(id => id !== option.id);
    } else {
      selectedOptionIds = [...selectedOptionIds, option.id];
    }
    // Keep dropdown open in multi-select mode
  } else {
    // Single-select mode: replace with single item
    selectedOptionIds = [option.id];
    showDropdown = false;
  }

  // Notify parent with all selected options
  const allSelected = options.filter(o => selectedOptionIds.includes(o.id));
  onSelect?.(allSelected);
}

const styles = {
  primary: {
    button: {
      enabled:
        'bg-[var(--pd-button-primary-bg)] text-[var(--pd-button-text)] hover:bg-[var(--pd-button-primary-hover-bg)]',
      disabled: 'bg-[var(--pd-button-disabled)] text-[var(--pd-button-disabled-text)]',
    },
    divider: 'bg-[var(--pd-button-text)]',
    border: 'border-[var(--pd-button-primary-bg)]',
    containerBg: 'bg-[var(--pd-button-primary-bg)]',
    focusOutline: 'focus:outline-[var(--pd-button-primary-hover-bg)]',
  },
  secondary: {
    button: {
      enabled:
        'border-[1px] border-[var(--pd-button-secondary)] text-[var(--pd-button-secondary)] hover:bg-[var(--pd-button-secondary-hover)] hover:border-[var(--pd-button-secondary-hover)] hover:text-[var(--pd-button-text)]',
      disabled:
        'border-[1px] border-[var(--pd-button-disabled)] bg-[var(--pd-button-disabled)] text-[var(--pd-button-disabled-text)]',
    },
    divider: 'bg-[var(--pd-button-secondary)]',
    border: 'border-[var(--pd-button-secondary)]',
    containerBg: 'bg-[var(--pd-button-disabled)]',
    focusOutline: 'focus:outline-[var(--pd-button-secondary)]',
  },
  danger: {
    button: {
      enabled:
        'border-2 border-[var(--pd-button-danger-border)] bg-[var(--pd-button-danger-bg)] text-[var(--pd-button-danger-text)] hover:bg-[var(--pd-button-danger-hover-bg)] hover:text-[var(--pd-button-danger-hover-text)]',
      disabled:
        'border-2 border-[var(--pd-button-danger-disabled-border)] text-[var(--pd-button-danger-disabled-text)] bg-[var(--pd-button-danger-disabled-bg)]',
    },
    divider: 'bg-[var(--pd-button-danger-text)]',
    border: 'border-[var(--pd-button-danger-border)]',
    containerBg: 'bg-[var(--pd-button-danger-bg)]',
    focusOutline: 'focus:outline-[var(--pd-button-danger-hover-bg)]',
  },
};

const currentStyle = $derived(styles[type]);

// Main button styling (enabled in "no action" or "no selection" mode to allow opening dropdown)
const mainClasses = $derived(
  (isMainDisabled && !isNoActionMode && !hasNoSelection) || inProgress
    ? currentStyle.button.disabled
    : currentStyle.button.enabled,
);

// Dropdown toggle styling (disabled only when empty or explicitly disabled)
const dropdownClasses = $derived(
  isDropdownDisabled || inProgress ? currentStyle.button.disabled : currentStyle.button.enabled,
);

const dividerClasses = $derived(
  isDropdownDisabled || inProgress ? 'bg-[var(--pd-button-disabled-text)]' : currentStyle.divider,
);

const borderClasses = $derived(
  isDropdownDisabled || inProgress ? 'border-[var(--pd-button-disabled)]' : currentStyle.border,
);

const containerBgClasses = $derived(
  isDropdownDisabled || inProgress ? 'bg-[var(--pd-button-disabled)]' : currentStyle.containerBg,
);

// Determine the label to display on the button
const buttonLabel = $derived.by(() => {
  if (isEmpty) return emptyLabel;
  if (isNoActionMode) return noActionLabel;
  if (hasNoSelection) return noSelectionLabel;
  if (!children && selectedOption) return selectedOption.label;
  return undefined;
});
</script>

<svelte:window onkeyup={handleEscape} onclick={onWindowClick} />

<div class="relative inline-block" bind:this={buttonRef}>
  <!-- Split button container -->
  <div class="flex flex-row items-center rounded-[4px] overflow-hidden border {borderClasses} {containerBgClasses} {classNames}">
    <!-- Main action button -->
    <button
      type="button"
      class="relative px-4 py-[5px] whitespace-nowrap select-none transition-all outline-transparent {currentStyle.focusOutline} rounded-l-[4px] {mainClasses}"
      title={title}
      aria-label={ariaLabel}
      onclick={handleMainClick}
      disabled={(isMainDisabled && !isNoActionMode && !hasNoSelection) || inProgress}>
      <div class="flex flex-row items-center gap-2">
        {#if inProgress}
          <Spinner size="1em" />
        {:else if icon}
          <Icon {icon} />
        {/if}

        {#if buttonLabel !== undefined}
          <span>{buttonLabel}</span>
        {:else if children}
          <span>{@render children()}</span>
        {/if}
      </div>
    </button>

    <!-- Divider -->
    <div class="w-[1px] h-4 {dividerClasses} shrink-0"></div>

    <!-- Dropdown toggle button -->
    <button
      type="button"
      class="px-2 py-[5px] self-stretch flex items-center transition-all outline-transparent {currentStyle.focusOutline} rounded-r-[4px] {dropdownClasses}"
      aria-label="Select action"
      aria-haspopup="listbox"
      aria-expanded={showDropdown}
      onclick={handleDropdownClick}
      disabled={isDropdownDisabled || inProgress}>
      <Icon icon={faChevronDown} class="w-3 text-current" />
    </button>
  </div>

  <!-- Dropdown menu -->
  {#if showDropdown}
    <div
      class="absolute right-0 mt-1 min-w-full w-max bg-[var(--pd-dropdown-bg)] border border-[var(--pd-dropdown-border)] rounded-md shadow-lg z-50"
      role="listbox"
      aria-multiselectable={multipleSelection}>
      {#each options as option (option.id)}
        {@const selected = isOptionSelected(option.id)}
        <button
          type="button"
          class="w-full text-left px-4 py-2 first:rounded-t-md last:rounded-b-md flex items-center gap-2
            {option.disabled
              ? 'text-[var(--pd-dropdown-item-disabled-text)] cursor-not-allowed opacity-60'
              : 'hover:bg-[var(--pd-dropdown-item-hover-bg)] hover:text-[var(--pd-dropdown-item-hover-text)] text-[var(--pd-dropdown-item-text)]'}"
          class:bg-[var(--pd-dropdown-item-selected-bg)]={selected && !option.disabled}
          role="option"
          aria-selected={selected}
          aria-disabled={option.disabled}
          disabled={option.disabled}
          onclick={(): void => selectOption(option)}>
          <!-- Checkmark for selected option(s) -->
          <span class="w-4 flex-shrink-0">
            {#if selected && !option.disabled}
              <Icon icon={faCheck} class="w-4 text-current" />
            {/if}
          </span>
          {#if option.icon}
            <Icon icon={option.icon} class="w-4" />
          {/if}
          <div class="flex flex-col">
            <span class="font-medium">{option.label}</span>
            {#if option.description}
              <span class="text-xs text-[var(--pd-dropdown-item-description-text)] opacity-70"
                >{option.description}</span>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>
