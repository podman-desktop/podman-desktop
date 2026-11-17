<script lang="ts">
import { faArrowsRotate, faExternalLinkSquareAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import { t } from '/@/lib/i18n/translations.svelte';
import FlatMenu from '/@/lib/ui/FlatMenu.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import type { PodUI } from './PodUI';

interface Props {
  pod: PodUI;
  dropdownMenu?: boolean;
  detailed?: boolean;
}

let { pod = $bindable(), dropdownMenu = false, detailed = false }: Props = $props();

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
let ActionsStyle = $derived(dropdownMenu ? DropdownMenu : FlatMenu);
</script>

<ListItemButtonIcon
  title={t('workloads.deletePod') ?? 'Delete Pod'}
  onClick={():void => withConfirmation(deletePod, `delete pod ${pod.name}`, { title: t('workloads.deletePodTitle') ?? 'Delete Pod?', message: t('workloads.deletePodMessage', { name: pod.name }) ?? `Are you sure you want to delete pod ${pod.name}?`, variant: 'delete' })}
  icon={faTrash}
  detailed={detailed}/>

<!-- If dropdownMenu is true, use it, otherwise just show the regular buttons -->
<ActionsStyle>
  <ListItemButtonIcon
    title={t('workloads.restartPod') ?? 'Restart Pod'}
    onClick={restartPod}
    menu={dropdownMenu}
    detailed={detailed}
    icon={faArrowsRotate} />
    {#if openingKubernetesUrls.size === 0}
      <ListItemButtonIcon
        title={t('workloads.openBrowser') ?? 'Open Browser'}
        menu={dropdownMenu}
        enabled={false}
        hidden={dropdownMenu}
        detailed={detailed}
        icon={faExternalLinkSquareAlt} />
    {:else if openingKubernetesUrls.size === 1}
      <ListItemButtonIcon
        title={t('workloads.openNamed', { name: [...openingKubernetesUrls][0][0] }) ?? `Open ${[...openingKubernetesUrls][0][0]}`}
        onClick={(): Promise<void> => window.openExternal([...openingKubernetesUrls][0][1])}
        menu={dropdownMenu}
        enabled={pod.status === 'RUNNING'}
        hidden={dropdownMenu}
        detailed={detailed}
        icon={faExternalLinkSquareAlt} />
    {:else if openingKubernetesUrls.size > 1}
      <DropdownMenu
        title={t('workloads.openKubernetesRoutes') ?? 'Open Kubernetes Routes'}
        icon={faExternalLinkSquareAlt}
        hidden={dropdownMenu}
        shownAsMenuActionItem={true}>
        {#each Array.from(openingKubernetesUrls) as [routeName, routeHost] (routeName)}
          <ListItemButtonIcon
            title={t('workloads.openNamed', { name: routeName }) ?? `Open ${routeName}`}
            onClick={(): Promise<void>  => window.openExternal(routeHost)}
            menu={!dropdownMenu}
            enabled={pod.status === 'RUNNING'}
            hidden={dropdownMenu}
            detailed={detailed}
            icon={faExternalLinkSquareAlt} />
        {/each}
      </DropdownMenu>
    {/if}
</ActionsStyle>
