<script lang="ts">
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';
import { ContainerIcon } from '@podman-desktop/ui-svelte/icons';

import { t } from '/@/lib/i18n/translations.svelte';
import { providerInfos } from '/@/stores/providers';

interface Props {
  runningOnly: boolean;
  stoppedOnly: boolean;
}

let { runningOnly, stoppedOnly }: Props = $props();

const helloImage: string = 'quay.io/podman/hello:latest';

let inProgress = $state(false);

let title = $derived(getTitle(runningOnly, stoppedOnly));
let messageCommandLine = $derived(getMessageCommandLine(stoppedOnly));
let messageButton = $derived(getMessageButton(stoppedOnly));
let commandLine = $derived(getCommandLine(stoppedOnly));
let selectedProviderConnection = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .find(providerContainerConnection => providerContainerConnection.status === 'started'),
);

function getTitle(runningOnly: boolean, stoppedOnly: boolean): string {
  // eslint-disable-next-line sonarjs/no-selector-parameter
  if (runningOnly) {
    return t('resources.no-running-containers') ?? 'No running containers';
  } else if (stoppedOnly) {
    return t('resources.no-stopped-containers') ?? 'No stopped containers';
  } else {
    return t('resources.no-containers') ?? 'No containers';
  }
}
function getMessageCommandLine(stoppedOnly: boolean): string {
  // eslint-disable-next-line sonarjs/no-selector-parameter
  if (stoppedOnly) {
    return '';
  } else {
    return (
      t('resources.run-a-first-container-using-the-following-command-line') ??
      'Run a first container using the following command line:'
    );
  }
}
function getMessageButton(stoppedOnly: boolean): string {
  // eslint-disable-next-line sonarjs/no-selector-parameter
  if (stoppedOnly) {
    return '';
  } else {
    return (
      t('resources.run-a-first-container-by-clicking-on-this-button') ??
      'Run a first container by clicking on this button:'
    );
  }
}
function getCommandLine(stoppedOnly: boolean): string {
  // eslint-disable-next-line sonarjs/no-selector-parameter
  if (stoppedOnly) {
    return '';
  } else {
    return 'podman run quay.io/podman/hello';
  }
}
async function runContainer(commandLine: string): Promise<void> {
  try {
    inProgress = true;
    if (selectedProviderConnection) {
      await window.pullImage(selectedProviderConnection, helloImage, () => {});
      const listImages = await window.listImages();
      const image = listImages.find(item => item.RepoTags?.includes(helloImage));
      if (image) {
        await window.createAndStartContainer(image.engineId, { Image: helloImage });
      } else {
        await window.showMessageBox({
          title: t('resources.run-container-failed') ?? 'Run Container Failed',
          message:
            t('resources.could-not-find-image', { name: helloImage }) ?? `Could not find ${helloImage} in images`,
          buttons: [t('resources.dismiss') ?? 'Dismiss'],
        });
      }
      await window.telemetryTrack('startFirstContainerByButton');
    }
  } catch (err) {
    await window.showMessageBox({
      title: t('resources.run-container-failed') ?? 'Run Container Failed',
      message:
        t('resources.command-error', {
          command: commandLine,
          error: err instanceof Error ? err.message : String(err),
        }) ?? `Error while executing ${commandLine}: ${err instanceof Error ? err.message : String(err)}`,
      buttons: [t('resources.dismiss') ?? 'Dismiss'],
    });
  }
  inProgress = false;
}
</script>

<EmptyScreen
  icon={ContainerIcon}
  title={title}
  message={messageCommandLine}
  commandline={commandLine}
  onclick={(): Promise<void> => window.clipboardWriteText(commandLine)}>
  {#snippet upperContent()}
  <div hidden={stoppedOnly}>
    <span class="text-[var(--pd-details-empty-sub-header)] max-w-[800px] text-pretty mx-2">{messageButton}</span>
    <div class="flex gap-2 justify-center p-3">
      <Button
        title={t('resources.pull-helloimage-image-and-start-container', { helloImage: helloImage }) ?? `Pull ${helloImage} image and start container`}
        type="primary"
        inProgress={inProgress}
        on:click={(): Promise<void> => runContainer(commandLine)}>{t('resources.start-your-first-container') ?? 'Start your first container'}</Button>
    </div>
    <h1 class="text-xl text-[var(--pd-details-empty-header)]">{t('resources.or') ?? 'OR'}</h1>
  </div>
  {/snippet}
</EmptyScreen>
