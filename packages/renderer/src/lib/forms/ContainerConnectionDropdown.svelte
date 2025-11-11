<script lang="ts">
import { Dropdown } from '@podman-desktop/ui-svelte';

import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

interface Props {
  connections: ProviderContainerConnectionInfo[];
  value: ProviderContainerConnectionInfo | undefined;
  name?: string;
  id?: string;
  onchange?(value: ProviderContainerConnectionInfo | undefined): void;
  class?: string;
  disabled?: boolean;
}

let {
  connections,
  name = 'providerChoice',
  id,
  value = $bindable(),
  onchange,
  class: className,
  disabled,
}: Props = $props();

let selected: string | undefined = $state<string>();

/**
 * Internally this component generate a unique string for each connection provided
 * This ensure we have a unique identifier
 */
let items: Map<string, ProviderContainerConnectionInfo> = $derived(
  new Map(connections.map(connection => [`${connection.type}:${connection.name}`, connection])),
);

function handleChange(nValue: unknown): void {
  if (typeof nValue === 'string') {
    selected = nValue;
    value = items.get(nValue);
  } else {
    selected = undefined;
    value = undefined;
  }

  onchange?.(value);
}
</script>

<Dropdown
  id={id}
  class={className}
  name={name}
  disabled={disabled}
  value={selected}
  onChange={handleChange}
  options={Array.from(items.entries()).map(([key, connection]) => ({
            label: connection.name,
            value: key,
          }))}>
</Dropdown>
