<script lang="ts">
import type { Booleanish, FormEventHandler } from 'svelte/elements';

import Input from './Input.svelte';

interface Props {
  name?: string;
  value: number;
  required?: boolean;
  disabled?: boolean;
  minimum?: number;
  maximum?: number;
  error?: string;
  showError?: boolean;
  type: 'number' | 'integer';
  step?: number;
  oninput?: FormEventHandler<HTMLInputElement>;
  onValidation?: (value: number, error?: string) => void;
  class?: string;
  'aria-label'?: string;
  'aria-invalid'?: Booleanish | 'grammar' | 'spelling' | null;
}

let {
  name,
  value = $bindable(),
  required = false,
  disabled = false,
  minimum,
  maximum,
  error = $bindable(),
  showError = true,
  type,
  step,
  oninput,
  onValidation = (_value: number, _error?: string): void => {}, // callback after validation occurs
  class: className = '',
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
}: Props = $props();

let valueAsString = $derived(value !== undefined ? String(value) : undefined);
let minimumEnabled: boolean | undefined = $derived(
  !disabled && (minimum === undefined || minimum < Number(valueAsString)),
);
let maximumEnabled: boolean | undefined = $derived(
  !disabled && (maximum === undefined || maximum > Number(valueAsString)),
);

$effect(() => {
  if (valueAsString !== undefined || disabled) {
    validateNumber();
  }
});

function validateNumber(): void {
  const numberToValidate = Number(valueAsString);
  if (maximum !== undefined && numberToValidate > maximum) {
    error = `The value cannot be greater than ${maximum}`;
  } else if (minimum !== undefined && numberToValidate < minimum) {
    error = `The value cannot be less than ${minimum}`;
  } else {
    error = undefined;
  }

  // update converted value
  value = numberToValidate;
  // send the callback
  onValidation(numberToValidate, error);
}

function onKeyPress(event: KeyboardEvent): void {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  // Numbers with a zero fractional part are considered integers
  // see https://json-schema.org/understanding-json-schema/reference/numeric

  // get cursor position
  const cursorPosition = event.target.selectionStart ?? 0;

  // add the new character to the cursor position
  const wantedValue = `${event.target.value.slice(0, cursorPosition)}${event.key}${event.target.value.slice(cursorPosition)}`;

  // now, check if type is integer if the value is value without digits or with zero fractional part
  if (type === 'integer' && Number.isInteger(Number(wantedValue))) {
    return;
  } else if (type === 'number' && !isNaN(Number(wantedValue))) {
    return;
  } else {
    // else prevent to use that key
    event.preventDefault();
  }
}

// handle float precision when adding floating point numbers
function precision(value: number, incrementOrDecrement: number): number {
  const valuePrecisionDigits = value.toString().split('.')[1]?.length ?? 0;
  const stepPrecisionDigits = incrementOrDecrement.toString().split('.')[1]?.length ?? 0;
  // use as precision either the value precision or the step precision
  const precisionDigits = Math.max(valuePrecisionDigits, stepPrecisionDigits);

  // if incrementOrDecrement is negative, it will decrement
  return Number((Number(value) + incrementOrDecrement).toFixed(precisionDigits));
}

function onDecrement(e: MouseEvent): void {
  const dec = step ?? 1;
  e.preventDefault();
  value = precision(value, -dec);
}

function onIncrement(e: MouseEvent): void {
  const inc = step ?? 1;
  e.preventDefault();
  value = precision(value, inc);
}
</script>

<Input
  class={className}
  inputClass="text-center"
  name={name}
  bind:value={valueAsString}
  onkeypress={onKeyPress}
  oninput={oninput}
  showError={showError}
  error={error}
  disabled={disabled}
  required={required}
  aria-label={ariaLabel}
  aria-invalid={ariaInvalid}>
  {#snippet left()}
    <button
      class="pr-0.5"
      class:text-[var(--pd-input-field-stroke)]={minimumEnabled}
      class:text-[var(--pd-input-field-disabled-text)]={!minimumEnabled}
      class:group-hover:text-[var(--pd-input-field-hover-stroke)]={minimumEnabled}
      data-action="decrement"
      aria-label="decrement"
      onclick={onDecrement}
      disabled={!minimumEnabled}>-</button>
    <button
      class="pl-0.5"
      class:text-[var(--pd-input-field-stroke)]={maximumEnabled}
      class:text-[var(--pd-input-field-disabled-text)]={!maximumEnabled}
      class:group-hover:text-[var(--pd-input-field-hover-stroke)]={maximumEnabled}
      data-action="increment"
      aria-label="increment"
      onclick={onIncrement}
      disabled={!maximumEnabled}>+</button>
  {/snippet}
</Input>
