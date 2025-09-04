<script lang="ts">
import PasswordInput from '/@/lib/ui/PasswordInput.svelte';
import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models';

interface Props {
  record: IConfigurationPropertyRecordedSchema;
  value: string | undefined;
  onChange: (id: string, value: string) => Promise<void>;
}

let { record, value, onChange }: Props = $props();

let invalidEntry = $state(false);

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (record.id && target.value !== value)
    onChange(record.id, target.value).catch((_: unknown) => (invalidEntry = true));
}
</script>

<PasswordInput
  on:input={onInput}
  class="grow"
  name={record.id}
  placeholder={record.placeholder}
  bind:value={value}
  readonly={!!record.readonly}
  id="input-standard-{record.id}"
  aria-invalid={invalidEntry}
  aria-label={record.description} />
