<script lang="ts">
import { createEventDispatcher, type Snippet } from 'svelte';

interface Props {
  id: string;
  name?: string;
  checked?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  left?: boolean;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  children?: Snippet;
}

let {
  id,
  name,
  checked = $bindable(false),
  readonly = false,
  disabled = false,
  left = false,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
  children,
}: Props = $props();

const enabled = $derived(!readonly && !disabled);

const dispatch = createEventDispatcher();

function onInput(): void {
  dispatch('checked', !checked);
}
</script>

<label class="inline-flex items-center cursor-pointer" for={id}>
  {#if left && children}
    <span
      class="mr-3 text-sm"
      class:text-[var(--pd-input-toggle-on-text)]={checked}
      class:text-[var(--pd-input-toggle-off-text)]={!checked}>{@render children?.()}</span>
  {/if}
  <div class="relative inline-flex items-center cursor-pointer">
    <input
      id={id}
      name={name}
      type="checkbox"
      class="sr-only peer"
      oninput={onInput}
      bind:checked={checked}
      readonly={readonly}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      aria-label={ariaLabel} />
    <div
      class="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:rounded-full after:h-4 after:w-4 after:transition-all"
      class:bg-[var(--pd-input-toggle-off-bg)]={enabled}
      class:hover:bg-[var(--pd-input-toggle-off-focused-bg)]={enabled}
      class:after:bg-[var(--pd-input-toggle-switch)]={enabled}
      class:hover:after:bg-[var(--pd-input-toggle-focused-switch)]={enabled}
      class:peer-checked:bg-[var(--pd-input-toggle-on-bg)]={enabled}
      class:hover:peer-checked:bg-[var(--pd-input-toggle-on-focused-bg)]={enabled}
      class:bg-[var(--pd-input-toggle-off-disabled-bg)]={!enabled}
      class:peer-checked:bg-[var(--pd-input-toggle-on-disabled-bg)]={!enabled}
      class:after:bg-[var(--pd-input-toggle-disabled-switch)]={!enabled}>
    </div>
  </div>
  {#if !left && children}
    <span
      class="ml-3"
      class:text-[var(--pd-input-toggle-on-text)]={checked && !disabled}
      class:text-[var(--pd-input-toggle-off-text)]={!checked && !disabled}
      class:text-[var(--pd-input-toggle-disabled-text)]={disabled}>{@render children?.()}</span>
  {/if}
</label>
