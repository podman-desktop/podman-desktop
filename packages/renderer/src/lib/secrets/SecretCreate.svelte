<script lang="ts">
import {
  NavigationPage,
  type ProviderContainerConnectionInfo,
  type SecretCreateOptions,
  type SecretCreateResult,
  type SecretInfo,
} from '@podman-desktop/core-api';
import { Button, Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import MonacoEditor from '/@/lib/editor/MonacoEditor.svelte';
import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import SecretIcon from '/@/lib/images/SecretIcon.svelte';
import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import { handleNavigation } from '/@/navigation';
import { providerInfos } from '/@/stores/providers';
import { secretsInfo } from '/@/stores/secrets';

let createError: string | undefined = $state(undefined);
let createResult: SecretCreateResult | undefined = $state(undefined);

let createdSecret: SecretInfo | undefined = $derived(
  createResult
    ? $secretsInfo.find(secret => secret.engineId === createResult?.engineId && secret.Id === createResult?.id)
    : undefined,
);

let loading: boolean = $state(false);
let secretCreateOptions: SecretCreateOptions = $state({
  selectedProvider: undefined,
  name: '',
  data: '',
});

let providerConnections = $derived(
  $providerInfos.reduce<ProviderContainerConnectionInfo[]>((acc, provider) => {
    const startedConnections = provider.containerConnections.filter(connection => connection.status === 'started');
    return acc.concat(startedConnections);
  }, []),
);
let valid = $derived(secretCreateOptions.name.length > 0 && secretCreateOptions.data.length > 0);

$effect(() => {
  if (providerConnections.length > 0 && secretCreateOptions.selectedProvider === undefined) {
    secretCreateOptions.selectedProvider = providerConnections[0];
  }
});

async function createSecret(): Promise<void> {
  if (secretCreateOptions.selectedProvider === undefined) {
    console.error('No provider selected');
    return;
  }

  try {
    loading = true;
    createError = undefined;
    createResult = undefined;

    createResult = await window.createSecret($state.snapshot(secretCreateOptions));
  } catch (err: unknown) {
    createError = String(err);
  } finally {
    loading = false;
  }
}

function onSecretDataChange(event: CustomEvent<string>): void {
  secretCreateOptions.data = event.detail;
}

function close(): void {
  handleNavigation({
    page: NavigationPage.SECRETS,
  });
}

function openSecretDetails(): void {
  if (!createResult) return;

  handleNavigation({
    page: NavigationPage.SECRET,
    parameters: createResult,
  });
}
</script>

<EngineFormPage
  title="Create a Secret"
  showEmptyScreen={providerConnections.length === 0}
>
  {#snippet icon()}
    <Icon icon={SecretIcon} size={27} />
  {/snippet}
  {#snippet content()}
    <div class="space-y-6">
      {#if providerConnections.length > 1}
        <div>
          <label for="providerChoice" class="block mb-2 font-semibold text-(--pd-content-card-header-text)"
          >Container engine <span class="text-red-500">*</span></label>
          <ContainerConnectionDropdown
            id="providerChoice"
            name="providerChoice"
            bind:value={secretCreateOptions.selectedProvider}
            connections={providerConnections} />
        </div>
      {/if}

      <div>
        <label for="secretName" class="block mb-2 font-semibold text-(--pd-content-card-header-text)"
        >Name <span class="text-red-500">*</span></label>
        <Input
          bind:value={secretCreateOptions.name}
          name="secretName"
          id="secretName"
          placeholder="Secret name"
          required
          class="w-full" />
      </div>

      <div>
        <label for="secretData" class="block mb-2 font-semibold text-(--pd-content-card-header-text)"
        >Data <span class="text-red-500">*</span></label>
        <div class="h-[100px] pt-2">
          <MonacoEditor on:contentChange={onSecretDataChange} language="text" readOnly={false} />
        </div>
      </div>

      <div class="w-full flex flex-row space-x-4">
        {#if createdSecret === undefined}
          <Button type="secondary" class="w-full" onclick={close}>Cancel</Button>
          <Button
            disabled={!valid || loading}
            inProgress={loading || (createResult && !createdSecret)}
            class="w-full"
            onclick={createSecret}>
            Create
          </Button>
        {:else}
          <Button type="secondary" class="w-full" onclick={openSecretDetails}>See details</Button>
        {/if}
      </div>

      {#if createError}
        <div class="text-red-500 text-sm">
          Error: {createError}
        </div>
      {/if}
    </div>
  {/snippet}
</EngineFormPage>
