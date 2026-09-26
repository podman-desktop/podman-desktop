<script lang="ts">
import type { IConfigurationPropertyRecordedSchema } from '@podman-desktop/core-api/configuration';
import { Dropdown } from '@podman-desktop/ui-svelte';

import { providerInfos } from '/@/stores/providers';

interface Props {
  record: IConfigurationPropertyRecordedSchema;
  value?: string;
  onChange?: (_id: string, _value: string) => Promise<void>;
}

let {
  record,
  value = $bindable(),
  onChange = async (_id: string, _value: string): Promise<void> => {},
}: Props = $props();

let invalidEntry = $state(false);
let lastNotifiedValue: string | undefined = $state(undefined);
let wasSelectedConnectionAvailable: boolean | undefined = $state(undefined);

type ContainerProviderType = 'podman' | 'docker';

function isLegacyProviderValue(value: string | undefined): value is ContainerProviderType {
  return value === 'podman' || value === 'docker';
}

const connectionOptions = $derived(
  $providerInfos.flatMap(provider =>
    provider.containerConnections
      .filter(
        connection => connection.status === 'started' && (connection.type === 'podman' || connection.type === 'docker'),
      )
      .map(connection => ({
        label: `${connection.displayName} (${connection.type === 'podman' ? 'Podman' : 'Docker'})`,
        providerType: connection.type as ContainerProviderType,
        value: JSON.stringify({
          providerId: provider.id,
          connectionName: connection.name,
        }),
      })),
  ),
);

const selectedConnectionAvailable = $derived(!!value && connectionOptions.some(option => option.value === value));

const displayedOptions = $derived.by(() => {
  if (value && !selectedConnectionAvailable) {
    return [{ label: 'Selected connection is unavailable', value }, ...connectionOptions];
  }
  if (connectionOptions.length === 0) {
    return [{ label: 'No running container connections', value: '' }];
  }
  return connectionOptions;
});

$effect(() => {
  if (isLegacyProviderValue(value)) {
    const migratedOption = connectionOptions.find(option => option.providerType === value);
    if (migratedOption) {
      value = migratedOption.value;
    }
  }

  if (!value && connectionOptions.length > 0) {
    value = connectionOptions[0].value;
  } else if (value && value !== lastNotifiedValue) {
    lastNotifiedValue = value;
    notifyChange(value);
  } else if (
    value &&
    wasSelectedConnectionAvailable !== undefined &&
    wasSelectedConnectionAvailable !== selectedConnectionAvailable
  ) {
    // Re-audit the unchanged selection when it stops, disappears, or becomes available again.
    notifyChange(value);
  }
  wasSelectedConnectionAvailable = selectedConnectionAvailable;
});

function notifyChange(newValue: string): void {
  invalidEntry = false;
  if (record.id) {
    onChange(record.id, newValue).catch(() => (invalidEntry = true));
  }
}

function onChangeHandler(newValue: unknown): void {
  if (typeof newValue === 'string' && newValue !== value) {
    value = newValue;
    lastNotifiedValue = newValue;
    notifyChange(newValue);
  }
}
</script>

<Dropdown
  name={record.id}
  id="input-standard-{record.id}"
  onChange={onChangeHandler}
  bind:value
  ariaInvalid={invalidEntry}
  ariaLabel={record.description}
  disabled={!!record.readonly || !!record.locked || connectionOptions.length === 0}
  options={displayedOptions}>
</Dropdown>
