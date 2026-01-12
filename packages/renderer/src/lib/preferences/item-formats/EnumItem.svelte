<script lang="ts">
import { Dropdown } from '@podman-desktop/ui-svelte';

import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models.js';

export let record: IConfigurationPropertyRecordedSchema;
export let value: string | undefined;
export let onChange = async (_id: string, _value: string): Promise<void> => {};

let invalidEntry = false;

function onChangeHandler(newValue: unknown): void {
  invalidEntry = false;
  if (record.id && newValue !== value) {
    onChange(record.id, newValue as string).catch((_: unknown) => (invalidEntry = true));
  }
}
</script>

<Dropdown
  name={record.id}
  id="input-standard-{record.id}"
  onChange={onChangeHandler}
  bind:value={value}
  ariaInvalid={invalidEntry}
  ariaLabel={record.description}
  disabled={!!record.readonly || !!record.locked}
  options={record.enum?.map(recordEnum => ({label: recordEnum, value: recordEnum}))}>
</Dropdown>
