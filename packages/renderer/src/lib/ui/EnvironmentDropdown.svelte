<script lang="ts">
import { Dropdown } from '@podman-desktop/ui-svelte';

import { containerConnectionCount, providerInfos } from '/@/stores/providers';

interface Props {
  selectedEnvironment?: string;
  onChange?: (value: string) => void;
}

let { selectedEnvironment = $bindable(''), onChange = (): void => {} }: Props = $props();

// Get all active container connections as environment options
const environmentOptions = $derived.by(() => {
  const options: { label: string; value: string }[] = [{ label: 'All', value: '' }];

  $providerInfos.forEach(provider => {
    provider.containerConnections
      .filter(connection => connection.status === 'started')
      .forEach(connection => {
        const engineId = `${provider.id}.${connection.name}`;
        // Show connection type if there's only one of that type, otherwise show displayName
        const label =
          $containerConnectionCount[connection.type] > 1
            ? connection.displayName
            : connection.type.charAt(0).toUpperCase() + connection.type.slice(1);

        options.push({
          label,
          value: engineId,
        });
      });
  });

  return options;
});

const showDropdown = $derived(environmentOptions.length > 0);

function handleChange(value: string): void {
  selectedEnvironment = value;
  onChange(value);
}
</script>

{#if showDropdown}
  <Dropdown
    ariaLabel="Environment"
    name="environment"
    class="w-48 max-w-48"
    value={selectedEnvironment}
    onChange={handleChange}
    options={environmentOptions}>
    {#snippet left()}
      <div class="mr-1 text-[var(--pd-input-field-placeholder-text)]">Environment:</div>
    {/snippet}
  </Dropdown>
{/if}
