<script lang="ts">
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import type { OpenDialogOptions } from '@podman-desktop/api';
import { Button, Checkbox, ErrorMessage } from '@podman-desktop/ui-svelte';
import Fa from 'svelte-fa';

import MonacoEditor from '/@/lib/editor/MonacoEditor.svelte';
import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import NoContainerEngineEmptyScreen from '/@/lib/image/NoContainerEngineEmptyScreen.svelte';
import KubePlayIcon from '/@/lib/kube/KubePlayIcon.svelte';
import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import FileInput from '/@/lib/ui/FileInput.svelte';
import WarningMessage from '/@/lib/ui/WarningMessage.svelte';
import { handleNavigation } from '/@/navigation';
import { providerInfos } from '/@/stores/providers';
import { NavigationPage } from '/@api/navigation-page';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

let runStarted = $state(false);
let runFinished = $state(false);
let runError = $state('');
let kubeBuild: boolean = $state(false);
let kubeReplace: boolean = $state(false);
let runWarning = $state('');
let kubernetesYamlFilePath: string | undefined = $state(undefined);
let customYamlContent: string = $state('');
let userChoice: 'podman' | 'custom' = $state('podman');
let selectedProviderConnection: ProviderContainerConnectionInfo | undefined = $state(undefined);

let hasInvalidFields = $derived.by(() => {
  if (!selectedProviderConnection) return true;
  switch (userChoice) {
    case 'podman':
      return kubernetesYamlFilePath === undefined;
    case 'custom':
      return customYamlContent.length === 0;
  }
});

let playKubeResultRaw: string | undefined = $state(undefined);
let playKubeResultJSON: unknown | undefined = $state(undefined);
let playKubeResult: { Pods?: unknown[] } | undefined = $state(undefined);

let providerConnections: ProviderContainerConnectionInfo[] = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    // keep only podman providers as it is not supported by docker
    .filter(providerContainerConnection => providerContainerConnection.type === 'podman')
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

$effect(() => {
  if (!selectedProviderConnection && providerConnections.length > 0) {
    selectedProviderConnection = providerConnections[0];
  }
});

const kubeFileDialogOptions: OpenDialogOptions = {
  title: 'Select a .yaml file to play',
  filters: [
    {
      name: 'YAML files',
      extensions: ['yaml', 'yml'],
    },
  ],
};

function removeEmptyOrNull(obj: object): object {
  Object.keys(obj).forEach(k => {
    const val = obj[k as keyof typeof obj];
    (val && typeof val === 'object' && removeEmptyOrNull(val)) ||
      (!val && val !== undefined && delete obj[k as keyof typeof obj]);
  });
  return obj;
}

