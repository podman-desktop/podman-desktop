<script lang="ts">
import { faCheck, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';
import { Button } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import FloatNumberItem from './FloatNumberItem.svelte';

export let record: IConfigurationPropertyRecordedSchema;
export let value: number;
export let description: string | undefined = undefined;
export let onSave = (_recordId: string, _value: number): void => {};
export let onChange = (_recordId: string, _value: number): void => {};
export let onCancel = (_recordId: string, _originalValue: number): void => {};

let editingInProgress = false;
let editedValue: number;
$: editedValue = value;
let disableSaveButton: boolean;
$: disableSaveButton = !editingInProgress;
let originalValue: number;

function invalidRecord(_error: string): void {
  if (_error) {
    disableSaveButton = true;
  }
}

function onChangeInput(_: string, _value: number): void {
  editedValue = _value;
  disableSaveButton = false;
  if (record.id) {
    onChange(record.id, editedValue);
  }
}

function onSwitchToInProgress(e: Event): void {
  e.preventDefault();
  // we set the originalValue to keep a record of the initial value
  // if the updating is cancelled, we can reset to it
  originalValue = value;
  editingInProgress = true;
}

function onSaveClick(e: Event): void {
  e.preventDefault();
  editingInProgress = false;
  if (record.id) {
    onSave(record.id, editedValue);
  }
}

function onCancelClick(e: Event): void {
  e.preventDefault();
  // we set the value to the initial one - the value that was set when the edit mode was enabled
  editedValue = originalValue;
  editingInProgress = false;
  if (record.id) {
    onCancel(record.id, originalValue);
  }
}
</script>

<div class="flex flex-row ml-1 items-center">
  {#if !editingInProgress}
    {value}
  {:else}
    <FloatNumberItem
      record={record}
      value={Number(editedValue)}
      onChange={onChangeInput}
      invalidRecord={invalidRecord} />
  {/if}
  {#if description}
    <span class="ml-1" aria-label="description">
      {description}
    </span>
  {/if}

  {#if !editingInProgress}
    <Button on:click={onSwitchToInProgress} title="Edit" class="ml-1" padding="p-2" type="link">
      <Icon size="0.8x" icon={faPencil} />
    </Button>
  {:else}
    <Button on:click={onCancelClick} title="Cancel" class="ml-3" padding="p-2" type="link">
      <Icon size="0.9x" class="text-[var(--pd-state-error)]" icon={faXmark} />
    </Button>
    <Button on:click={onSaveClick} title="Save" padding="p-2" disabled={disableSaveButton} type="link">
      <Icon size="0.9x" class={`${disableSaveButton ? 'text-[var(--pd-button-disabled-text)]' : 'text-[var(--pd-state-success)]'}`} icon={faCheck} />
    </Button>
  {/if}
</div>
