<script lang="ts">
import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';
import { NumberInput, Tooltip } from '@podman-desktop/ui-svelte';

interface Props {
  record: IConfigurationPropertyRecordedSchema;
  value?: number;
  onChange?: (id: string, value: number) => void;
  invalidRecord?: (error: string) => void;
}
let {
  record,
  value = $bindable(0),
  onChange = (_id: string, _value: number): void => {},
  invalidRecord = (_error: string): void => {},
}: Props = $props();

let valueUpdateTimeout: NodeJS.Timeout;

let lastValue: number;
let error: string | undefined = $state(undefined);

function onValidation(newValue: number, validationError?: string): void {
  if (validationError) {
    invalidRecord(validationError);
  }
  // if the value is different from the original update
  if (record.id && newValue !== lastValue && !error) {
    // clear the timeout so if there was an old call to onChange pending is deleted. We will create a new one soon
    const recordId = record.id;
    clearTimeout(valueUpdateTimeout);

    valueUpdateTimeout = setTimeout(() => {
      onChange(recordId, newValue);
      lastValue = newValue;
    }, 500);
  }
}
</script>

<Tooltip topLeft tip={error}>
  <NumberInput
    class="w-24"
    name={record.id}
    onValidation={onValidation}
    bind:value={value}
    bind:error={error}
    aria-label={record.description}
    minimum={record.minimum}
    step={record.step}
    type={record.type === 'integer' ? 'integer' : 'number'}
    maximum={record.maximum && typeof record.maximum === 'number' ? record.maximum : undefined}
    disabled={!!record.readonly || !!record.locked}
    showError={false}>
  </NumberInput>
</Tooltip>
