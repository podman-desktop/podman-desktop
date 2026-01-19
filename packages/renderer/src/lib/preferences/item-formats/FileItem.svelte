<script lang="ts">
import type { OpenDialogOptions } from '@podman-desktop/api';

import FileInput from '/@/lib/ui/FileInput.svelte';
import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models.js';

export let record: IConfigurationPropertyRecordedSchema;
export let value: string = '';
export let onChange = async (_id: string, _value: string): Promise<void> => {};

let invalidEntry = false;
let dialogOptions: OpenDialogOptions = {
  title: `Select ${record.description}`,
  selectors: record.format === 'folder' ? ['openDirectory'] : ['openFile'],
};

function onChangeFileInput(value: string): void {
  if (record.id) {
    onChange(record.id, value).catch((_: unknown) => (invalidEntry = true));
  }
}
</script>

<div class="w-full flex">
  <!-- By default, we set 'readonly' to FALSE unless explicitly defined within
   .record of the schema. This allows edits to the fileinput. -->
  <FileInput
    id="input-standard-{record.id}"
    name={record.id}
    bind:value={value}
    onChange={onChangeFileInput}
    readonly={record.readonly ?? record.locked ?? false}
    clearable={true}
    placeholder={record.placeholder}
    options={dialogOptions}
    aria-invalid={invalidEntry}
    aria-label={record.description} />
</div>
