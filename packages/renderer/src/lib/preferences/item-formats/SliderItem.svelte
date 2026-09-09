<script lang="ts">
import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';

import { uncertainStringToNumber } from '/@/lib/preferences/Util';

interface Props {
  record: IConfigurationPropertyRecordedSchema;
  value?: number;
  onChange?: (_id: string, _value: number) => Promise<void>;
}
let {
  record,
  value = $bindable(),
  onChange = async (_id: string, _value: number): Promise<void> => {},
}: Props = $props();

// appearance-none drops the browser's native track rendering, which is what would otherwise let
// accent-color paint the filled portion left of the thumb -- so the fill has to be built by hand.
// Writable $derived: reassigning displayValue in onInput overrides it locally until value changes again.
let displayValue = $derived(value);

const fillPercent = $derived.by(() => {
  const min = record.minimum ?? 0;
  const max = record.maximum === undefined ? 100 : uncertainStringToNumber(record.maximum);

  if (max <= min) return 0;

  const current = Math.min(Math.max(displayValue ?? min, min), max);

  return (((current - min) / (max - min)) * 100).toFixed(2);
});

const trackBackground = $derived(
  `linear-gradient(to right, var(--pd-input-toggle-on-bg) ${fillPercent}%, var(--pd-input-slider-track-bg) ${fillPercent}%)`,
);

async function onInput(event: Event): Promise<void> {
  const target = event.currentTarget as HTMLInputElement;
  const _value = uncertainStringToNumber(target.value);
  displayValue = _value;
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
  oninput={onInput}
  disabled={!!record.readonly || !!record.locked}
  style:background={trackBackground}
  class="w-full h-1 rounded-lg appearance-none accent-(--pd-input-toggle-on-bg) cursor-pointer range-xs mt-2" />
