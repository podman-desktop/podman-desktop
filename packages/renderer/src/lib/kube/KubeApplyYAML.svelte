<script lang="ts">
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import type { Context, KubernetesObject } from '@kubernetes/client-node';
import type { OpenDialogOptions } from '@podman-desktop/api';
import { Button, Dropdown, ErrorMessage } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import Fa from 'svelte-fa';

import { handleNavigation } from '/@/navigation';
import { NavigationPage } from '/@api/navigation-page';

import MonacoEditor from '../editor/MonacoEditor.svelte';
import KubePlayIcon from '../kube/KubePlayIcon.svelte';
import EngineFormPage from '../ui/EngineFormPage.svelte';
import FileInput from '../ui/FileInput.svelte';
import WarningMessage from '../ui/WarningMessage.svelte';

let contexts: Context[] = $state([]);
let selectedContextName: string | undefined = $state();
let runStarted = $state(false);
let runFinished = $state(false);
let runError = $state('');
let runWarning = $state('');
let kubernetesYamlFilePath: string | undefined = $state(undefined);
let customYamlContent: string = $state('');
let userChoice: 'file' | 'custom' = $state('file');

let hasInvalidFields = $derived.by(() => {
  if (!selectedContextName) {
    return false;
  }
  switch (userChoice) {
    case 'file':
      return kubernetesYamlFilePath === undefined;
    case 'custom':
      return customYamlContent.length === 0;
  }
});

let playKubeResultRaw: string | undefined = $state(undefined);

const kubeFileDialogOptions: OpenDialogOptions = {
  title: 'Select a .yaml file to play',
  filters: [
    {
      name: 'YAML files',
      extensions: ['yaml', 'yml'],
    },
  ],
};

async function kubeApply(): Promise<void> {
  // this if is here to suppress linter error that selectedContextName can be undefined
  if (!selectedContextName) {
    throw new Error('No context selected');
  }

  let tempFilePath: string = '';

  let yamlFilePath: string[] = [];

  if (userChoice === 'custom') {
    // Create a temporary file with the custom YAML content
    tempFilePath = await window.createTempFile(customYamlContent);
    yamlFilePath = [tempFilePath];
  } else {
    const result = await window.openDialog({
      title: 'Select a .yaml file to apply',
      selectors: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'YAML files',
          extensions: ['yaml', 'yml', 'YAML', 'YML'],
        },
      ],
    });

    if (!result || result.length === 0) {
      return;
    }
    yamlFilePath = result;
  }

  runStarted = true;
  runFinished = false;
  try {
    const namespace = await window.kubernetesGetCurrentNamespace();
    let objects: KubernetesObject[] = await window.kubernetesApplyResourcesFromFile(
      selectedContextName,
      yamlFilePath,
      namespace,
    );
    if (objects.length === 0) {
      playKubeResultRaw = `No resource(s) were applied.`;
    } else if (objects.length === 1) {
      runWarning = `Successfully applied 1 ${objects[0].kind ?? 'unknown resource'}.`;
    } else {
      const counts = objects.reduce(
        (acc, obj) => {
          acc[obj.kind ?? 'unknown'] = (acc[obj.kind ?? 'unknown'] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      const resources = Object.entries(counts)
        .map(obj => `${obj[1]} ${obj[0]}`)
        .join(', ');
      playKubeResultRaw = `Successfully applied ${objects.length} resources (${resources}).`;
    }
  } catch (error) {
    runError = 'Could not apply Kubernetes YAML: ' + error;
  }
  runStarted = false;
  runFinished = true;
}

function goBackToPodsPage(): void {
  // redirect to the pods page
  handleNavigation({
    page: NavigationPage.PODMAN_PODS,
  });
}

function toggle(choice: 'file' | 'custom'): void {
  userChoice = choice;

  // reset custom content when switching away from custom
  if (choice === 'file') {
    customYamlContent = '';
  }
}

onMount(async () => {
  contexts = await window.kubernetesGetContexts();
  selectedContextName = await window.kubernetesGetCurrentContextName();
});
</script>
  <EngineFormPage title="Create pods from a Kubernetes YAML file" inProgress={runStarted && !runFinished}>
    {#snippet icon()}
      <KubePlayIcon size="30px" />
    {/snippet}

    {#snippet content()}
      <div class="space-y-6">
        <div>
          <label for="" class="block mb-2 text-base font-bold text-[var(--pd-content-card-header-text)]">Kubernetes Context</label>
        </div>
        <div class="flex flex-col">
          <div class="border-2 rounded-md p-5 cursor-pointer bg-[var(--pd-content-card-inset-bg)] border-[var(--pd-content-card-border)]">
            <Dropdown 
              id="kubeContexts"
              name="kubeContexts"
              value={selectedContextName}
              options={contexts.map(context => ({
                label: context.name,
                value: context.name,
              }))}/>
            </div>
        </div>
        <div hidden={runStarted}>
          <label for="containerFilePath" class="block mb-2 text-base font-bold text-[var(--pd-content-card-header-text)]"
            >Kubernetes YAML file</label>
        </div>

        <div class="flex flex-col">
          <button
            class="border-2 rounded-md p-5 cursor-pointer bg-[var(--pd-content-card-inset-bg)]"
            aria-label=".yaml file to play"
            aria-pressed={userChoice === 'file' ? 'true' : 'false'}
            class:border-[var(--pd-content-card-border-selected)]={userChoice === 'file'}
            class:border-[var(--pd-content-card-border)]={userChoice !== 'file'}
            onclick={toggle.bind(undefined, 'file')}>
            <div class="flex flex-row align-middle items-center">
              <div
                class="text-2xl pr-2"
                class:text-[var(--pd-content-card-border-selected)]={userChoice === 'file'}
                class:text-[var(--pd-content-card-border)]={userChoice !== 'file'}>
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

        {#if !runFinished}
          <Button
            on:click={kubeApply}
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

        {#if playKubeResultRaw}
          <!-- Output area similar to DeployPodToKube.svelte -->
          <div class="space-y-3">
            <label for="custom-yaml-editor" class="block text-base font-bold text-[var(--pd-content-card-header-text)]">
              Created resources
            </label>
            <div id="custom-yaml-editor" class="h-[400px] border">
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
