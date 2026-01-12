<script lang="ts">
import SlideToggle from '/@/lib/ui/SlideToggle.svelte';
import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models.js';

export let record: IConfigurationPropertyRecordedSchema;
export let checked = false;
export let onChange = async (_id: string, _value: boolean): Promise<void> => {};
let invalidEntry = false;

function onChecked(state: boolean): void {
  invalidEntry = false;
  if (record.id && state !== checked) {
    onChange(record.id, state).catch((_: unknown) => (invalidEntry = true));
  }
}
</script>

<SlideToggle
  id="input-standard-{record.id}"
  name={record.id}
  left
  bind:checked={checked}
  on:checked={(event): void => onChecked(event.detail)}
  readonly={!!record.readonly || !!record.locked}
  disabled={!!record.readonly || !!record.locked}
  aria-invalid={invalidEntry}
  aria-label={record.description ?? record.markdownDescription}>
  <span class="text-xs">{checked ? 'Enabled' : 'Disabled'}</span>
</SlideToggle>
