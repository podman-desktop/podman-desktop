<script lang="ts">
import { uncertainStringToNumber } from '/@/lib/preferences/Util';
import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models';

export let record: IConfigurationPropertyRecordedSchema;
export let value: number;
export let onChange = async (_id: string, _value: number): Promise<void> => {};

async function onInput(event: Event): Promise<void> {
  const target = event.currentTarget as HTMLInputElement;
  const _value = uncertainStringToNumber(target.value);
  if (record.id && _value !== value) await onChange(record.id, _value);
}
</script>

<input
  id="input-slider-{record.id}"
  type="range"
  name={record.id}
  min={record.minimum}
  max={record.maximum}
  step={record.step}
  value={value}
  aria-label={record.description}
  on:input={onInput}
  class="w-full h-1 bg-[var(--pd-input-toggle-on-bg)] rounded-lg appearance-none accent-[var(--pd-input-toggle-on-bg)] cursor-pointer range-xs mt-2" />
