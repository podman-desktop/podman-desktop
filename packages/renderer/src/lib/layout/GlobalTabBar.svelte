<script lang="ts">
import type { SecretInfo } from '@desktop-framework/api';
import { StatusIcon, TabBar } from '@podman-desktop/ui-svelte';
import { ContainerIcon, Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount } from 'svelte';

import { ImageUtils } from '/@/lib/image/image-utils';
import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import ImageIcon from '/@/lib/images/ImageIcon.svelte';
import ManifestIcon from '/@/lib/images/ManifestIcon.svelte';
import NetworkIcon from '/@/lib/images/NetworkIcon.svelte';
import PodIcon from '/@/lib/images/PodIcon.svelte';
import SecretIcon from '/@/lib/images/SecretIcon.svelte';
import VolumeIcon from '/@/lib/images/VolumeIcon.svelte';
import { containersInfos } from '/@/stores/containers';
import { imagesInfos } from '/@/stores/images';
import {
  closeAllResourceTabs,
  closeOtherTabs,
  closeResourceTab,
  MAIN_TAB,
  reorderResourceTab,
  resourceTabId,
  selectResourceTab,
  tabsState,
  togglePin,
} from '/@/stores/layout/tabs.svelte';
import { getEntryInfo } from '/@/stores/navigation-history.svelte';
import { networksListInfo } from '/@/stores/networks';
import { podsInfos } from '/@/stores/pods';
import { secretsInfo } from '/@/stores/secrets';
import { volumeListInfos } from '/@/stores/volumes';

const imageUtils = new ImageUtils();

// Local-only visual fixture for reviewing Secret tabs; it never creates a
// secret in a container provider and is excluded from production builds.
onMount(() => {
  if (!import.meta.env.DEV) return;

  const mockSecret: SecretInfo = {
    engineId: 'mock-secret-engine',
    engineName: 'Mock Podman',
    engineType: 'podman',
    Id: 'mock-secret-preview',
    Name: 'mock-secret-preview',
    CreatedAt: '2026-10-19T09:00:00.000Z',
    Labels: { purpose: 'tab-preview' },
  };
  secretsInfo.update(current => [...current.filter(secret => secret.Id !== mockSecret.Id), mockSecret]);

  const url = `/secrets/${mockSecret.engineId}/${mockSecret.Id}/summary`;
  const id = resourceTabId(url) ?? url;
  if (!tabsState.tabs.some(tab => tab.id === id)) {
    tabsState.tabs.push({ id, title: mockSecret.Name, pinned: false, stack: [{ url }], index: 0 });
  }
});

const mainTab = $derived(tabsState.tabs[0]!);
const mainInfo = $derived(getEntryInfo(mainTab.stack[mainTab.index]?.url ?? '/'));
const tabs = $derived(
  tabsState.tabs.map(tab => {
    const currentUrl =
      tab.stack[tab.index]?.url ?? (tab.id.startsWith('page:') ? tab.id.slice('page:'.length) : undefined);
    const pageInfo = currentUrl ? getEntryInfo(currentUrl) : undefined;
    const urlResourceType = currentUrl && resourceTabId(currentUrl) ? resourceTypeForUrl(currentUrl) : undefined;
    const title =
      tab.id === MAIN_TAB
        ? mainInfo.name
        : urlResourceType && currentUrl
          ? (resourceNameForUrl(currentUrl) ?? tab.title)
          : tab.id.startsWith('page:')
            ? (pageInfo?.name ?? tab.title)
            : tab.title;
    const resourceType =
      tab.id === MAIN_TAB
        ? 'Page'
        : (urlResourceType ??
          (tab.id.startsWith('page:')
            ? 'Page'
            : ({
                containers: 'Container',
                images: 'Image',
                pods: 'Pod',
                volumes: 'Volume',
                networks: 'Network',
                secrets: 'Secret',
                compose: 'Compose',
                manifests: 'Manifest',
              }[tab.id.split('/')[1] ?? ''] ?? 'Resource')));
    return {
      ...tab,
      key: tab.id,
      title,
      status: currentUrl ? statusForUrl(currentUrl) : undefined,
      tooltip: `${resourceType}: ${title}`,
    };
  }),
);

function resourceTypeForUrl(url: string): string | undefined {
  const route = url.split('?')[0]!.split('/').filter(Boolean)[0];
  return (
    {
      containers: 'Container',
      images: 'Image',
      manifests: 'Manifest',
      pods: 'Pod',
      volumes: 'Volume',
      networks: 'Network',
      secrets: 'Secret',
      compose: 'Compose',
    }[route ?? ''] ?? undefined
  );
}

