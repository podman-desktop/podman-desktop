<script lang="ts">
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { Button, ErrorMessage, Spinner } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import Label from '/@/lib/ui/Label.svelte';
import { imagesInfos } from '/@/stores/images';
import { providerInfos } from '/@/stores/providers';
import { updateImagesInfo } from '/@/stores/update-images-store';
import type { ImageInfo } from '/@api/image-info';
import type { ImageUpdateStatus } from '/@api/image-registry';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

import type { ImageInfoUI } from './ImageInfoUI';

interface ImageUpdateInfo {
  image: ImageInfoUI;
  status?: ImageUpdateStatus;
  updating: boolean;
  updated: boolean;
  error?: string;
}

let imagesToUpdate: ImageUpdateInfo[] = $state([]);
let checkError = $state('');
let updateError = $state('');

let updateInProgress = $state(false);
let hasChecked = $state(false);

// Get all started provider connections
let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(connection => connection.status === 'started'),
);

// Get all images from the store to lookup RepoDigests
let allImages = $derived($imagesInfos);

// Count of images that can be updated
let updatableCount = $derived(imagesToUpdate.filter(info => info.status?.updateAvailable && !info.updated).length);

onMount(() => {
  const selectedImages = $updateImagesInfo;
  if (selectedImages.length === 0) {
    router.goto('/images/');
    return;
  }
  imagesToUpdate = selectedImages.map(image => ({
    image,
    updating: false,
    updated: false,
  }));

  // Clear the store to avoid stale data on subsequent navigations
  updateImagesInfo.set([]);

  // Automatically check for updates on page load
  checkForUpdates().catch((err: unknown) => {
    checkError = err instanceof Error ? err.message : String(err);
  });
});

function goBack(): void {
  router.goto('/images/');
}

// Find the ImageInfo from store to get RepoDigests
function getImageInfo(imageUI: ImageInfoUI): ImageInfo | undefined {
  return allImages.find(img => img.Id === imageUI.id);
}

// Find the provider connection for an image using engineId
// engineId format is "${providerId}.${connectionName}" (e.g., "podman.podman-machine-default")
function getProviderConnection(engineId: string): ProviderContainerConnectionInfo | undefined {
  // Split engineId to get provider id and connection name
  const dotIndex = engineId.indexOf('.');
  if (dotIndex === -1) {
    // Fallback: try to match by name directly
    return providerConnections.find(conn => conn.name === engineId);
  }

  const providerId = engineId.substring(0, dotIndex);
  const connectionName = engineId.substring(dotIndex + 1);

  // Find the provider by id and then the connection by name
  const provider = $providerInfos.find(p => p.id === providerId);
  if (provider) {
    return provider.containerConnections.find(conn => conn.name === connectionName && conn.status === 'started');
  }

  return undefined;
}

async function checkForUpdates(): Promise<void> {
  checkError = '';

  try {
    for (const info of imagesToUpdate) {
      const imageRef = `${info.image.name}:${info.image.tag}`;
      const imageInfo = getImageInfo(info.image);
      const localDigests = imageInfo?.RepoDigests ?? [];

      try {
        const status = await window.checkImageUpdateStatus(imageRef, info.image.tag, localDigests);
        info.status = status;
      } catch (err: unknown) {
        info.status = {
          status: 'error',
          updateAvailable: false,
          message: err instanceof Error ? err.message : String(err),
        };
      }
    }
    hasChecked = true;
  } catch (err: unknown) {
    checkError = err instanceof Error ? err.message : String(err);
  }
}