async function playKubeFile(): Promise<void> {
  runStarted = true;
  runFinished = false;
  runError = '';

  let tempFilePath: string = '';

  try {
    let yamlFilePath: string;

    if (userChoice === 'custom') {
      // Create a temporary file with the custom YAML content
      tempFilePath = await window.createTempFile(customYamlContent);
      yamlFilePath = tempFilePath;
    } else {
      yamlFilePath = kubernetesYamlFilePath!;
    }

    if (yamlFilePath && selectedProviderConnection) {
      try {
        const result = await window.playKube(yamlFilePath, $state.snapshot(selectedProviderConnection), {
          build: $state.snapshot(kubeBuild),
          replace: $state.snapshot(kubeReplace),
        });

        // remove the null values from the result
        playKubeResultRaw = JSON.stringify(removeEmptyOrNull(result), undefined, 2);
        playKubeResultJSON = JSON.parse(playKubeResultRaw);

        // If there are container errors, that means that it was *able* to create the container
        // but if failed to start. We will add this to the "warning" section as we were able to create the
        // We add this with comma deliminated errors
        if (playKubeResultJSON && typeof playKubeResultJSON === 'object') {
          playKubeResult = {};
          if (
            'Pods' in playKubeResultJSON &&
            playKubeResultJSON.Pods !== undefined &&
            Array.isArray(playKubeResultJSON.Pods) &&
            playKubeResultJSON.Pods.length > 0
          ) {
            playKubeResult.Pods = playKubeResultJSON.Pods;
            // Filter out the pods that have container errors, but check to see that container errors exists first
            const containerErrors = playKubeResultJSON.Pods.filter(
              (pod: unknown) =>
                pod &&
                typeof pod === 'object' &&
                'ContainerErrors' in pod &&
                Array.isArray(pod.ContainerErrors) &&
                pod.ContainerErrors.length > 0,
            );

            // For each Pod that has container errors, we will add the container errors to the warning message
            if (containerErrors.length > 0) {
              runWarning = `The following pods were created but failed to start: ${containerErrors
                .map((pod: unknown) =>
                  pod && typeof pod === 'object' && 'ContainerErrors' in pod && Array.isArray(pod.ContainerErrors)
                    ? pod.ContainerErrors.join(', ')
                    : '',
                )
                .join(', ')}`;
            }
          }
        }

        runFinished = true;
      } catch (error) {
        runError = String(error);
        console.error('error playing kube file', error);
      }
    }
  } catch (error: unknown) {
    runError = String(error);
    console.error('error creating temporary file or playing kube', error);
  } finally {
    // Always cleanup temp file if one was created
    if (tempFilePath && userChoice === 'custom') {
      try {
        await window.removeTempFile(tempFilePath);
      } catch (error) {
        console.warn('Failed to cleanup temporary file:', error);
        // Don't show this error to the user as it's not critical
      }
    }
  }
  runStarted = false;
}

function goBackToPodsPage(): void {
  // redirect to the pods page
  handleNavigation({
    page: NavigationPage.PODMAN_PODS,
  });
}

function toggle(choice: 'podman' | 'custom'): void {
  userChoice = choice;

  // reset custom content when switching away from custom
  if (choice === 'podman') {
    customYamlContent = '';
  }
}
</script>

