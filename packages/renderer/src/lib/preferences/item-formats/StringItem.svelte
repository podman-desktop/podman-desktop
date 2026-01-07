<script lang="ts">
import { Input } from '@podman-desktop/ui-svelte';

import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models';

export let record: IConfigurationPropertyRecordedSchema;
export let value: string | undefined;
export let onChange = async (_id: string, _value: string): Promise<void> => {};

let invalidEntry = false;

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (record.id && target.value !== value) {
    onChange(record.id, target.value).catch((_: unknown) => (invalidEntry = true));
  }
}
</script>

<Input
  on:input={onInput}
  class="grow"
  name={record.id}
  placeholder={record.placeholder}
  value={value}
  readonly={!!record.readonly || !!record.locked}
  id="input-standard-{record.id}"
  aria-invalid={invalidEntry}
  aria-label={record.description} />
