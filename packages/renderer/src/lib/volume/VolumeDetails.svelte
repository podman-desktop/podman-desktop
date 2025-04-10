<script lang="ts">
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import Route from '../../Route.svelte';
import { volumeListInfos } from '../../stores/volumes';
import VolumeIcon from '../images/VolumeIcon.svelte';
import DetailsPage from '../ui/DetailsPage.svelte';
import { getTabUrl, isTabSelected } from '../ui/Util';
import VolumeDetailsSummary from '././VolumeDetailsSummary.svelte';
import { VolumeUtils } from './volume-utils';
import VolumeActions from './VolumeActions.svelte';
import VolumeDetailsInspect from './VolumeDetailsInspect.svelte';
import type { VolumeInfoUI } from './VolumeInfoUI';

export let volumeName: string;
export let engineId: string;

let volume: VolumeInfoUI;
let detailsPage: DetailsPage;

onMount(() => {
  const volumeUtils = new VolumeUtils();
  // loading volume info
  return volumeListInfos.subscribe(volumes => {
    const allVolumes = volumes.map(volumeListInfo => volumeListInfo.Volumes).flat();
    const matchingVolume = allVolumes.find(volume => volume.Name === volumeName && volume.engineId === engineId);
    if (matchingVolume) {
      try {
        volume = volumeUtils.toVolumeInfoUI(matchingVolume);
      } catch (err) {
        console.error(err);
      }
    } else if (detailsPage) {
      // the volume has been deleted
      detailsPage.close();
    }
  });
});
</script>

{#if volume}
  <DetailsPage title={volume.shortName} subtitle={volume.humanSize} bind:this={detailsPage}>
    {#snippet iconSnippet()}
      <StatusIcon icon={VolumeIcon} size={24} status={volume.status} />
    {/snippet}
    {#snippet actionsSnippet()}
      <VolumeActions volume={volume} detailed={true} on:update={(): VolumeInfoUI => (volume = volume)} />
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