{#if providerConnections.length === 0}
  <NoContainerEngineEmptyScreen />
{/if}

{#if providerConnections.length > 0}
  <EngineFormPage title="Create pods from a Kubernetes YAML file" inProgress={runStarted && !runFinished}>
    {#snippet icon()}
    <KubePlayIcon size="30px" />
    {/snippet}

    {#snippet content()}
    <div class="space-y-6">
      <div hidden={runStarted}>
        <label for="containerFilePath" class="block mb-2 text-base font-bold text-[var(--pd-content-card-header-text)]"
          >Kubernetes YAML file</label>

      </div>

      <div class="flex flex-col">
        <button
          hidden={providerConnections.length === 0}
          class="border-2 rounded-md p-5 cursor-pointer bg-[var(--pd-content-card-inset-bg)]"
          aria-label="Podman Container Engine Runtime"
          aria-pressed={userChoice === 'podman' ? 'true' : 'false'}
          class:border-[var(--pd-content-card-border-selected)]={userChoice === 'podman'}
          class:border-[var(--pd-content-card-border)]={userChoice !== 'podman'}
          onclick={toggle.bind(undefined, 'podman')}>
          <div class="flex flex-row align-middle items-center">
            <div
              class="text-2xl pr-2"
              class:text-[var(--pd-content-card-border-selected)]={userChoice === 'podman'}
              class:text-[var(--pd-content-card-border)]={userChoice !== 'podman'}>
              <Fa icon={faCircleCheck} />
            </div>
            <FileInput
              name="containerFilePath"
              id="containerFilePath"
              readonly
              required
              bind:value={kubernetesYamlFilePath}
              placeholder="Select a .yaml file to play"
              options={kubeFileDialogOptions}
              class="w-full p-2" />
          </div>
          <div hidden={runStarted}>
            {#if providerConnections.length > 1}
              <label
                for="providerConnectionName"
                class="block mb-2 font-medium"
                class:text-[var(--pd-content-card-header-text)]={userChoice === 'podman'}
                class:text-[var(--pd-input-field-disabled-text)]={userChoice !== 'podman'}
                >Container Engine</label>
              <ContainerConnectionDropdown
                id="providerChoice"
                name="providerChoice"
                bind:value={selectedProviderConnection}
                disabled={userChoice === 'custom'}
                connections={providerConnections}/>
            {/if}
            {#if providerConnections.length === 1 && selectedProviderConnection}
              <input type="hidden" name="providerChoice" readonly bind:value={selectedProviderConnection.name} />
            {/if}
          </div>
        </button>

        <button
          class="border-2 rounded-md p-5 cursor-pointer bg-[var(--pd-content-card-inset-bg)]"
          aria-label="Create file from scratch"
          aria-pressed={userChoice === 'custom' ? 'true' : 'false'}
          class:border-[var(--pd-content-card-border-selected)]={userChoice === 'custom'}
          class:border-[var(--pd-content-card-border)]={userChoice !== 'custom'}
          onclick={toggle.bind(undefined, 'custom')}>
          <div class="flex flex-row align-middle items-center">
            <div
              class="text-2xl"
              class:text-[var(--pd-content-card-border-selected)]={userChoice === 'custom'}
              class:text-[var(--pd-content-card-border)]={userChoice !== 'custom'}>
              <Fa icon={faCircleCheck} />
            </div>
            <div
              class="pl-2"
              class:text-[var(--pd-content-card-text)]={userChoice === 'custom'}
              class:text-[var(--pd-input-field-disabled-text)]={userChoice !== 'custom'}>
              Create file from scratch
            </div>
          </div>
        </button>
      </div>

      <!-- Monaco Editor for custom YAML content -->
      {#if userChoice === 'custom'}
        <div class="space-y-3">
          <label for="custom-yaml-editor" class="block text-base font-bold text-[var(--pd-content-card-header-text)]">
            Custom Kubernetes YAML Content
          </label>
          <div id="custom-yaml-editor" class="h-[400px] border">
            <MonacoEditor
              readOnly={false}
              language="yaml"
              on:contentChange={(e): void => {
                customYamlContent = e.detail;
              }} />
          </div>
        </div>
      {/if}

      <div class="flex flex-col gap-y-2">
        <div class="text-base font-bold text-[var(--pd-content-card-header-text)]">Options</div>
        <div class="flex flex-row gap-x-2">
          <Checkbox class="mx-1 my-auto" title="Enable build" bind:checked={kubeBuild} >
            <div>Enable build</div>
          </Checkbox>
          <Checkbox class="mx-1 my-auto" title="Replace" bind:checked={kubeReplace} >
            <div>Replace</div>
          </Checkbox>
        </div>
      </div>

      {#if !runFinished}
        <Button
          on:click={playKubeFile}
          disabled={hasInvalidFields || runStarted}
          class="w-full"
          inProgress={runStarted}
          icon={KubePlayIcon}>
          {userChoice === 'custom' ? 'Play Custom YAML' : 'Play'}
        </Button>
      {/if}
      {#if runStarted}
        <div class="text-[var(--pd-content-card-text)] text-sm">
          Please wait during the Play Kube and do not change screen. This process may take a few minutes to complete...
        </div>
      {/if}

      {#if runWarning}
        <WarningMessage class="text-sm" error={runWarning} />
      {/if}

      {#if runError}
        <ErrorMessage class="text-sm" error={runError} />
      {/if}

      {#if playKubeResult}
        <!-- Output area similar to DeployPodToKube.svelte -->
        <div class="bg-[var(--pd--content-card-bg)] p-5 my-4 text-[var(--pd-content-card-text)]">
          <div class="flex flex-row items-center">
            <div>
              {#if playKubeResult.Pods && playKubeResult.Pods.length > 1}
                Created pods:
              {:else}
                Created pod:
              {/if}
            </div>
          </div>

          <div class="h-[100px] pt-2">
            <MonacoEditor content={playKubeResultRaw} language="json" />
          </div>
        </div>
      {/if}

      {#if runFinished}
        <Button onclick={goBackToPodsPage} class="w-full">Done</Button>
      {/if}
    </div>
    {/snippet}
  </EngineFormPage>
{/if}
