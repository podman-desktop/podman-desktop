<script lang="ts">
import { Button, ErrorMessage, Input } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import { kubernetesContexts } from '/@/stores/kubernetes-contexts';
import type { KubeContext } from '/@api/kubernetes-context';

import Dialog from '../dialogs/Dialog.svelte';

interface Props {
  detailed?: boolean;
  contextToEdit: KubeContext;
  closeCallback: () => void;
}

let { detailed = false, contextToEdit, closeCallback }: Props = $props();

let contextName = $state('');
let contextNamespace = $state('');

let contextNameErrorMessage = $state('');
let contextNamespaceErrorMessage = $state('');

let contexts: KubeContext[] = $state($kubernetesContexts);
let kubeConfig = $state('~/.kube/config');

$effect(() => {
  const context = contexts?.find(ctx => ctx.name === contextName);
  // Show error when is the new name identical with any other context name in the kubeConfig
  if (context) {
    contextNameErrorMessage = `This context name already exists in ${kubeConfig}`;
  } else {
    contextNameErrorMessage = contextName === '' ? 'Please enter a value' : '';
  }
});

onMount(async () => {
  contextName = contextToEdit?.name;
  contextNamespace = contextToEdit?.namespace ?? '';
  kubeConfig = (await window.getConfigurationValue('kubernetes.Kubeconfig')) ?? kubeConfig;
});

function disableSave(name: string): boolean {
  return (
    name.trim() === '' || contexts?.find(ctx => ctx.name === contextName) !== undefined || name === contextToEdit.name
  );
}

async function editContext(contextName: string, contextNamespace: string): Promise<void> {
  const context = contexts?.find(ctx => ctx.name === contextName);
  if (context) return;

  try {
    await window.kubernetesUpdateContext(contextToEdit.name, contextName, contextNamespace);
    closeCallback();
  } catch (error: unknown) {
    contextNameErrorMessage =
      error && typeof error === 'object' && 'message' in error && error.message ? String(error.message) : String(error);
  }

  if (detailed) {
    router.goto('/preferences/kubernetes-contexts');
  }
}
</script>

<Dialog
    title="Edit Context"
    on:close={closeCallback}>
    <div slot="content" class="w-full">
    <label for="contextName" class="block my-2 text-sm font-bold text-[var(--pd-modal-text)]">Context Name</label>
    <Input
        bind:value={contextName}
        name="contextName"
        id="contextName"
        placeholder="Enter context name (e.g. kind-context-name-1)"
        aria-invalid={contextNameErrorMessage !== ''}
        aria-label="contextName"
        required />
    {#if contextNameErrorMessage}
        <ErrorMessage error={contextNameErrorMessage} />
    {/if}

    <label for="contextNamespace" class="block my-2 text-sm font-bold text-[var(--pd-modal-text)]">Context Namespace</label>
    <Input
        bind:value={contextNamespace}
        name="contextNamespace"
        id="contextNamespace"
        placeholder="Enter context namespace (e.g. production)"
        aria-invalid={contextNamespaceErrorMessage !== ''}
        aria-label="contextNamespace"
        required />
    {#if contextNamespaceErrorMessage}
        <ErrorMessage error={contextNamespaceErrorMessage} />
    {/if}
    </div>
    <svelte:fragment slot="buttons">
    <Button
        class="pcol-start-3"
        type="link"
        on:click={closeCallback}>Cancel</Button>
    <Button
        class="col-start-4"
        disabled={disableSave(contextName)}
        on:click={async (): Promise<void> => {
        await editContext(contextName, contextNamespace);
        }}>Save</Button>
    </svelte:fragment>
</Dialog>
    