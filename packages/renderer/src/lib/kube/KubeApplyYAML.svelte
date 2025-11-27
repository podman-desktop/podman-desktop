<script lang="ts">
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import type { Context, KubernetesObject } from '@kubernetes/client-node';
import type { OpenDialogOptions } from '@podman-desktop/api';
import { Button, Dropdown, ErrorMessage } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount, type Snippet } from 'svelte';

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
let kubernetesYamlFilePath: string = $state('');
let customYamlContent: string = $state('');
let userChoice: 'file' | 'custom' = $state('file');

let hasInvalidFields = $derived.by(() => {
  if (!selectedContextName) {
    return true;
  }
  switch (userChoice) {
    case 'file':
      return !kubernetesYamlFilePath;
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

function getSelectedContextNamespace(): string | undefined {
  const selectedContext = contexts.find(context => context.name === selectedContextName);
  return selectedContext?.namespace;
}

async function kubeApply(): Promise<void> {
  runError = '';

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
    yamlFilePath = [kubernetesYamlFilePath];
  }

  runStarted = true;
  runFinished = false;
  try {
    let objects: KubernetesObject[] = await window.kubernetesApplyResourcesFromFile(
      selectedContextName,
      yamlFilePath,
      getSelectedContextNamespace(),
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
  } finally {
    if (tempFilePath) {
      await window.removeTempFile(tempFilePath);
    }
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
  if (contexts.length) {
    selectedContextName = await window.kubernetesGetCurrentContextName();
  }
});
</script>

<EngineFormPage title="Create pods from a Kubernetes YAML file" inProgress={runStarted && !runFinished}>
  {#snippet icon()}
    <KubePlayIcon size="30px" />
  {/snippet}

  {#snippet content()}
    
  <div class="space-y-6">
    <div>
      <label for="kubeContexts" class="block mb-2 text-base font-bold text-(--pd-content-card-header-text)"
        >Kubernetes Context</label>
    </div>
    <div class="flex flex-col">
      <div
        class="border-2 rounded-md p-5 cursor-pointer bg-(--pd-content-card-inset-bg) border-(--pd-content-card-border)">
        <Dropdown
          id="kubeContexts"
          name="kubeContexts"
          bind:value={selectedContextName}
          options={contexts.map(context => ({
            label: context.name,
            value: context.name,
          }))}>
            {#snippet left()}
              {#if !contexts.length }
                <ErrorMessage aria-label="No Kubernetes contexts available" icon={true} error="No Kubernetes contexts available" class="pr-2"/>
              {/if}
            {/snippet}
          </Dropdown>
      </div>
    </div>
    
    <label for="containerFilePath" class="block mb-2 text-base font-bold text-(--pd-content-card-header-text)"
      >Kubernetes YAML file</label>
    
    <div class="flex flex-col">
      {#snippet file()}
        <FileInput
          name="containerFilePath"
          id="containerFilePath"
          readonly
          required
          bind:value={kubernetesYamlFilePath}
          placeholder="Select a .yaml file to play"
          options={kubeFileDialogOptions}
          class="w-full p-2" />
      {/snippet}

      {#snippet custom()}
        <div
          class="pl-2"
          class:text-[var(--pd-content-card-text)]={userChoice === 'custom'}
          class:text-[var(--pd-input-field-disabled-text)]={userChoice !== 'custom'}>
          Create custom YAML from scratch
        </div>
      {/snippet}

      {#snippet optionSnippet(option: 'file' | 'custom', label: string, content: Snippet)}
        <button disabled={runStarted}
          class="border-2 rounded-md p-5 cursor-pointer bg-(--pd-content-card-inset-bg)"
          aria-label={label}
          aria-pressed={userChoice === option ? 'true' : 'false'}
          class:border-[var(--pd-content-card-border-selected)]={userChoice === option}
          class:border-[var(--pd-content-card-border)]={userChoice !== option}
          onclick={toggle.bind(undefined, option)}>
          <div class="flex flex-row align-middle items-center">
            <div
              class="text-2xl pr-2"
              class:text-[var(--pd-content-card-border-selected)]={userChoice === option}
              class:text-[var(--pd-content-card-border)]={userChoice !== option}>
              <Icon icon={faCircleCheck} />
            </div>
            {@render content()}
          </div>
        </button>
      {/snippet}

      {@render optionSnippet('file', '.yaml file to play', file)} <!-- eslint-disable-line sonarjs/no-use-of-empty-return-value -->
      {@render optionSnippet('custom', 'Custom yaml to play', custom)} <!-- eslint-disable-line sonarjs/no-use-of-empty-return-value -->
    </div>

    <!-- Monaco Editor for custom YAML content -->
    {#if userChoice === 'custom'}
      <div class="space-y-3">
        <label for="custom-yaml-editor" class="block text-base font-bold text-(--pd-content-card-header-text)">
          Custom Kubernetes YAML Content
        </label>
        <div id="custom-yaml-editor" class="h-[400px] border">
          <MonacoEditor
            readOnly={runStarted}
            language="yaml"
            on:contentChange={(e): void => {
              customYamlContent = e.detail;
            }}/>
        </div>
      </div>
    {/if}

    {#if runStarted}
      <div class="text-(--pd-content-card-text) text-sm">
        Please don't leave the page while the Kubernetes YAML is being applied. This process may take a few minutes to complete...
      </div>
    {/if}

    {#if runWarning}
      <WarningMessage class="text-sm" error={runWarning} />
    {/if}

    {#if runError}
      <ErrorMessage class="text-sm" error={runError} />
    {/if}

    {#if playKubeResultRaw}
      <div class="text-(--pd-content-card-text) text-sm">{playKubeResultRaw}</div>
    {/if}

    <div class="flex gap-2">
      <Button
        on:click={kubeApply}
        disabled={hasInvalidFields || runStarted}
        class="grow"
        inProgress={runStarted}
        icon={KubePlayIcon}>
        {userChoice === 'custom' ? 'Apply Custom YAML' : 'Apply'}
      </Button>

      <Button onclick={goBackToPodsPage} class="grow">Done</Button>
    </div>
  </div>
  {/snippet}
</EngineFormPage>
