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

/**
 * Internally this component generate a symbol for each connection provided
 * This ensure we have a unique identifier
 */
let items: Map<symbol, ProviderContainerConnectionInfo> = $derived(
  new Map(connections.map(connection => [Symbol(connection.name), connection])),
);

function handleChange(nValue: unknown): void {
  if (typeof nValue === 'symbol') {
    value = items.get(nValue);
  } else {
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
  value={value?.endpoint?.socketPath}
  onChange={handleChange}
  options={Array.from(items.entries()).map(([key, connection]) => ({
            label: connection.name,
            value: key,
          }))}>
</Dropdown>
