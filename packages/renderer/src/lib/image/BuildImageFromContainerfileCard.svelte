<script lang="ts">
import { faCircle, faPlusCircle, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Checkbox, isFontAwesomeIcon, Tooltip } from '@podman-desktop/ui-svelte';
import type { Component } from 'svelte';
import { createEventDispatcher, onMount, tick } from 'svelte';
import Fa from 'svelte-fa';

export let title: string = '';
export let badge: string = '';
export let isDefault: boolean = false;
export let checked: boolean = false;
export let value: string = '';
export let icon: IconDefinition | Component | undefined = undefined;
let iconType: 'fontAwesome' | 'unknown' | undefined = undefined;

export let additionalItem: boolean = false;
let additionalValue: string = '';

let displayValueFieldInput = false;

let inputHtmlElement: HTMLInputElement | undefined;

let badges: string[] = [];

const dispatch = createEventDispatcher();

export let onAddcard: (obj: { value: string }) => void = obj => {
  dispatch('addcard', obj);
};

export let onCard: (obj: { mode: 'add' | 'remove'; value: string }) => void = obj => {
  dispatch('card', obj);
};

function handleKeydownAdditionalField(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    onAddcard({ value: additionalValue });
    displayValueFieldInput = false;
  }
}

function handleClick(): void {
  if (additionalItem) {
    // display the new field input
    displayValueFieldInput = true;
    additionalValue = '';

    // make focus on the input field
    tick()
      .then(() => {
        if (inputHtmlElement) {
          inputHtmlElement.focus();
        }
      })
      .catch((err: unknown) => console.error('Error tick', err));
    return;
  }

  checked = !checked;
  if (checked) {
    onCard({ mode: 'add', value: value });
  } else {
    onCard({ mode: 'remove', value: value });
  }
}

onMount(() => {
  if (isFontAwesomeIcon(icon)) {
    iconType = 'fontAwesome';
  } else {
    iconType = 'unknown';
  }

  if (badge) {
    badges = [badge];
  }
  if (isDefault) {
    badges.push('Default');
  }

  if (checked) {
    onCard({ mode: 'add', value: value });
  }
});
</script>

<button
  class="rounded-md bg-[var(--pd-content-card-inset-bg)] p-2 min-w-48 w-48 min-h-24 cursor-pointer hover:bg-[var(--pd-content-card-hover-inset-bg)] {checked
    ? 'border-[var(--pd-content-card-border-selected)]'
    : 'border-[var(--pd-content-card-border)]'} border-2 flex flex-col"
  aria-label={value}
  on:click|preventDefault={handleClick}>
  <div class="flex flex-row">
    <div class="flex flex-col">
      {#if !additionalItem}
        <Checkbox bind:checked={checked} title={title} on:click={handleClick} />
      {:else}
        <Fa class="text-[var(--pd-content-card-icon)] cursor-pointer" icon={faPlusCircle} size="1.5x" />
      {/if}
    </div>
    <div class="ml-2 text-left break-normal w-36 text-[var(--pd-content-card-text)]">{title}</div>
    {#if isDefault}
      <Tooltip tip="Default platform of your computer">
        <Fa size="0.5x" class="text-[var(--pd-content-card-border-selected)] cursor-pointer" icon={faCircle} />
      </Tooltip>
    {/if}
  </div>
  <div class="flex flex-row grow w-full mt-2 items-end">
    <div class="flex">
      {#if badges.length > 0}
        {#each badges as badge, index (index)}
          <div
            class="text-[var(--pd-content-card-text)] border-[var(--pd-content-card-border-selected)] border text-sm font-medium me-2 px-2.5 py-0.5 rounded-xl">
            {badge}
          </div>
        {/each}
      {/if}
      {#if displayValueFieldInput}
        <input
          type="text"
          class="w-40 outline-hidden bg-[var(--pd-input-field-bg)] focus:bg-[var(--pd-input-field-focused-bg)] rounded-xs text-[var(--pd-content-text)]"
          bind:value={additionalValue}
          bind:this={inputHtmlElement}
          on:keydown={handleKeydownAdditionalField} />
      {/if}
    </div>
    <div class="flex grow justify-end">
      {#if icon}
        {#if iconType === 'fontAwesome'}
          <Fa class="text-[var(--pd-content-card-icon)] cursor-pointer" icon={icon as IconDefinition} size="1.5x" />
        {:else if iconType === 'unknown'}
          <svelte:component this={icon as Component} class="text-[var(--pd-content-card-icon)] cursor-pointer" size="24" />
        {/if}
      {/if}
    </div>
  </div>
</button>
