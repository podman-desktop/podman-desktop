<script lang="ts">
import { Dropdown } from '@podman-desktop/ui-svelte';

import { providerInfos } from '/@/stores/providers';

interface Props {
  selectedEnvironment?: string;
  onChange?: (value: string) => void;
}

let { selectedEnvironment = $bindable(''), onChange = (): void => {} }: Props = $props();

// Get all running container connections
const runningConnections = $derived(
  $providerInfos.flatMap(provider =>
    provider.containerConnections
      .filter(connection => connection.status === 'started')
      .map(connection => ({
        ...connection,
        engineId: `${provider.id}.${connection.name}`,
      })),
  ),
);

// Count running connections per type for labeling
const runningConnectionCount = $derived(
  runningConnections.reduce(
    (acc, connection) => {
      acc[connection.type] = (acc[connection.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  ),
);

// Get all running container connections as environment options
const environmentOptions = $derived.by(() => {
  const options: { label: string; value: string }[] = [{ label: 'All', value: '' }];

  runningConnections.forEach(connection => {
    // Show connection type if there's only one of that type, otherwise show displayName
    const label =
      runningConnectionCount[connection.type] > 1
        ? connection.displayName
        :  capitalize(connection.type);

    options.push({
      label,
      value: connection.engineId,
    });
  });

  return options;
});

// Only show dropdown when there are multiple environments to choose from
const showDropdown = $derived(runningConnections.length > 1);

// Reset selectedEnvironment if the currently selected value no longer exists
$effect(() => {
  if (selectedEnvironment && !environmentOptions.some(opt => opt.value === selectedEnvironment)) {
    selectedEnvironment = '';
    onChange('');
  }
});

// Find the longest option label to set consistent width
const longestLabel = $derived(
  environmentOptions.reduce((longest, option) => (option.label.length > longest.length ? option.label : longest), ''),
);

function handleChange(value: string): void {
  selectedEnvironment = value;
  onChange(value);
}
</script>

{#if showDropdown}
  <div class="inline-grid max-w-64">
    <!-- Sizer: renders longest option to establish grid cell width -->
    <div class="invisible col-start-1 row-start-1 flex items-center px-1 py-1 whitespace-nowrap" aria-hidden="true">
      <span class="mr-1">Environment:</span>
      <span class="truncate">{longestLabel}</span>
      <span class="w-4 shrink-0"></span>
    </div>
    <!-- Actual dropdown in same grid cell -->
    <Dropdown
      ariaLabel="Environment"
      name="environment"
      class="col-start-1 row-start-1 whitespace-nowrap !grow-0"
      value={selectedEnvironment}
      onChange={handleChange}
      options={environmentOptions}>
      {#snippet left()}
        <div class="mr-1 text-[var(--pd-input-field-placeholder-text)]">Environment:</div>
      {/snippet}
    </Dropdown>
  </div>
{/if}
