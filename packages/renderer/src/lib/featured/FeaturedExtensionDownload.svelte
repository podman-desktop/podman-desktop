<script lang="ts">
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import { markNewlyInstalled } from '/@/lib/extensions/extension-catalog-settings.svelte';
import ExtensionInstallSuccessDialog from '/@/lib/extensions/ExtensionInstallSuccessDialog.svelte';
import LoadingIcon from '/@/lib/ui/LoadingIcon.svelte';

export let extension: {
  id: string;
  fetchLink?: string;
  fetchVersion?: string;
  displayName: string;
  fetchable: boolean;
};
export let oninstall: (extensionId: string) => void = () => {};

let installInProgress = false;
let logs: string[] = [];
let errorInstall = '';
let percentage = '0%';
let showSuccessDialog = false;
let installedVersion = '';

async function installExtension(): Promise<void> {
  oninstall(extension.id);
  errorInstall = '';
  console.log('User asked to install the extension with the following properties', extension);
  logs = [];

  installInProgress = true;

  const ociImage = extension?.fetchLink?.trim();

  if (!ociImage) {
    console.log('No image to install');
    errorInstall = 'No image to install';
    installInProgress = false;
    return;
  }

  try {
    const percentageMatchRegexp = RegExp(/(\d+)%/);
    await window.extensionInstallFromImage(
      ociImage,
      (data: string) => {
        logs = [...logs, data];
        console.log('data', data);

        const percentageMatch = percentageMatchRegexp.exec(data);

        if (percentageMatch) {
          percentage = percentageMatch[1] + '%';
        }
      },
      (error: string) => {
        console.log(`got an error when installing ${extension.id}`, error);
        installInProgress = false;
        errorInstall = error;
      },
      extension.id,
    );
    logs = [...logs, '☑️ installation finished!'];
    percentage = '100%';
    installedVersion = extension.fetchVersion ?? 'unknown';
    markNewlyInstalled(extension.id);
    showSuccessDialog = true;
  } catch (error) {
    console.log('error', error);
    errorInstall = String(error);
  }
  installInProgress = false;
}

function closeSuccessDialog(): void {
  showSuccessDialog = false;
}
</script>

<ErrorMessage icon wrapMessage class="-top-[15px] right-0 absolute" error={errorInstall}/>
<button
  aria-label="Install {extension.id} Extension"
  on:click={installExtension}
  hidden={!extension.fetchable}
  title="Install {extension.displayName} v{extension.fetchVersion} Extension"
  class="border-2 relative rounded-sm border-[var(--pd-button-secondary-border)] text-[var(--pd-button-secondary-text)] hover:bg-[var(--pd-button-secondary-hover-bg)] w-10 p-2 text-center cursor-pointer flex flex-row justify-center">
  <LoadingIcon
    icon={faDownload}
    iconSize="1x"
    loading={installInProgress} />
  <span
    class:hidden={!installInProgress}
    class="absolute -top-[15px] right-0 text-[var(--pd-action-button-spinner)]"
    style="font-size: 8px">{percentage}</span>
</button>

{#if showSuccessDialog}
  <ExtensionInstallSuccessDialog
    extension={{
      id: extension.id,
      displayName: extension.displayName,
      isFeatured: false,
      fetchable: extension.fetchable,
      fetchLink: extension.fetchLink ?? '',
      fetchVersion: extension.fetchVersion ?? '',
      publisherDisplayName: '',
      isInstalled: true,
      shortDescription: '',
      categories: [],
      keywords: [],
      availableVersions: [],
      hasUpdate: false,
      isVerified: false,
      isSupportedByRedHat: false,
    }}
    installedVersion={installedVersion}
    closeCallback={closeSuccessDialog} />
{/if}
