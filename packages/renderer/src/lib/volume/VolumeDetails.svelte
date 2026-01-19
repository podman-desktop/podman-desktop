<script lang="ts">
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import VolumeIcon from '/@/lib/images/VolumeIcon.svelte';
import DetailsPage from '/@/lib/ui/DetailsPage.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import Route from '/@/Route.svelte';
import { volumeListInfos } from '/@/stores/volumes';

import VolumeDetailsSummary from '././VolumeDetailsSummary.svelte';
import { VolumeUtils } from './volume-utils';
import VolumeActions from './VolumeActions.svelte';
import VolumeDetailsInspect from './VolumeDetailsInspect.svelte';
import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  volumeName: string;
  engineId: string;
}
let { volumeName, engineId }: Props = $props();

const volumeUtils = new VolumeUtils();
let detailsPage = $state<DetailsPage>();

let volume: VolumeInfoUI | undefined = $derived.by(() => {
  const allVolumes = $volumeListInfos.map(volumeListInfo => volumeListInfo.Volumes).flat();
  const matchingVolume = allVolumes.find(volume => volume.Name === volumeName && volume.engineId === engineId);
  if (matchingVolume) {
    try {
      return volumeUtils.toVolumeInfoUI(matchingVolume);
    } catch (err: unknown) {
      console.error(`Error getting volume info ${volumeName} ${engineId}: ${err}`);
    }
  }
  return undefined;
});

$effect(() => {
  if (!volume) detailsPage?.close();
});
</script>

{#if volume}
  <DetailsPage title={volume.shortName} subtitle={volume.humanSize} bind:this={detailsPage}>
    {#snippet iconSnippet()}
      <StatusIcon icon={VolumeIcon} size={24} status={volume.status} />
    {/snippet}  
    {#snippet actionsSnippet()}
      <VolumeActions volume={volume} detailed={true} />
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
    {/snippet}
    {#snippet contentSnippet()}
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <VolumeDetailsSummary volume={volume} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <VolumeDetailsInspect volume={volume} />
      </Route>
    {/snippet}
  </DetailsPage>
{/if}
