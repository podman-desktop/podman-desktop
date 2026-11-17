<script lang="ts">
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';
import PodIcon from '/@/lib/images/PodIcon.svelte';
import { providerInfos } from '/@/stores/providers';

const myFirstPod = 'my-first-pod';
const helloImage = 'quay.io/podman/hello:latest';
const commandLine = `podman run -dt --pod new:${myFirstPod} ${helloImage}`;

let inProgress = $state(false);

let selectedProviderConnection = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .find(providerContainerConnection => providerContainerConnection.status === 'started'),
);

async function startPod(): Promise<void> {
  inProgress = true;
  if (selectedProviderConnection) {
    try {
      await window.pullImage(selectedProviderConnection, helloImage, () => {});
      const listImages = await window.listImages();
      const image = listImages.find(item => item.RepoTags?.includes(helloImage));
      await window.createPod({ name: myFirstPod });
      if (image) {
        await window.createAndStartContainer(image.engineId, { Image: helloImage, pod: myFirstPod });
      } else {
        await window.showMessageBox({
          title: t('resources.run-pod-failed') ?? 'Run Pod Failed',
          message:
            t('resources.could-not-find-image', { name: helloImage }) ?? `Could not find '${helloImage}' in images`,
          type: 'error',
          buttons: [t('resources.dismiss') ?? 'Dismiss'],
        });
      }
    } catch (error) {
      await window.showMessageBox({
        title: t('resources.run-pod-failed') ?? 'Run Pod Failed',
        message: String(error),
        type: 'error',
        buttons: [t('resources.dismiss') ?? 'Dismiss'],
      });
    } finally {
      inProgress = false;
    }
  } else {
    await window.showMessageBox({
      title: t('resources.run-pod-failed') ?? 'Run Pod Failed',
      message: t('resources.no-provider-connections-found') ?? 'No provider connections found',
      type: 'error',
      buttons: [t('resources.dismiss') ?? 'Dismiss'],
    });
  }
}
</script>

<EmptyScreen
  icon={PodIcon}
  title={t('resources.no-pods') ?? 'No pods'}
  message={t('resources.run-a-first-pod-using-the-following-command-line') ?? 'Run a first pod using the following command line:'}
  commandline={commandLine}
  onclick={(): Promise<void> => window.clipboardWriteText(commandLine)}>
  {#snippet upperContent()}
    <div class="flex gap-2 justify-center p-3">
      <Button title={t('resources.start-your-first-pod') ?? 'Start your first pod'} type="primary" inProgress={inProgress} on:click={startPod}
        >{t('resources.start-your-first-pod') ?? 'Start your first pod'}</Button>
    </div>
    <h1 class="text-xl text-[var(--pd-details-empty-header)]">{t('resources.or') ?? 'OR'}</h1>
  {/snippet}
</EmptyScreen>