async function updateImages(): Promise<void> {
  updateError = '';
  updateInProgress = true;

  try {
    for (const info of imagesToUpdate) {
      // Skip if not updatable or already updated
      if (!info.status?.updateAvailable || info.updated) {
        continue;
      }

      const providerConnection = getProviderConnection(info.image.engineId);
      if (!providerConnection) {
        const availableConnections = providerConnections.map(c => c.name).join(', ');
        console.error(
          `No provider connection found for engineId "${info.image.engineId}". Available: ${availableConnections}`,
        );
        info.error = `No provider connection found for engineId "${info.image.engineId}". Available connections: ${availableConnections}`;
        continue;
      }

      info.updating = true;
      info.error = undefined;

      try {
        const imageRef = `${info.image.name}:${info.image.tag}`;
        console.log(`Updating image ${imageRef} from engine ${info.image.engineId}`);

        // Pull the new image - this automatically re-tags to the new image
        // The old image will become dangling if this was its only tag,
        // or keep its other tags if it had multiple (e.g., alpine:2.6)
        console.log(`Pulling image ${imageRef}...`);
        await window.pullImage(providerConnection, imageRef, () => {});
        console.log(`Pull complete for ${imageRef}`);

        info.updated = true;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Failed to update image ${info.image.name}:${info.image.tag}:`, err);
        info.error = errorMessage;
      } finally {
        info.updating = false;
      }
    }
  } catch (err: unknown) {
    updateError = err instanceof Error ? err.message : String(err);
  } finally {
    updateInProgress = false;
  }
}

interface LabelStatusStyle {
  dotColor: string;
  label: string;
}

function getUpdateAvailableStyle(imgstatus?: ImageUpdateStatus): LabelStatusStyle {
  if (!imgstatus) {
    return {
      dotColor: 'bg-[var(--pd-status-paused)]',
      label: 'Checking',
    };
  }
  if (imgstatus.status === 'error') {
    return {
      dotColor: 'bg-[var(--pd-status-terminated)]',
      label: 'Error',
    };
  }
  if (imgstatus.updateAvailable) {
    return {
      dotColor: 'bg-[var(--pd-status-connected)]',
      label: 'Available',
    };
  }
  // Check if the image cannot be checked (local, dangling, or immutable)
  if (imgstatus.status === 'skipped') {
    return {
      dotColor: 'bg-[var(--pd-status-stopped)]',
      label: 'N/A',
    };
  }
  return {
    dotColor: 'bg-[var(--pd-status-stopped)]',
    label: 'Up to date',
  };
}

function getResultStyle(info: ImageUpdateInfo): LabelStatusStyle | undefined {
  if (info.updating) {
    return {
      dotColor: 'bg-[var(--pd-status-starting)]',
      label: 'Updating',
    };
  }
  if (info.updated) {
    return {
      dotColor: 'bg-[var(--pd-status-connected)]',
      label: 'Updated',
    };
  }
  if (info.error) {
    return {
      dotColor: 'bg-[var(--pd-status-terminated)]',
      label: 'Failed',
    };
  }
  return undefined;
}
</script>

<EngineFormPage title="Update Images">
  {#snippet icon()}
    <i class="fas fa-sync fa-2x" aria-hidden="true"></i>
  {/snippet}
  {#snippet content()}
    <div class="flex flex-col gap-4">
      <!-- Images Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-[var(--pd-table-body-text)]" aria-label="images to update">
          <thead class="text-xs uppercase bg-[var(--pd-table-header-bg)] text-[var(--pd-table-header-text)]">
            <tr>
              <th class="px-4 py-3">Image</th>
              <th class="px-4 py-3">Update Available</th>
              <th class="px-4 py-3">Message</th>
              <th class="px-4 py-3">Result</th>
            </tr>
          </thead>
          <tbody>
            {#each imagesToUpdate as info (info.image.id + info.image.engineId + info.image.tag)}
              {@const isDigest = info.image.tag.startsWith('sha256:') || info.image.tag.startsWith('sha384:') || info.image.tag.startsWith('sha512:')}
              {@const displayTag = isDigest ? '' : `:${info.image.tag}`}
              {@const imageDisplay = `${info.image.name}${displayTag}`}
              {@const fullImageRef = `${info.image.name}:${info.image.tag}`}
              {@const updateStyle = getUpdateAvailableStyle(info.status)}
              {@const resultStyle = getResultStyle(info)}
              <tr class="border-b border-[var(--pd-table-body-text-secondary)] bg-[var(--pd-content-bg)]" aria-label="image {fullImageRef}">
                <td class="px-4 py-3 font-medium whitespace-nowrap" title={fullImageRef}>
                  {imageDisplay.length > 50 ? imageDisplay.slice(0, 47) + '...' : imageDisplay}
                </td>
                <td class="px-4 py-3" aria-label="update status {updateStyle.label}">
                  <Label role="status" name={updateStyle.label}>
                    <div class="w-2 h-2 shrink-0 {updateStyle.dotColor} rounded-full"></div>
                  </Label>
                </td>
                <td class="px-4 py-3 max-w-xs truncate text-[var(--pd-table-body-text-secondary)]" aria-label="message" title={info.status?.message ?? ''}>
                  {info.status?.message ?? '-'}
                </td>
                <td class="px-4 py-3 max-w-xs" aria-label="result {resultStyle?.label ?? 'pending'}">
                  {#if info.updating}
                    <Label role="status" name="Updating">
                      <Spinner size="12" />
                    </Label>
                  {:else if resultStyle}
                    <Label role="status" name={resultStyle.label}>
                      <div class="w-2 h-2 shrink-0 {resultStyle.dotColor} rounded-full"></div>
                    </Label>
                    {#if info.error}
                      <div class="text-xs text-[var(--pd-status-terminated)] truncate mt-1" aria-label="error" title={info.error}>
                        {info.error}
                      </div>
                    {/if}
                  {:else}
                    <span class="text-[var(--pd-table-body-text-secondary)]">-</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Action Buttons -->
      <div class="w-full flex flex-row space-x-4 pt-4">
        <Button
          type="secondary"
          class="w-full"
          on:click={goBack}
          aria-label="Done"
          disabled={updateInProgress}>
          Done
        </Button>
        <Button
          class="w-full"
          on:click={updateImages}
          inProgress={updateInProgress}
          icon={faSync}
          aria-label="Update images"
          disabled={!hasChecked || updatableCount === 0 || updateInProgress}>
          Update {updatableCount} Image{updatableCount !== 1 ? 's' : ''}
        </Button>
      </div>

      <!-- Error Messages -->
      <div aria-label="checkError">
        {#if checkError}
          <ErrorMessage error={checkError} />
        {/if}
      </div>
      <div aria-label="updateError">
        {#if updateError}
          <ErrorMessage error={updateError} />
        {/if}
      </div>
    </div>
  {/snippet}
</EngineFormPage>

