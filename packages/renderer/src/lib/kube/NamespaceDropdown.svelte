<script lang="ts">
import type { V1NamespaceList } from '@kubernetes/client-node';
import { Dropdown } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

let namespaces = $state<V1NamespaceList>();
let currentNamespace = $state<string>();

onMount(async () => {
  // grab all the namespace info
  try {
    namespaces = await window.kubernetesListNamespaces();
    currentNamespace = await window.kubernetesGetCurrentNamespace();
  } catch (error) {
    console.debug('Not able to list namespaces, possibly a permission error', error);
  }
});

async function handleNamespaceChange(value: unknown): Promise<void> {
  const namespace = String(value);
  await window.kubernetesSetCurrentNamespace(namespace);
}
</script>

<Dropdown
  ariaLabel="Kubernetes Namespace"
  name="namespace"
  class="w-48 max-w-48"
  value={currentNamespace}
  onChange={handleNamespaceChange}
  options={namespaces?.items?.map(namespace => ({
    label: namespace.metadata?.name ?? '',
    value: namespace.metadata?.name ?? '',
  }))}>
</Dropdown>