<script lang="ts">
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';
import ImageIcon from '/@/lib/images/ImageIcon.svelte';
import { providerInfos } from '/@/stores/providers';

let selectedProviderConnection = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .find(providerContainerConnection => providerContainerConnection.status === 'started'),
);

const firstImageName = 'quay.io/podman/hello';
const commandLine = `podman pull ${firstImageName}`;
let pullInProgress = $state(false);

async function pullFirstImage(): Promise<void> {
  if (!selectedProviderConnection) {
    await window.showMessageBox({
      title: t('resources.pull-image-failed') ?? 'Pull Image Failed',
      message: t('resources.no-provider-connections-found') ?? 'No provider connections found',
      type: 'error',
      buttons: [t('resources.dismiss') ?? 'Dismiss'],
    });
    return;
  }

  pullInProgress = true;
  try {
    await window.pullImage(selectedProviderConnection, firstImageName, () => {});
  } catch (error: unknown) {
    const errorMessage = error && typeof error === 'object' && 'message' in error ? error.message : error;
    await window.showMessageBox({
      title: t('resources.pull-image-failed') ?? 'Pull Image Failed',
      message:
        t('resources.pull-image-error', { name: selectedProviderConnection.name, error: String(errorMessage) }) ??
        `Error while pulling image from ${selectedProviderConnection.name}: ${errorMessage}`,
      type: 'error',
      buttons: [t('resources.dismiss') ?? 'Dismiss'],
    });
  }
  pullInProgress = false;
}
</script>

<EmptyScreen
  icon={ImageIcon}
  title={t('resources.no-images') ?? 'No images'}
  message={t('resources.pull-a-first-image-using-the-following-command-line') ?? 'Pull a first image using the following command line:'}
  commandline={commandLine}
  onclick={(): Promise<void> => window.clipboardWriteText(commandLine)}>
  {#snippet upperContent()}
    <span class="text-[var(--pd-details-empty-sub-header)] max-w-[800px] text-pretty mx-2"
      >{t('resources.pull-a-first-image-by-clicking-on-this-button') ?? 'Pull a first image by clicking on this button:'}</span>
    <div class="flex gap-2 justify-center p-3">
      <Button
        title={t('resources.pull-firstimagename-image', { firstImageName: firstImageName }) ?? `Pull ${firstImageName} image`}
        type="primary"
        inProgress={pullInProgress}
        on:click={pullFirstImage}>{t('resources.pull-your-first-image') ?? 'Pull your first image'}</Button>
    </div>
    <h1 class="text-xl text-[var(--pd-details-empty-header)]">{t('resources.or') ?? 'OR'}</h1>
  {/snippet}
</EmptyScreen>