function resourceNameForUrl(url: string): string | undefined {
  const parts = url
    .split('?')[0]!
    .split('/')
    .filter(Boolean)
    .map(part => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });
  if (parts[0] === 'containers' && parts[1]) {
    return $containersInfos.find(container => container.id === parts[1])?.name;
  }
  if (parts[0] === 'pods' && parts[1] === 'podman' && parts[2] && parts[3]) {
    return $podsInfos.find(pod => pod.name === parts[2] && pod.engineId === parts[3])?.name;
  }
  if ((parts[0] === 'images' || parts[0] === 'manifests') && parts[1] && parts[2]) {
    const image = $imagesInfos.find(info => info.id === parts[1] && info.engineId === parts[2]);
    if (image) return `${image.name}:${image.tag}`;
  }
  if (parts[0] === 'volumes' && parts[1] && parts[2]) {
    return $volumeListInfos.find(volume => volume.name === parts[1] && volume.engineId === parts[2])?.name;
  }
  if (parts[0] === 'networks' && parts[1] && parts[2]) {
    return $networksListInfo.find(network => network.name === parts[1] && network.engineId === parts[2])?.name;
  }
  if (parts[0] === 'secrets' && parts[1] && parts[2]) {
    return $secretsInfo.find(secret => secret.Id === parts[2] && secret.engineId === parts[1])?.Name;
  }
  return undefined;
}
function tabIcon(id: string, url?: string): ReturnType<typeof getEntryInfo>['icon'] {
  if (id === MAIN_TAB) return mainInfo.icon;
  const currentUrl = url ?? id;
  const routeIcon = getEntryInfo(currentUrl).icon;
  if (routeIcon) return routeIcon;

  const routeType = currentUrl.split('?')[0]!.split('/').filter(Boolean)[0];
  const fallbackIcons = {
    containers: ContainerIcon,
    images: ImageIcon,
    manifests: ManifestIcon,
    pods: PodIcon,
    volumes: VolumeIcon,
    networks: NetworkIcon,
    secrets: SecretIcon,
    compose: ContainerIcon,
    webviews: ExtensionIcon,
    contribs: ExtensionIcon,
  };
  return { iconComponent: fallbackIcons[routeType as keyof typeof fallbackIcons] ?? ExtensionIcon };
}

function statusForUrl(url: string): string | undefined {
  const parts = url
    .split('?')[0]!
    .split('/')
    .filter(Boolean)
    .map(part => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });
  if (parts[0] === 'containers' && parts[1]) {
    return $containersInfos.find(container => container.id === parts[1])?.state;
  }
  if (parts[0] === 'pods' && parts[1] === 'podman' && parts[2] && parts[3]) {
    return $podsInfos.find(pod => pod.name === parts[2] && pod.engineId === parts[3])?.status.toUpperCase();
  }
  if ((parts[0] === 'images' || parts[0] === 'manifests') && parts[1] && parts[2]) {
    const image = $imagesInfos.find(info => info.Id === parts[1] && info.engineId === parts[2]);
    if (!image) return undefined;
    let repositoryTag: string | undefined;
    if (parts[3]) {
      try {
        repositoryTag = atob(parts[3]);
      } catch {
        repositoryTag = undefined;
      }
    }
    return imageUtils.getInUse(image, repositoryTag, $containersInfos) ? 'USED' : 'UNUSED';
  }
  if (parts[0] === 'volumes' && parts[1] && parts[2]) {
    return $volumeListInfos.find(volume => volume.name === parts[1] && volume.engineId === parts[2])?.status;
  }
  if (parts[0] === 'networks' && parts[1] && parts[2]) {
    return $networksListInfo.find(network => network.name === parts[1] && network.engineId === parts[2])?.status;
  }
  return undefined;
}
function openPicker(): void {
  window.dispatchEvent(new Event('open-new-tab-palette'));
}
function moveTab(_sourcePanel: string, id: string, beforeId?: string): void {
  reorderResourceTab(id, beforeId);
}
function onKeydown(event: KeyboardEvent): void {
  if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
  if (event.key.toLowerCase() === 'w') {
    event.preventDefault();
    closeResourceTab(tabsState.activeId);
  } else if (event.key.toLowerCase() === 't') {
    event.preventDefault();
    openPicker();
  } else if (event.key === 'Tab') {
    event.preventDefault();
    const index = tabsState.tabs.findIndex(tab => tab.id === tabsState.activeId);
    selectResourceTab(
      tabsState.tabs[(index + (event.shiftKey ? -1 : 1) + tabsState.tabs.length) % tabsState.tabs.length]!.id,
    );
  }
}
</script>

<svelte:window onkeydown={onKeydown} />

<div aria-label="Main tabs">
  <TabBar panelId="main-tabs" {tabs} activeTabId={tabsState.activeId}
    onSelect={selectResourceTab} onClose={closeResourceTab} onCloseOthers={closeOtherTabs}
    onCloseAllInPanel={closeAllResourceTabs} onPinToggle={togglePin}
    onReorder={reorderResourceTab} onMoveFromOtherPanel={moveTab} onAddTab={openPicker} showCloseAllButton={true}>
    {#snippet tabIconSnippet(tab)}
      {@const currentTab = tabsState.tabs.find(item => item.id === tab.id)}
      {@const currentUrl = currentTab?.stack[currentTab.index]?.url ?? (tab.id.startsWith('page:') ? tab.id.slice('page:'.length) : undefined)}
      {@const icon = tabIcon(tab.id, currentUrl)}
      {@const resolvedIcon = icon?.iconComponent ?? icon?.iconImage ?? icon?.faIcon?.definition}
      {#if resolvedIcon}
        {#if tab.status}
          <StatusIcon status={tab.status} icon={resolvedIcon} size={12} />
        {:else}
          <Icon icon={resolvedIcon} size={16} class="w-4 h-4 shrink-0" />
        {/if}
      {/if}
    {/snippet}
  </TabBar>
</div>
