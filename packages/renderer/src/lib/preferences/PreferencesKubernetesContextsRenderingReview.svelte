<script lang="ts">
import { faFileImport, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, ErrorMessage, FormPage } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { router } from 'tinro';

import { kubernetesContexts } from '/@/stores/kubernetes-contexts';
import type { KubeContext } from '/@api/kubernetes-context';

import WarningMessage from '../ui/WarningMessage.svelte';

const KEEP_BOTH = 'keep-both';
const REPLACE = 'replace';

type ConflictResolution = typeof KEEP_BOTH | typeof REPLACE;

interface LoadedContext extends KubeContext {
  selected: boolean;
  hasConflict: boolean;
  conflictResolution: ConflictResolution;
  originalName: string;
  certificateChanged: boolean;
}

interface Props {
  filePath: string;
}

const { filePath }: Props = $props();

let loadedContexts: LoadedContext[] = $state([]);
let existingContexts: KubeContext[] = $state([]);
let loading: boolean = $state(false);
let errorMessage: string = $state('');

onMount(async () => {
  existingContexts = $kubernetesContexts;

  // Get the kubeconfig file path from props (passed via route parameter)
  if (!filePath) {
    errorMessage = 'No kubeconfig file path found. Please go back and select a file.';
    return;
  }

  const decodedPath = decodeURIComponent(filePath);

  try {
    // Parse the kubeconfig file using the backend API
    const parsedContexts = await window.kubernetesParseKubeconfigFile(decodedPath);

    if (parsedContexts.length === 0) {
      errorMessage = 'No valid contexts found in the config file';
      return;
    }

    // Process loaded contexts and check for conflicts
    loadedContexts = [];
    for (let index = 0; index < parsedContexts.length; index++) {
      const context = parsedContexts[index];
      const hasConflict = existingContexts.some(existing => existing.name === context.name);
      const certificateChanged = await window.kubernetesHasCertificateChanged(decodedPath, context.name);

      loadedContexts.push({
        ...context,
        selected: true, // Default to selected
        hasConflict,
        conflictResolution: KEEP_BOTH,
        originalName: context.name,
        certificateChanged: certificateChanged,
      });
    }
  } catch (error: unknown) {
    errorMessage = `Failed to parse config file: ${error}`;
  }
});

function updateConflictResolution(index: number, resolution: ConflictResolution): void {
  loadedContexts[index].conflictResolution = resolution;
}

function generatePreviewName(contextName: string): string {
  // Get all existing context names from the current kubeconfig
  const existingNames = existingContexts.map(ctx => ctx.name);

  let counter = 1;
  let newName = `${contextName}-${counter}`;
  while (existingNames.includes(newName)) {
    counter += 1;
    newName = `${contextName}-${counter}`;
  }
  return newName;
}

async function importSelectedContexts(): Promise<void> {
  const selectedContexts = loadedContexts.filter(context => context.selected);

  if (selectedContexts.length === 0) {
    errorMessage = 'Please select at least one context to import';
    return;
  }

  loading = true;
  errorMessage = '';

  try {
    // Get the kubeconfig file path from props
    if (!filePath) {
      throw new Error('Original kubeconfig file path not found');
    }

    const decodedPath = decodeURIComponent(filePath);

    // Prepare conflict resolutions
    const conflictResolutions: SvelteMap<string, ConflictResolution> = new SvelteMap();
    selectedContexts.forEach(context => {
      if (context.hasConflict) {
        conflictResolutions.set(context.originalName, context.conflictResolution);
      }
    });

    // Import using backend API
    await window.kubernetesImportContextsFromFile(
      decodedPath,
      selectedContexts.map(ctx => ctx.originalName),
      conflictResolutions,
    );

    // Navigate back to contexts page
    goToKubernetesContextsPage();
  } catch (err: unknown) {
    errorMessage = `Failed to import contexts: ${err}`;
  } finally {
    loading = false;
  }
}

function goToKubernetesContextsPage(): void {
  router.goto('/preferences/kubernetes-contexts');
}

function goToUpPage(): void {
  router.goto('/preferences/kubernetes-contexts/import-file');
}
</script>

