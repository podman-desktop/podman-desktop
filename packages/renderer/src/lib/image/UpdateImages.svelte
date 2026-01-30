<script lang="ts" module>
import type { ImageUpdateStatus } from '/@api/image-registry';

import type { ImageInfoUI } from './ImageInfoUI';

export interface UpdateImageInfoUI {
  image: ImageInfoUI;
  status?: ImageUpdateStatus;
  updating: boolean;
  updated: boolean;
  error?: string;
  selected: boolean;
}
</script>

<script lang="ts">
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen, ErrorMessage, Table, TableColumn, TableRow } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import ImageIcon from '/@/lib/images/ImageIcon.svelte';
import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import { imagesInfos } from '/@/stores/images';
import { providerInfos } from '/@/stores/providers';
import { updateImagesInfo } from '/@/stores/update-images-store';
import type { ImageInfo } from '/@api/image-info';
import type { ProviderContainerConnectionInfo } from '/@api/provider-info';

import UpdateImageColumnEnvironment from './UpdateImageColumnEnvironment.svelte';
import UpdateImageColumnName from './UpdateImageColumnName.svelte';
import UpdateImageColumnResult from './UpdateImageColumnResult.svelte';
import UpdateImageColumnSize from './UpdateImageColumnSize.svelte';
import UpdateImageColumnStatus from './UpdateImageColumnStatus.svelte';

let imagesToUpdate: UpdateImageInfoUI[] = $state([]);
let checkError = $state('');
let updateError = $state('');

let updateInProgress = $state(false);
let hasChecked = $state(false);

// Track selected items count
let selectedItemsNumber: number | undefined = $state();

// Get all started provider connections
let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(connection => connection.status === 'started'),
);

// Get all images from the store to lookup RepoDigests
let allImages = $derived($imagesInfos);

// Count of images that can be updated (selected and have updates available)
let updatableCount = $derived(
  imagesToUpdate.filter(info => info.selected && info.status?.updateAvailable && !info.updated).length,
);

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
    selected: false, // Start unselected, will be selected when update is found
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
function getImageInfo(imageUI: { id: string }): ImageInfo | undefined {
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
    // Check all images in parallel to avoid sequential iteration issues
    await Promise.all(
      imagesToUpdate.map(async info => {
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
        // Trigger reactivity after each image check completes
        imagesToUpdate = imagesToUpdate;
      }),
    );
    hasChecked = true;
  } catch (err: unknown) {
    checkError = err instanceof Error ? err.message : String(err);
  }
}

async function updateImages(): Promise<void> {
  updateError = '';
  updateInProgress = true;

  try {
    // Get images that need updating
    const imagesToPull = imagesToUpdate.filter(
      info => info.selected && info.status?.updateAvailable && !info.updated,
    );

    // Mark all as updating and trigger reactivity
    for (const info of imagesToPull) {
      info.updating = true;
      info.error = undefined;
    }
    imagesToUpdate = imagesToUpdate;

    // Pull all images in parallel
    await Promise.all(
      imagesToPull.map(async info => {
        const providerConnection = getProviderConnection(info.image.engineId);
        if (!providerConnection) {
          const availableConnections = providerConnections.map(c => c.name).join(', ');
          console.error(
            `No provider connection found for engineId "${info.image.engineId}". Available: ${availableConnections}`,
          );
          info.error = `No provider connection found for engineId "${info.image.engineId}". Available connections: ${availableConnections}`;
          info.updating = false;
          imagesToUpdate = imagesToUpdate;
          return;
        }

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
          // Trigger reactivity after each image completes
          imagesToUpdate = imagesToUpdate;
        }
      }),
    );
  } catch (err: unknown) {
    updateError = err instanceof Error ? err.message : String(err);
  } finally {
    updateInProgress = false;
  }
}

// Table column definitions
let nameColumn = new TableColumn<UpdateImageInfoUI>('Name', {
  width: '2fr',
  renderer: UpdateImageColumnName,
  comparator: (a, b): number => a.image.name.localeCompare(b.image.name),
});

let envColumn = new TableColumn<UpdateImageInfoUI>('Environment', {
  width: '1fr',
  renderer: UpdateImageColumnEnvironment,
  comparator: (a, b): number => a.image.engineId.localeCompare(b.image.engineId),
});

let sizeColumn = new TableColumn<UpdateImageInfoUI>('Size', {
  width: '1fr', 
  renderer: UpdateImageColumnSize,
  comparator: (a, b): number => b.image.size - a.image.size,
});

let updateStatusColumn = new TableColumn<UpdateImageInfoUI>('Update Available', {
  width: '2fr',
  renderer: UpdateImageColumnStatus,
  comparator: (a, b): number => {
    // Sort by update availability (available first)
    const aAvailable = a.status?.updateAvailable ? 1 : 0;
    const bAvailable = b.status?.updateAvailable ? 1 : 0;
    return bAvailable - aAvailable;
  },
});

let resultColumn = new TableColumn<UpdateImageInfoUI>('Result', {
  width: '2fr',
  renderer: UpdateImageColumnResult,
  comparator: (a, b): number => {
    // Sort by result status (updated first, then updating, then failed, then pending)
    const getOrder = (info: UpdateImageInfoUI): number => {
      if (info.updated) return 0;
      if (info.updating) return 1;
      if (info.error) return 2;
      return 3;
    };
    return getOrder(a) - getOrder(b);
  },
});

const columns = [nameColumn, envColumn, sizeColumn, updateStatusColumn, resultColumn];

const row = new TableRow<UpdateImageInfoUI>({
  // Only allow selection for images that have been checked and have updates available
  selectable: (info): boolean => {
    // Disabled while checking (status undefined) or if no update available
    if (!info.status) return false;
    return info.status.updateAvailable === true && !info.updated;
  },
  disabledText: 'Image has no update available or is already updated',
});

/**
 * Utility function for the Table to get the key to use for each item
 */
function key(item: UpdateImageInfoUI): string {
  return `${item.image.engineId}:${item.image.id}:${item.image.tag}`;
}

/**
 * Utility function for the Table to get the label to use for each item
 */
function label(item: UpdateImageInfoUI): string {
  return `${item.image.name}:${item.image.tag}`;
}
</script>

<EngineFormPage title="Update Images">
  {#snippet icon()}
    <i class="fas fa-sync fa-2x" aria-hidden="true"></i>
  {/snippet}
  {#snippet content()}
    <div class="flex flex-col gap-4 h-full">
      <!-- Images Table -->
      <div class="flex min-w-full flex-1">
        {#if imagesToUpdate.length === 0}
          <EmptyScreen
            icon={ImageIcon}
            title="No images selected"
            message="Select images from the Images list to check for updates." />
        {:else}
          <Table
            kind="update-image"
            bind:selectedItemsNumber={selectedItemsNumber}
            data={imagesToUpdate}
            columns={columns}
            row={row}
            defaultSortColumn="Update Available"
            key={key}
            label={label}
            on:update={(): UpdateImageInfoUI[] => (imagesToUpdate = imagesToUpdate)}>
          </Table>
        {/if}
        <!-- For some reason, without defaultSortColumn="" the checkbox reactivity is not working -->
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
