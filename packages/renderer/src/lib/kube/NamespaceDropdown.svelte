<script lang="ts">
import { Dropdown } from '@podman-desktop/ui-svelte';

import { kubernetesCurrentContextState } from '/@/stores/kubernetes-contexts-state';

let namespacesPromise = $derived.by(async () => {
  return $kubernetesCurrentContextState.reachable ? await window.kubernetesListNamespaces() : undefined;
});

let currentNamespacePromise = $derived.by(async () => {
  return $kubernetesCurrentContextState.reachable ? await window.kubernetesGetCurrentNamespace() : '';
});

async function handleNamespaceChange(value: unknown): Promise<void> {
  const namespace = String(value);
  await window.kubernetesSetCurrentNamespace(namespace);
}
</script>

{#await currentNamespacePromise then currentNamespace}
{#await namespacesPromise then namespaces}
<Dropdown
  ariaLabel="Kubernetes Namespace"
  name="namespace"
  class="w-56 max-w-56"
  value={currentNamespace}
  disabled={!$kubernetesCurrentContextState.reachable}
  onChange={handleNamespaceChange}
  options={namespaces?.items?.map(namespace => ({
    label: namespace.metadata?.name ?? '',
    value: namespace.metadata?.name ?? '',
  }))}>
  {#snippet left()}
  <div class="mr-1 text-[var(--pd-input-field-placeholder-text)]">Namespace:</div>
  {/snippet}
</Dropdown>
{/await}
{/await}