<script lang="ts">
import { faArrowsRotate, faFileCode, faPlay, faRocket, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Menu } from '@podman-desktop/core-api';
import { MenuContext } from '@podman-desktop/core-api';
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import { createEventDispatcher, onMount } from 'svelte';
import { router } from 'tinro';

import ContributionActions from '/@/lib/actions/ContributionActions.svelte';
import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import FlatMenu from '/@/lib/ui/FlatMenu.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';
import { clearContainerActionInProgress, setContainerStatus } from '/@/stores/containers';

import type { ComposeInfoUI } from './ComposeInfoUI';

const dispatch = createEventDispatcher<{ update: ComposeInfoUI }>();

interface Props {
  compose: ComposeInfoUI;
  dropdownMenu?: boolean;
  detailed?: boolean;
  onUpdate?: (update: ComposeInfoUI) => void;
}

let {
  compose,
  dropdownMenu = false,
  detailed = false,
  onUpdate = (update): void => {
    dispatch('update', update);
  },
}: Props = $props();

const composeLabel = 'com.docker.compose.project';

let contributions: Menu[] = $state([]);
onMount(async () => {
  contributions = await window.getContributedMenus(MenuContext.DASHBOARD_COMPOSE);
});

let someNeedStart = $derived(compose.containers?.some(c => c.state !== 'RUNNING'));
let someNeedStop = $derived(compose.containers?.some(c => c.state === 'RUNNING'));
let actionInProgress = $derived(
  compose.actionInProgress === true ? true : compose.containers.some(container => container.actionInProgress),
);
let actionStatus = $derived(
  compose.actionInProgress
    ? compose.status
    : (compose.containers.find(container => container.actionInProgress)?.state ?? compose.status),
);
let allContainersInProgress = $derived(compose.containers.every(container => container.actionInProgress));

let hideStartForStop = $state(false);
let hideStopForStart = $state(false);

function inProgress(isStarting: boolean, state?: string): void {
  compose.actionInProgress = isStarting;
  if (isStarting) {
    compose.actionError = '';
  }
  if (state) {
    compose.status = state;
  }
  for (const container of compose.containers) {
    if (state === 'STARTING' && container.state === 'RUNNING') {
      continue;
    }
    if (state === 'STOPPING' && container.state !== 'RUNNING') {
      continue;
    }
    if (state) {
      setContainerStatus(container.engineId, container.id, state);
    } else if (!isStarting) {
      clearContainerActionInProgress(container.engineId, container.id);
    }
  }
  onUpdate(compose);
}

function handleError(errorMessage: string): void {
  compose.actionError = errorMessage;
  compose.status = 'ERROR';
  onUpdate(compose);
}

async function startCompose(): Promise<void> {
  hideStopForStart = !someNeedStop;
  inProgress(true, 'STARTING');
  try {
    await window.startContainersByLabel(compose.engineId, composeLabel, compose.name);
  } catch (error) {
    handleError(String(error));
  } finally {
    inProgress(false);
  }
}
async function stopCompose(): Promise<void> {
  hideStartForStop = !someNeedStart;
  inProgress(true, 'STOPPING');
  try {
    await window.stopContainersByLabel(compose.engineId, composeLabel, compose.name);
  } catch (error) {
    handleError(String(error));
  } finally {
    inProgress(false);
  }
}

async function deleteCompose(): Promise<void> {
  inProgress(true, 'DELETING');
  try {
    await window.deleteContainersByLabel(compose.engineId, composeLabel, compose.name);
  } catch (error) {
    handleError(String(error));
  } finally {
    inProgress(false);
  }
}

async function restartCompose(): Promise<void> {
  inProgress(true, 'RESTARTING');
  try {
    await window.restartContainersByLabel(compose.engineId, composeLabel, compose.name);
  } catch (error) {
    handleError(String(error));
  } finally {
    inProgress(false);
  }
}

function deployToKubernetes(): void {
  router.goto(`/compose/deploy-to-kube/${compose.name}/${compose.engineId}`);
}

function openGenerateKube(): void {
  router.goto(`/compose/details/${encodeURI(compose.name)}/${encodeURI(compose.engineId)}/kube`);
}

// If dropdownMenu = true, we'll change style to the imported dropdownMenu style
// otherwise, leave blank.
let ActionsStyle = $derived(dropdownMenu ? DropdownMenu : FlatMenu);
</script>

<ListItemButtonIcon
  title="Start Compose"
  onClick={startCompose}
  hidden={
    !actionInProgress
      ? !someNeedStart
      : (actionStatus === 'STOPPING' && (hideStartForStop || allContainersInProgress))
  }
  enabled={!actionInProgress}
  detailed={detailed}
  inProgress={actionInProgress && actionStatus === 'STARTING'}
  icon={faPlay} />

<ListItemButtonIcon
  title="Stop Compose"
  onClick={stopCompose}
  hidden={
    !actionInProgress
      ? !someNeedStop
      : (actionStatus === 'STARTING' && (hideStopForStart || allContainersInProgress))
  }
  detailed={detailed}
  enabled={!actionInProgress}
  inProgress={actionInProgress && actionStatus === 'STOPPING'}
  icon={faStop} />

<ListItemButtonIcon
  title="Delete Compose"
  onClick={(): void => withConfirmation(deleteCompose, `delete compose ${compose.name}`, { title: 'Delete Compose?', variant: 'delete' })}
  icon={faTrash}
  detailed={detailed}
  inProgress={actionInProgress && actionStatus === 'DELETING'} />

<!-- If dropdownMenu is true, use it, otherwise just show the regular buttons -->
<ActionsStyle>
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
    hidden={compose.engineType !== 'podman'}
    detailed={detailed}
    icon={faRocket} />
  <ListItemButtonIcon
    title="Restart Compose"
    onClick={restartCompose}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faArrowsRotate} />
  <ContributionActions
    args={[compose]}
    contextPrefix="composeItem"
    dropdownMenu={dropdownMenu}
    contributions={contributions}
    detailed={detailed}
    onError={handleError} />
</ActionsStyle>
