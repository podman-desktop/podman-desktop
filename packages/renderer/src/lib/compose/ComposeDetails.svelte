<script lang="ts">
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import { ContainerUtils } from '/@/lib/container/container-utils';
import ComposeIcon from '/@/lib/images/PodIcon.svelte';
import DetailsPage from '/@/lib/ui/DetailsPage.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import Route from '/@/Route.svelte';
import { containersInfos } from '/@/stores/containers';

import ComposeActions from './ComposeActions.svelte';
import ComposeDetailsInspect from './ComposeDetailsInspect.svelte';
import ComposeDetailsKube from './ComposeDetailsKube.svelte';
import ComposeDetailsLogs from './ComposeDetailsLogs.svelte';
import ComposeDetailsSummary from './ComposeDetailsSummary.svelte';
import type { ComposeInfoUI } from './ComposeInfoUI';

interface Props {
  composeName: string;
  engineId: string;
}

let { composeName, engineId }: Props = $props();

const containerUtils = new ContainerUtils();

// We will use the containersInfos store to get every container that matches
// the label com.docker.compose.project={composeName}
// We only care about the status. Check each containersMatchingProject status and if every container is RUNNING, set status to RUNNING,
// else let status be 'STOPPED'

// Get all containers that match the composeName we are looking at
let containersMatchingProject = $derived(
  $containersInfos.filter(container => {
    return container?.Labels['com.docker.compose.project'] === composeName;
  }),
);

// Assume that the engine type is podman until we find a compose group that is docker
// Get the engine type from the first container in the list (if it exists)
let engineType: 'docker' | 'podman' = $derived(
  containersMatchingProject.length > 0 ? containersMatchingProject[0].engineType : 'podman',
);

// Update our current status
let status = $derived(
  containersMatchingProject.length > 0 &&
    containersMatchingProject.every(container => {
      return container?.State === 'running';
    })
    ? 'RUNNING'
    : 'STOPPED',
);

// Convert each matching container to the ComposeInfoContainerUI type and add it to compose.containers
let convertedContainers = $derived(
  containersMatchingProject.map(container => {
    return containerUtils.getContainerInfoUI(container);
  }),
);

// Make sure we update the compose object with the name, status, engineID, containers, etc.
// or else logging will not appear correctly when loading (it'll see empty containers..)
let compose: ComposeInfoUI = $derived({
  name: composeName,
  engineId: engineId,
  engineType: engineType,
  status: status,
  containers: convertedContainers,
});
</script>

{#if compose}
  <DetailsPage title={composeName} subtitle="">
    {#snippet iconSnippet()}
      <StatusIcon icon={ComposeIcon} size={24} status={compose.status} />
    {/snippet}
    {#snippet actionsSnippet()}
      <div class="flex items-center w-5">
        <div>&nbsp;</div>
      </div>
      <ComposeActions compose={compose} detailed={true} on:update={(): ComposeInfoUI => (compose = compose)} />
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Logs" selected={isTabSelected($router.path, 'logs')} url={getTabUrl($router.path, 'logs')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
      <Tab title="Kube" selected={isTabSelected($router.path, 'kube')} url={getTabUrl($router.path, 'kube')} />
    {/snippet}
    {#snippet contentSnippet()}
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <ComposeDetailsSummary compose={compose} />
      </Route>
      <Route path="/logs" breadcrumb="Logs" navigationHint="tab">
        <ComposeDetailsLogs compose={compose} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <ComposeDetailsInspect compose={compose} />
      </Route>
      <Route path="/kube" breadcrumb="Kube" navigationHint="tab">
        <ComposeDetailsKube compose={compose} />
      </Route>
    {/snippet}
  </DetailsPage>
{/if}
