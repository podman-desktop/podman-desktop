<script lang="ts">
import { Dropdown } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import { kubernetesContextsHealths } from '/@/stores/kubernetes-context-health';
import { kubernetesCurrentContextState } from '/@/stores/kubernetes-contexts-state';

let isExperimental: boolean = $state(false);

onMount(async () => {
  try {
    isExperimental = await window.isExperimentalConfigurationEnabled('kubernetes.statesExperimental');
  } catch {
    // keep default value
  }
});

let reachablePromise = $derived.by(async () => {
  if (isExperimental) {
    const contextName = await window.kubernetesGetCurrentContextName();
    return $kubernetesContextsHealths.some(
      contextHealth => contextHealth.contextName === contextName && contextHealth.reachable,
    );
  }
  return $kubernetesCurrentContextState?.reachable;
});

let namespacesPromise = $derived.by(async () => {
  return (await reachablePromise) ? await window.kubernetesListNamespaces() : undefined;
});

let currentNamespacePromise = $derived.by(async () => {
  return (await reachablePromise) ? await window.kubernetesGetCurrentNamespace() : '';
});

async function handleNamespaceChange(value: unknown): Promise<void> {
  const namespace = String(value);
  try {
    await window.kubernetesSetCurrentNamespace(namespace);
  } finally {
    await window.telemetryTrack('kubernetes.set.namespace');
  }
}
</script>

{#await reachablePromise then reachable}
{#await currentNamespacePromise then currentNamespace}
{#await namespacesPromise then namespaces}
<Dropdown
  ariaLabel="Kubernetes Namespace"
  name="namespace"
  class="w-56 max-w-56"
  value={currentNamespace}
  disabled={!reachable}
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
{/await}