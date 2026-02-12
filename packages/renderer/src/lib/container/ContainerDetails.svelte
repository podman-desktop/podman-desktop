<script lang="ts">
import '@xterm/xterm/css/xterm.css';

import type { ContainerInfo } from '@podman-desktop/core-api';
import { ErrorMessage, Link, StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { ContainerIcon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import DetailsPage from '/@/lib/ui/DetailsPage.svelte';
import StateChange from '/@/lib/ui/StateChange.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import Route from '/@/Route.svelte';
import { containersInfos } from '/@/stores/containers';

import { ContainerUtils } from './container-utils';
import ContainerActions from './ContainerActions.svelte';
import ContainerDetailsInspect from './ContainerDetailsInspect.svelte';
import ContainerDetailsKube from './ContainerDetailsKube.svelte';
import ContainerDetailsLogs from './ContainerDetailsLogs.svelte';
import ContainerDetailsSummary from './ContainerDetailsSummary.svelte';
import ContainerDetailsTerminal from './ContainerDetailsTerminal.svelte';
import ContainerDetailsTtyTerminal from './ContainerDetailsTtyTerminal.svelte';
import { ContainerGroupInfoTypeUI, type ContainerInfoUI } from './ContainerInfoUI';
import ContainerStatistics from './ContainerStatistics.svelte';

interface Props {
  containerID: string;
}

let { containerID }: Props = $props();

const containerUtils = new ContainerUtils();

let detailsPage = $state<DetailsPage | undefined>();
let displayTty: boolean = $state(false);

let container: ContainerInfoUI | undefined = $derived(
  getContainerInfoUI($containersInfos.find(c => c.Id === containerID)),
);

$effect(() => {
  if (container) {
    window
      .getContainerInspect(container.engineId, container.id)
      .then(inspect => {
        displayTty = (inspect.Config.Tty ?? false) && (inspect.Config.OpenStdin ?? false);
        // Redirect to appropriate tab if we're at the root path
        const currentRouterPath = $router.path;
        if (currentRouterPath.endsWith('/')) {
          if (displayTty) {
            router.goto(`${currentRouterPath}tty`);
          } else {
            router.goto(`${currentRouterPath}logs`);
          }
        }
      })
      .catch((err: unknown) => console.error(`Error getting container inspect ${container?.id}: ${err}`));
  } else {
    detailsPage?.close();
  }
});

function getContainerInfoUI(cont: ContainerInfo | undefined): ContainerInfoUI | undefined {
  return cont ? containerUtils.getContainerInfoUI(cont) : undefined;
}
</script>

{#if container}
  <DetailsPage title={container.name} bind:this={detailsPage}>
    {#snippet iconSnippet()}
      <StatusIcon icon={ContainerIcon} size={24} status={container.state} />
    {/snippet}
    {#snippet subtitleSnippet()}
      <Link
        aria-label="Image Details"
        on:click={(): void => {
          if (container.imageHref) {
            router.goto(container.imageHref);
          }
        }}>{container.shortImage}</Link>
    {/snippet}
    {#snippet actionsSnippet()}
      <div class="flex items-center w-5">
        {#if container.actionError}
          <ErrorMessage error={container.actionError} icon wrapMessage />
        {:else}
          <div>&nbsp;</div>
        {/if}
      </div>
      <ContainerActions container={container} detailed={true} />
    {/snippet}
    {#snippet detailSnippet()}
      <div class="flex py-2 w-full justify-end text-sm text-[var(--pd-content-text)]">
        <StateChange state={container.state} />
        <ContainerStatistics container={container} />
      </div>
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Logs" selected={isTabSelected($router.path, 'logs')} url={getTabUrl($router.path, 'logs')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />

      {#if container.engineType === 'podman' && container.groupInfo.type === ContainerGroupInfoTypeUI.STANDALONE}
        <Tab title="Kube" selected={isTabSelected($router.path, 'kube')} url={getTabUrl($router.path, 'kube')} />
      {/if}
      <Tab
        title="Terminal"
        selected={isTabSelected($router.path, 'terminal')}
        url={getTabUrl($router.path, 'terminal')} />
      {#if displayTty}
        <Tab title="Tty" selected={isTabSelected($router.path, 'tty')} url={getTabUrl($router.path, 'tty')} />
      {/if}
    {/snippet}
    {#snippet contentSnippet()}
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <ContainerDetailsSummary container={container} />
      </Route>
      <Route path="/logs" breadcrumb="Logs" navigationHint="tab">
        <ContainerDetailsLogs container={container} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <ContainerDetailsInspect container={container} />
      </Route>
      <Route path="/kube" breadcrumb="Kube" navigationHint="tab">
        <ContainerDetailsKube container={container} />
      </Route>
      <Route path="/terminal" breadcrumb="Terminal" navigationHint="tab">
        <ContainerDetailsTerminal container={container} />
      </Route>
      <Route path="/tty" breadcrumb="Tty" navigationHint="tab">
        <ContainerDetailsTtyTerminal container={container} />
      </Route>
    {/snippet}
  </DetailsPage>
{/if}
