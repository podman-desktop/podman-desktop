<script lang="ts">
import { faArrowsRotate, faExternalLinkSquareAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import FlatMenu from '/@/lib/ui/FlatMenu.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { PodUI } from './PodUI';

export let pod: PodUI;
export let dropdownMenu = false;
export let detailed = false;

let openingKubernetesUrls = new SvelteMap<string, string>();

onMount(async () => {
  const ns = await window.kubernetesGetCurrentNamespace();
  if (ns) {
    const kubepod = await window.kubernetesReadNamespacedPod(pod.name, ns);
    if (kubepod?.metadata?.labels?.app) {
      const appName = kubepod.metadata.labels.app;
      const routes = await window.kubernetesListRoutes();
      const appRoutes = routes.filter(r => r.metadata.labels?.['app'] === appName);
      appRoutes.forEach(route => {
        openingKubernetesUrls = openingKubernetesUrls.set(
          route.metadata.name,
          route.spec.tls ? `https://${route.spec.host}` : `http://${route.spec.host}`,
        );
      });
    }
  }
});

async function restartPod(): Promise<void> {
  pod.status = 'RESTARTING';

  await window.restartKubernetesPod(pod.name);
}

async function deletePod(): Promise<void> {
  pod.status = 'DELETING';

  await window.kubernetesDeletePod(pod.name);
}

// If dropdownMenu = true, we'll change style to the imported dropdownMenu style
// otherwise, leave blank.
let actionsStyle: typeof DropdownMenu | typeof FlatMenu;
if (dropdownMenu) {
  actionsStyle = DropdownMenu;
} else {
  actionsStyle = FlatMenu;
}
</script>

<ListItemButtonIcon
  title="Delete Pod"
  onClick={():void => withConfirmation(deletePod, `delete pod ${pod.name}`)}
  icon={faTrash}
  detailed={detailed}/>

<!-- If dropdownMenu is true, use it, otherwise just show the regular buttons -->
<svelte:component this={actionsStyle}>
  <ListItemButtonIcon
    title="Restart Pod"
    onClick={restartPod}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faArrowsRotate} />
    {#if openingKubernetesUrls.size === 0}
      <ListItemButtonIcon
        title="Open Browser"
        menu={dropdownMenu}
        enabled={false}
        hidden={dropdownMenu}
        detailed={detailed}
        icon={faExternalLinkSquareAlt} />
    {:else if openingKubernetesUrls.size === 1}
      <ListItemButtonIcon
        title="Open {[...openingKubernetesUrls][0][0]}"
        onClick={(): Promise<void> => window.openExternal([...openingKubernetesUrls][0][1])}
        menu={dropdownMenu}
        enabled={pod.status === 'RUNNING'}
        hidden={dropdownMenu}
        detailed={detailed}
        icon={faExternalLinkSquareAlt} />
    {:else if openingKubernetesUrls.size > 1}
      <DropdownMenu
        title="Open Kubernetes Routes"
        icon={faExternalLinkSquareAlt}
        hidden={dropdownMenu}
        shownAsMenuActionItem={true}>
        {#each Array.from(openingKubernetesUrls) as [routeName, routeHost] (routeName)}
          <ListItemButtonIcon
            title="Open {routeName}"
            onClick={(): Promise<void>  => window.openExternal(routeHost)}
            menu={!dropdownMenu}
            enabled={pod.status === 'RUNNING'}
            hidden={dropdownMenu}
            detailed={detailed}
            icon={faExternalLinkSquareAlt} />
        {/each}
      </DropdownMenu>
    {/if}
</svelte:component>
