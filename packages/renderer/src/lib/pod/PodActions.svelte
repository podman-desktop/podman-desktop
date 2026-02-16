<script lang="ts">
import {
  faArrowsRotate,
  faExternalLinkSquareAlt,
  faFileCode,
  faPlay,
  faRocket,
  faStop,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import type { Menu } from '@podman-desktop/core-api';
import { MenuContext } from '@podman-desktop/core-api';
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import { createEventDispatcher, onMount } from 'svelte';
import { router } from 'tinro';

import ContributionActions from '/@/lib/actions/ContributionActions.svelte';
import { ContainerUtils } from '/@/lib/container/container-utils';
import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import FlatMenu from '/@/lib/ui/FlatMenu.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { PodInfoUI } from './PodInfoUI';

const dispatch = createEventDispatcher<{ update: PodInfoUI }>();
interface Props {
  pod: PodInfoUI;
  dropdownMenu?: boolean;
  detailed?: boolean;
  onUpdate?: (update: PodInfoUI) => void;
}

let {
  pod = $bindable(),
  dropdownMenu = false,
  detailed = false,
  onUpdate = (update): void => {
    dispatch('update', update);
  },
}: Props = $props();

let contributions = $state<Menu[]>([]);
onMount(async () => {
  contributions = await window.getContributedMenus(MenuContext.DASHBOARD_POD);
});

let urls: Array<string> = $state([]);
const openingUrls = $derived(urls);

const portRegexp = RegExp(/:(\d+)/);

function extractPort(urlString: string): number | undefined {
  const match = portRegexp.exec(urlString);
  return match ? parseInt(match[1], 10) : undefined;
}

onMount(async () => {
  const containerUtils = new ContainerUtils();

  const containerIds = pod.containers.map(podContainer => podContainer.Id);
  const podContainers = (await window.listContainers()).filter(
    container => containerIds.findIndex(containerInfo => containerInfo === container.Id) >= 0,
  );

  podContainers.forEach(container => {
    const openingUrls = containerUtils.getOpeningUrls(container);
    urls = [...new Set([...urls, ...openingUrls])];
  });
});

function inProgress(inProgress: boolean, state?: string): void {
  pod.actionInProgress = inProgress;
  // reset error when starting task
  if (inProgress) {
    pod.actionError = '';
  }
  if (state) {
    pod.status = state;
  }

  onUpdate(pod);
}

function handleError(errorMessage: string): void {
  pod.actionError = errorMessage;
  pod.status = 'ERROR';
  onUpdate(pod);
}

async function startPod(): Promise<void> {
  inProgress(true, 'STARTING');
  try {
    await window.startPod(pod.engineId, pod.id);
  } catch (error) {
    handleError(String(error));
  } finally {
    inProgress(false);
  }
}

async function restartPod(): Promise<void> {
  inProgress(false, 'RESTARTING');
  try {
    await window.restartPod(pod.engineId, pod.id);
  } catch (error) {
    handleError(String(error));
  } finally {
    inProgress(false);
  }
}

async function stopPod(): Promise<void> {
  inProgress(false, 'STOPPING');
  try {
    await window.stopPod(pod.engineId, pod.id);
  } catch (error) {
    handleError(String(error));
  } finally {
    inProgress(false);
  }
}

async function deletePod(): Promise<void> {
  inProgress(false, 'DELETING');
  try {
    await window.removePod(pod.engineId, pod.id);
  } catch (error) {
    handleError(String(error));
  } finally {
    inProgress(false);
  }
}

function openGenerateKube(): void {
  router.goto(`/pods/podman/${encodeURI(pod.name)}/${encodeURIComponent(pod.engineId)}/kube`);
}

function deployToKubernetes(): void {
  router.goto(`/deploy-to-kube/${pod.id}/${pod.engineId}`);
}
// If dropdownMenu = true, we'll change style to the imported dropdownMenu style
// otherwise, leave blank.
const MenuComponent = $derived(dropdownMenu ? DropdownMenu : FlatMenu);
</script>

<ListItemButtonIcon
  title="Start Pod"
  onClick={startPod}
  hidden={pod.status === 'RUNNING' || pod.status === 'STOPPING'}
  detailed={detailed}
  inProgress={pod.actionInProgress && pod.status === 'STARTING'}
  icon={faPlay} />
<ListItemButtonIcon
  title="Stop Pod"
  onClick={stopPod}
  hidden={!(pod.status === 'RUNNING' || pod.status === 'STOPPING')}
  detailed={detailed}
  inProgress={pod.actionInProgress && pod.status === 'STOPPING'}
  icon={faStop} />
<ListItemButtonIcon
  title="Delete Pod"
  onClick={(): void => withConfirmation(deletePod, `delete pod ${pod.name}`)}
  icon={faTrash}
  detailed={detailed}
  inProgress={pod.actionInProgress && pod.status === 'DELETING'} />

<!-- If dropdownMenu is true, use it, otherwise just show the regular buttons -->
<MenuComponent>
  {#if !detailed}
    <ListItemButtonIcon
      title="Generate Kube"
      onClick={openGenerateKube}
      menu={dropdownMenu}
      detailed={detailed}
      icon={faFileCode} />
  {/if}
  <ListItemButtonIcon
    title="Deploy to Kubernetes"
    onClick={deployToKubernetes}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faRocket} />
  {#if openingUrls.length === 0}
    <ListItemButtonIcon
      title="Open Exposed Port"
      menu={dropdownMenu}
      enabled={false}
      hidden={dropdownMenu}
      detailed={detailed}
      icon={faExternalLinkSquareAlt} />
  {:else if openingUrls.length === 1}
    <ListItemButtonIcon
      title="Open {extractPort(openingUrls[0])}"
      onClick={(): Promise<void> => window.openExternal(openingUrls[0])}
      menu={dropdownMenu}
      enabled={pod.status === 'RUNNING'}
      hidden={dropdownMenu}
      detailed={detailed}
      icon={faExternalLinkSquareAlt} />
  {:else if openingUrls.length > 1}
    <DropdownMenu icon={faExternalLinkSquareAlt} hidden={dropdownMenu} shownAsMenuActionItem={true}>
      {#each openingUrls as url, index (index)}
        <ListItemButtonIcon
          title="Open {extractPort(url)}"
          onClick={(): Promise<void> => window.openExternal(url)}
          menu={!dropdownMenu}
          enabled={pod.status === 'RUNNING'}
          hidden={dropdownMenu}
          detailed={detailed}
          icon={faExternalLinkSquareAlt} />
      {/each}
    </DropdownMenu>
  {/if}
  <ListItemButtonIcon
    title="Restart Pod"
    onClick={restartPod}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faArrowsRotate} />
  <ContributionActions
    args={[pod]}
    contextPrefix="podItem"
    dropdownMenu={dropdownMenu}
    contributions={contributions}
    detailed={detailed}
    onError={handleError} />
</MenuComponent>
