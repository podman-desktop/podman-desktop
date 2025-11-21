<script lang="ts">
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { Button, ErrorMessage, FormPage, Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

interface KubeConfigImportInfo {
  path: string;
  name: string;
  parsedContexts?: KubeContext[];
}

// Import the KubeContext type from the API
import type { KubeContext } from '/@api/kubernetes-context';

let kubeConfig: KubeConfigImportInfo | undefined = undefined;
let errorMessage: string = '';
let dragging: boolean = false;
let loading: boolean = false;

async function submit(): Promise<void> {
  if (!kubeConfig) return;

  loading = true;
  try {
    // Pass the file path as a route parameter
    const encodedPath = encodeURIComponent(kubeConfig.path);
    router.goto(`/preferences/kubernetes-contexts/review-contexts/${encodedPath}`);
  } catch (err: unknown) {
    errorMessage = `Failed to process config file: ${err}`;
  } finally {
    loading = false;
  }
}

async function requestExplorerModal(): Promise<void> {
  dragging = false;
  errorMessage = '';
  try {
    const files = await window.openDialog({
      title: 'Select Kubernetes config file to import',
      selectors: ['openFile'],
      filters: [
        {
          name: 'Kubernetes config files',
          extensions: ['yaml', 'yml', 'config'],
        },
        {
          name: 'All files',
          extensions: ['*'],
        },
      ],
    });
    if (!files || files.length !== 1) {
      return;
    }

    const filePath = files[0];
    const lastSlashIndex = filePath.replace(/\\/g, '/').lastIndexOf('/') + 1;

    kubeConfig = {
      path: filePath,
      name: filePath.substring(lastSlashIndex),
    };
  } catch (e) {
    kubeConfig = undefined;
    errorMessage = `Error while selecting config file: ${String(e)}`;
  }
}

/**
 * This would only work in Electron as the `path` property is
 * not available is browser.
 */
function getFilesFromDropEvent(event: DragEvent): KubeConfigImportInfo[] {
  if (!event.dataTransfer) return [];
  const output: KubeConfigImportInfo[] = [];

  let files: File[];
  if (event.dataTransfer.files.length) {
    files = Array.from(event.dataTransfer.files);
  } else {
    files = Array.from(event.dataTransfer.items)
      .map(item => item.getAsFile())
      .filter((item): item is File => !!item);
  }
  for (const file of files) {
    if (file && 'path' in file && typeof file.path === 'string') {
      output.push({ path: file.path, name: file.name });
    }
  }
  return output;
}

/**
 * User can drag&drop a file, this
 * function is the drag event handler
 * @param event
 */
async function onFile(event: DragEvent): Promise<void> {
  dragging = false;
  const files = getFilesFromDropEvent(event);
  if (files.length !== 1) {
    errorMessage = 'Please drop exactly one config file';
    return;
  }

  const file = files[0];
  // Basic validation for config files
  const validExtensions = ['.yaml', '.yml', '.config'];
  const hasValidExtension = validExtensions.some(
    ext => file.name.toLowerCase().endsWith(ext) || file.name === 'config',
  );

  if (!hasValidExtension) {
    errorMessage = 'Please drop a valid Kubernetes config file (.yaml, .yml, or config)';
    return;
  }

  kubeConfig = {
    path: file.path,
    name: file.name,
  };
  errorMessage = '';
}

function handleDragOver(): void {
  dragging = true;
}

function handleDragLeave(): void {
  dragging = false;
}

function goToUpPage(): void {
  router.goto(`/preferences/kubernetes-contexts`);
}
</script>

<FormPage 
  title="Import config file"
  breadcrumbLeftPart="Kubernetes"
  breadcrumbRightPart="Import config"
  onclose={goToUpPage}
  onbreadcrumbClick={goToUpPage}>

  {#snippet icon()}
    <Icon icon={faFileImport} />
  {/snippet}

  {#snippet content()}
    <div class="flex m-5 flex-col w-full">
      <!-- Error banner -->
      <div aria-label="importError">
          {#if errorMessage !== ''}
              <ErrorMessage class="py-2" error={errorMessage} />
          {/if}
      </div>

      <!-- form -->
      <div class="bg-[var(--pd-content-card-bg)] space-y-6 px-8 sm:py-6 xl:py-8 rounded-lg h-fit text-[var(--pd-content-card-text)]">
        <div class="w-full">
          <!-- config file input -->
          {#if kubeConfig === undefined}
          <button
            aria-label="config file input"
            title="Click to open file explorer"
            class:border-purple-400={dragging}
            class:border-gray-800={!dragging}
            on:click={requestExplorerModal}
            on:drop|preventDefault={onFile}
            on:dragover|preventDefault={handleDragOver}
            on:dragleave|preventDefault={handleDragLeave}
            class="w-full cursor-pointer flex-col px-4 py-8 border-2 border-dashed rounded-xs flex justify-center items-center">
            <Icon size="1.1x" class="cursor-pointer text-[var(--pd-link)]" icon={faFileImport} />
            <span>Drag & Drop or <strong class="text-[var(--pd-link)]">Choose file</strong> to import</span>
            <span class="opacity-50 text-sm">Supported formats: .yaml, .yml, config files</span>
          </button>
          {:else}
            <!-- showing path -->
            <label for="path" class="w-full block mb-2 font-bold text-[var(--pd-content-card-header-text)]">Config File Path</label>
            <Input class="grow" bind:value={kubeConfig.path} name="path" aria-label="config file path" readonly={true} />

            <!-- Config file name -->
            <label for="name" class="pt-4 w-full block mb-2 font-bold text-[var(--pd-content-card-header-text)]"
                >Display Name</label>
            <Input
                bind:value={kubeConfig.name}
                name="name"
                aria-label="config file display name"
                placeholder="Config file display name"
                class="grow" />
          {/if}
        </div>

        <!-- action buttons -->
        <div class="mt-4 flex">
          <Button
            class="grow"
            on:click={submit}
            inProgress={loading}
            icon={faFileImport}
            disabled={kubeConfig === undefined}
            aria-label="Import config">
            Import Config
          </Button>
        </div>
      </div>
    </div>
  {/snippet}
</FormPage>