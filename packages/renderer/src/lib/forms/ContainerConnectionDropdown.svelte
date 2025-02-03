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

function handleChange(nValue: unknown): void {
  if (typeof nValue === 'string') {
    value = connections.find(connection => connection.endpoint.socketPath === nValue);
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
  options={connections.map(providerConnection => ({
            label: providerConnection.name,
            value: providerConnection.endpoint.socketPath,
          }))}>
</Dropdown>
