<script lang="ts">
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Button, Input } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { router } from 'tinro';

import Dialog from '/@/lib/dialogs/Dialog.svelte';
import { extensionInfos } from '/@/stores/extensions';

import { markNewlyInstalled } from './extension-catalog-settings.svelte';
import { normalizeCustomExtensionKey, rememberCustomInstalledExtension } from './extension-custom-local';
import { buildExtensionsListPath } from './extension-list';
import { syncExtensionNavigationAfterInstall } from './extension-nav-pointer.svelte';
import { prototypeRestoreExtension } from './extension-prototype-use-cases';
import { areExtensionsImprovementsSuggested } from './extensions-prototype-scope';

interface Props {
  closeCallback: () => void;
  /** Optional prefilled OCI image (e.g. example for the custom/local tab). */
  defaultImageName?: string;
}

let { closeCallback, defaultImageName = '' }: Props = $props();
let imageName = $state(defaultImageName);
const suggestionScope = $derived(areExtensionsImprovementsSuggested());

let installInProgress = $state(false);
let inputfieldError: string | undefined = $state(defaultImageName.trim() ? undefined : '');
let progressPercent = $state(0);
let logs: string[] = [];

const inputAriaLabel = 'Image name to install custom extension';

onMount(async () => {
  if (defaultImageName.trim()) {
    imageName = defaultImageName.trim();
    inputfieldError = undefined;
  }
  // search input field and make focus by aria-label Image name to install custom extension
  const imageNameInputField = document.querySelector(`[aria-label="${inputAriaLabel}"]`);
  if (imageNameInputField && imageNameInputField instanceof HTMLInputElement) {
    imageNameInputField.focus();
  }
});

function validateImageName(event: Event): void {
  if (event.target instanceof HTMLInputElement) {
    let name = event.target.value;
    if (!name) {
      inputfieldError = 'Missing name';
      return;
    } else {
      inputfieldError = undefined;
      return;
    }
  }
  inputfieldError = 'Invalid input';
}

function extractExtensionIdFromOciImage(ociImage: string): string {
  const parts = ociImage.split('/');
  const lastPart = parts[parts.length - 1];
  const [name] = lastPart.split(':');
  return name || ociImage;
}

function resolveInstalledExtensionId(installedBefore: Set<string>): string | undefined {
  return get(extensionInfos).find(extension => !installedBefore.has(extension.id))?.id;
}

function resolveExistingExtensionId(ociImage: string): string | undefined {
  const ociToken = extractExtensionIdFromOciImage(ociImage);
  const key = normalizeCustomExtensionKey(ociToken);
  return get(extensionInfos).find(extension => {
    const idKey = normalizeCustomExtensionKey(extension.id);
    const nameKey = normalizeCustomExtensionKey(extension.name);
    return idKey === key || nameKey === key || idKey.includes(key) || key.includes(nameKey);
  })?.id;
}

async function finishCustomInstall(extensionId: string, ociImage: string): Promise<void> {
  const ociToken = extractExtensionIdFromOciImage(ociImage);
  rememberCustomInstalledExtension(extensionId, ociToken, ociImage);
  // Suggestion scope hides non-built-ins until restored for this session.
  prototypeRestoreExtension(extensionId);
  await syncExtensionNavigationAfterInstall(extensionId);
  markNewlyInstalled(extensionId);
  router.goto(buildExtensionsListPath('development'));
  closeCallback();
}

async function completeSuccessfulInstall(ociImage: string, installedBefore: Set<string>): Promise<void> {
  const ociToken = extractExtensionIdFromOciImage(ociImage);
  const extensionId = resolveInstalledExtensionId(installedBefore) ?? resolveExistingExtensionId(ociImage) ?? ociToken;

  if (suggestionScope) {
    await finishCustomInstall(extensionId, ociImage);
    return;
  }

  await syncExtensionNavigationAfterInstall(extensionId);
  markNewlyInstalled(extensionId);
  router.goto(buildExtensionsListPath('installed'));
  closeCallback();
}

async function completeAlreadyInstalled(ociImage: string): Promise<void> {
  const extensionId = resolveExistingExtensionId(ociImage) ?? extractExtensionIdFromOciImage(ociImage);
  inputfieldError = undefined;
  progressPercent = 100;
  await finishCustomInstall(extensionId, ociImage);
}

async function installExtension(): Promise<void> {
  inputfieldError = undefined;
  logs = [];
  progressPercent = 0;

  installInProgress = true;

  const ociImage = imageName?.trim();
  const installedBefore = new Set(get(extensionInfos).map(extension => extension.id));

  try {
    const percentageMatchRegexp = RegExp(/(\d+)%/);
    await window.extensionInstallFromImage(
      ociImage,
      (data: string) => {
        logs = [...logs, data];
        console.debug(`Installing ${ociImage}:`, data);

        const percentageMatch = percentageMatchRegexp.exec(data);
        if (percentageMatch) {
          progressPercent = parseInt(percentageMatch[1]);
        }
      },
      (error: string) => {
        console.error(`got an error when installing ${ociImage}`, error);
        installInProgress = false;
        inputfieldError = error;
      },
    );

    if (inputfieldError) {
      // Suggestion: "already installed" usually means the extension is only hidden in the
      // prototype UI — restore it onto the custom/local tab instead of blocking the user.
      if (suggestionScope && /already installed/i.test(inputfieldError)) {
        await completeAlreadyInstalled(ociImage);
      }
      return;
    }

    progressPercent = 100;
    await completeSuccessfulInstall(ociImage, installedBefore);
  } catch (error) {
    const message = String(error);
    if (suggestionScope && /already installed/i.test(message)) {
      await completeAlreadyInstalled(ociImage);
    } else {
      console.error('error', error);
    }
  } finally {
    installInProgress = false;
  }
}

async function handleKeydown(e: KeyboardEvent): Promise<void> {
  if (e.key === 'Enter' && !installInProgress) {
    e.preventDefault();
    await installExtension();
  }
}
</script>

<svelte:window onkeydown={handleKeydown} />

<Dialog
  title="Install Custom Extension"
  onclose={closeCallback}>
  {#snippet content()}
    <div  class="flex flex-col leading-5 space-y-5">
      <div>
        <label for="imageName" class="block pb-2 text-[var(--pd-modal-text)]">OCI Image:</label>
        <div class="min-h-14">
          <Input
            bind:value={imageName}
            name="imageName"
            id="imageName"
            placeholder="Enter OCI image name of the extension (e.g. quay.io/namespace/my-image)"
            on:input={validateImageName}
            disabled={installInProgress}
            error={inputfieldError}
            aria-invalid={inputfieldError !== ''}
            aria-label={inputAriaLabel}
            required />
        </div>
        <div class="w-full min-h-9 h-9 py-2">
          {#if installInProgress}
            <div class="flex grow">
              <div class="w-full h-4 mb-4 rounded-md bg-[var(--pd-progressBar-bg)] progress-bar overflow-hidden">
                <div
                  class="h-4 bg-[var(--pd-progressBar-in-progress-bg)] rounded-md"
                  role="progressbar"
                  aria-label="Installation progress"
                  style="width: {progressPercent}%">
                </div>
              </div>
              <div class="ml-2 w-3 text-sm text-[var(--pd-progressBar-text)]">{progressPercent}%</div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/snippet}
  {#snippet buttons()}
  
      <Button
        type="link"
        on:click={closeCallback}>Cancel</Button>
      <Button
        type="primary"
        icon={faDownload}
        disabled={inputfieldError !== undefined}
        on:click={installExtension}
        inProgress={installInProgress}>Install</Button>

  {/snippet}
</Dialog>
