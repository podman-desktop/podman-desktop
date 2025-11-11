<script lang="ts">
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import type { Context, KubernetesObject } from '@kubernetes/client-node';
import type { OpenDialogOptions } from '@podman-desktop/api';
import { Button, Dropdown, ErrorMessage } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount, type Snippet } from 'svelte';
import { get } from 'svelte/store';
import { router } from 'tinro';

import MonacoEditor from '/@/lib/editor/MonacoEditor.svelte';
import KubeApplyIcon from '/@/lib/kube/KubePlayIcon.svelte';
import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import FileInput from '/@/lib/ui/FileInput.svelte';
import WarningMessage from '/@/lib/ui/WarningMessage.svelte';
import { lastPage } from '/@/stores/breadcrumb';

type UsersChoice = 'file' | 'custom';

let contexts: Context[] = $state([]);
let selectedContextName = $state('');
let runStarted = $state(false);
let runFinished = $state(false);
let runError = $state('');
let runWarning = $state('');
let kubernetesYamlFilePath = $state('');
let customYamlContent = $state('');
let userChoice: UsersChoice = $state('file');

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

let applyKubeResultRaw: string | undefined = $state(undefined);

const kubeFileDialogOptions: OpenDialogOptions = {
  title: 'Select a .yaml file to apply',
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
  let tempFilePath: string = '';
  let yamlFilePath: string[] = [];
  runStarted = true;
  runFinished = false;
  runError = '';
  applyKubeResultRaw = '';
  runWarning = '';

  try {
    if (userChoice === 'custom') {
      tempFilePath = await window.createTempFile(customYamlContent);
      yamlFilePath = [tempFilePath];
    } else {
      yamlFilePath = [kubernetesYamlFilePath];
    }
    let objects: KubernetesObject[] = await window.kubernetesApplyResourcesFromFile(
      selectedContextName,
      yamlFilePath,
      getSelectedContextNamespace(),
    );
    if (objects.length === 0) {
      runWarning = `No resource(s) were applied.`;
    } else if (objects.length === 1) {
      applyKubeResultRaw = `Successfully applied 1 ${objects[0].kind ?? 'unknown resource'}.`;
    } else {
      const counts = objects.reduce(
        (acc, obj) => {
          acc[obj.kind ?? 'unknown'] = (acc[obj.kind ?? 'unknown'] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      const resources = Object.entries(counts)
        .map(([kind, count]) => `${count} ${kind}`)
        .join(', ');
      applyKubeResultRaw = `Successfully applied ${objects.length} resources (${resources}).`;
    }
  } catch (error) {
    runError = 'Could not apply Kubernetes YAML: ' + error;
  } finally {
    if (tempFilePath) {
      await window.removeTempFile(tempFilePath);
    }
    runStarted = false;
    runFinished = true;
  }
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
    selectedContextName = (await window.kubernetesGetCurrentContextName()) ?? '';
  }
});
</script>

<EngineFormPage title="Apply Kubernetes YAML" inProgress={runStarted && !runFinished}>
  {#snippet icon()}
    <KubeApplyIcon size="30px" />
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
          placeholder="Select a .yaml file to apply"
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

      {@render optionSnippet('file', '.yaml file to apply', file)} <!-- eslint-disable-line sonarjs/no-use-of-empty-return-value -->
      {@render optionSnippet('custom', 'Custom yaml to apply', custom)} <!-- eslint-disable-line sonarjs/no-use-of-empty-return-value -->
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

    {#if applyKubeResultRaw}
      <div class="text-(--pd-content-card-text) text-sm">{applyKubeResultRaw}</div>
    {/if}

    <div class="flex flex-row gap-4">
      <Button class="grow" onclick={():void => router.goto(get(lastPage).path)} type={!runFinished || runError ? 'secondary' : 'primary'}>{runFinished? 'Done' : 'Cancel'}</Button>
      {#if !runFinished || runError}
        <Button
          type="primary"
          onclick={kubeApply}
          disabled={hasInvalidFields || runStarted}
          inProgress={runStarted}
          icon={KubeApplyIcon}
          class="grow">
          {userChoice === 'custom' ? 'Apply Custom YAML' : 'Apply'}
        </Button>
      {/if}
    </div>
  </div>
  {/snippet}
</EngineFormPage>