<FormPage 
  title="Review contexts to import"
  breadcrumbLeftPart="Kubernetes"
  breadcrumbRightPart="Import config"
  onclose={goToUpPage}
  onbreadcrumbClick={goToUpPage}>

  {#snippet icon()}
    <Icon icon={faUserCheck} />
  {/snippet}

  {#snippet content()}
    <div class="flex m-5 flex-col w-full">
      <!-- Error banner -->
      <div aria-label="importError">
        {#if errorMessage !== ''}
          <ErrorMessage class="py-2" error={errorMessage} />
        {/if}
      </div>

      <!-- Main content card -->
      <div class="bg-[var(--pd-content-card-bg)] rounded-lg text-[var(--pd-content-card-text)] px-8 pt-6 pb-6" role="table" aria-label="Review contexts">
        <!-- Context list -->
        <div class="pr-2">
      {#each loadedContexts as context, index (context.originalName)}
        <div
          role="row"
          aria-label={context.originalName}
          class="bg-[var(--pd-invert-content-card-bg)] rounded-md p-3 flex-nowrap"
          class:mb-5={index < loadedContexts.length - 1}>
          <div class="pb-2">
            <div class="flex">
              <!-- Checkbox for selection - moved to left -->
              <div class="flex items-center pr-3">
                <Checkbox 
                  bind:checked={context.selected}
                  title="Select context {context.originalName}" />
              </div>
                
              {#if context?.icon}
                {#if typeof context.icon === 'string'}
                  <img
                    src={context.icon}
                    aria-label="Context Logo"
                    alt="{context.originalName} logo"
                    class="max-w-[40px] h-full" />
                {/if}
              {/if}
                
              <!-- Centered items div -->
              <div class="pl-3 grow flex flex-col justify-center">
                <div class="flex flex-col items-left">
                  <span class="font-semibold text-[var(--pd-invert-content-card-header-text)]" aria-label="Context Name">
                    {context.originalName}
                  </span>
                </div>
              </div>

              {#if context.certificateChanged}
                <div class="text-[var(--pd-label-tertiary-text)] bg-[var(--pd-label-tertiary-bg)] text-xs px-2 py-1 rounded-md">
                  Certificate updated
                </div>
              {/if}
            </div>
            {#if context.error}
              <ErrorMessage class="text-sm" aria-label="Context Error" error={context.error} />
            {/if}
          </div>

          <!-- Conflict resolution options - positioned below context name but above details -->
          {#if context.hasConflict && context.selected}
            <div class="flex items-center mb-3 space-x-3">
              <WarningMessage class="text-sm" error="A context with this name already exists" />
              <label for="keepBoth-{index}" class="ml-1 flex items-center cursor-pointer" aria-label="keep-both-radio">
                <input
                  bind:group={context.conflictResolution}
                  type="radio"
                  id="keepBoth-{index}"
                  name="conflictResolution-{index}"
                  value={KEEP_BOTH}
                  onchange={(): void => updateConflictResolution(index, KEEP_BOTH)}
                  class="sr-only peer"
                  aria-label="keep-both-conflict-resolution-select" />
                <div
                  class="w-4 h-4 rounded-full border-2 border-[var(--pd-input-checkbox-unchecked)] mr-2 peer-checked:border-[var(--pd-input-checkbox-checked)] peer-checked:bg-[var(--pd-input-checkbox-checked)]">
                </div>
                <span>Keep existing</span>
                <span class="ml-2 text-sm">
                  (will import as: <span class="font-mono bg-[var(--pd-invert-content-bg)] px-1 py-0.5 rounded text-xs">
                    {generatePreviewName(context.originalName)}
                  </span>)
                </span>
              </label>
              <label for="replace-{index}" class="ml-1 flex items-center cursor-pointer" aria-label="replace-radio">
                <input
                  bind:group={context.conflictResolution}
                  type="radio"
                  id="replace-{index}"
                  name="conflictResolution-{index}"
                  value={REPLACE}
                  onchange={(): void => updateConflictResolution(index, 'replace')}
                  class="sr-only peer"
                  aria-label="replace-conflict-resolution-select" />
                <div
                  class="w-4 h-4 rounded-full border-2 border-[var(--pd-input-checkbox-unchecked)] mr-2 peer-checked:border-[var(--pd-input-checkbox-checked)] peer-checked:bg-[var(--pd-input-checkbox-checked)]">
                </div>
                <span>Replace</span>
              </label>
            </div>
          {/if}

          <div class="grow flex-column divide-gray-900"
          class:text-[var(--pd-invert-content-card-text)]={context.selected}
          class:text-[var(--pd-input-checkbox-disabled)]={!context.selected}>
            <div class="flex flex-row">
              <div class="grow text-sm">
                <div class="bg-[var(--pd-invert-content-bg)] p-2 rounded-lg mt-1 grid grid-cols-6">
                    <span class="my-auto font-bold col-span-1 text-right overflow-hidden text-ellipsis">CLUSTER</span>
                    <span
                    class="my-auto col-span-5 text-left ml-3 overflow-hidden text-ellipsis"
                    aria-label="Context Cluster">{context.cluster}</span>
                </div>

                {#if context.clusterInfo !== undefined}
                  <div class="bg-[var(--pd-invert-content-bg)] p-2 rounded-lg mt-1 grid grid-cols-6">
                    <span class="my-auto font-bold col-span-1 text-right overflow-hidden text-ellipsis">SERVER</span>
                    <span
                        class="my-auto col-span-5 text-left ml-3 overflow-hidden text-ellipsis"
                        aria-label="Context Server"
                        >{context.clusterInfo.server}
                    </span>
                  </div>
                {/if}

                <div class="bg-[var(--pd-invert-content-bg)] p-2 rounded-lg mt-1 grid grid-cols-6">
                  <span class="my-auto font-bold col-span-1 text-right overflow-hidden text-ellipsis">USER</span>
                  <span class="my-auto col-span-5 text-left ml-3 overflow-hidden text-ellipsis" aria-label="Context User"
                  >{context.user}</span>
                </div>

                {#if context.namespace}
                  <div class="bg-[var(--pd-invert-content-bg)] p-2 rounded-lg mt-1 grid grid-cols-6">
                  <span class="my-auto font-bold col-span-1 text-right overflow-hidden text-ellipsis">NAMESPACE</span>
                  <span
                      class="my-auto col-span-5 text-left ml-3 overflow-hidden text-ellipsis"
                      aria-label="Context Namespace">{context.namespace}</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
        {/each}
        </div>
      </div>

      <!-- Buttons below the card -->
      <div class="py-4 flex justify-end space-x-4">
        <Button
          type='secondary'
          on:click={goToUpPage}>
          Cancel
        </Button>
        <Button
          type='primary'
          icon={faFileImport}
          on:click={importSelectedContexts}
          inProgress={loading}
          disabled={loadedContexts.filter(c => c.selected).length === 0}>
          Import {loadedContexts.filter(c => c.selected).length} contexts
        </Button>
      </div>
    </div>
  {/snippet}
</FormPage>