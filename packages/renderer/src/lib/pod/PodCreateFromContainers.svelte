<script lang="ts">
import type { ProviderContainerConnectionInfo } from '@podman-desktop/core-api';
import { NavigationPage } from '@podman-desktop/core-api';
import type { PodCreatePortOptions } from '@podman-desktop/core-api/libpod';
import { Button, Checkbox, ErrorMessage, Input, StatusIcon } from '@podman-desktop/ui-svelte';
import { ContainerIcon } from '@podman-desktop/ui-svelte/icons';
import { onDestroy } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { router } from 'tinro';

import ContainerConnectionDropdown from '/@/lib/forms/ContainerConnectionDropdown.svelte';
import SolidPodIcon from '/@/lib/images/SolidPodIcon.svelte';
import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import WarningMessage from '/@/lib/ui/WarningMessage.svelte';
import { handleNavigation } from '/@/navigation';
import { type PodCreation, podCreationHolder } from '/@/stores/creation-from-containers-store';
import { providerInfos } from '/@/stores/providers';

let podCreation = $state<PodCreation | undefined>($podCreationHolder);
let createInProgress = $state(false);
let createError: string | undefined = $state(undefined);
// User toggles for whether a public port should be exposed (defaults to true when absent)
let portExposureOverrides = $state<Record<number, boolean>>({});

let providerConnections = $derived(
  $providerInfos
    .map(provider => provider.containerConnections)
    .flat()
    .filter(providerContainerConnection => providerContainerConnection.type === 'podman')
    .filter(providerContainerConnection => providerContainerConnection.status === 'started'),
);

let selectedProviderConnection = $derived(providerConnections.length > 0 ? providerConnections[0] : undefined);

let selectedProvider = $state<ProviderContainerConnectionInfo | undefined>(undefined);

$effect(() => {
  if (!selectedProvider && selectedProviderConnection) {
    selectedProvider = selectedProviderConnection;
  }
});

let mapPortExposed = $derived.by(() => {
  const map = new SvelteMap<number, { exposed: boolean; container: string }>();
  if (!podCreation) {
    return map;
  }
  for (const container of podCreation.containers) {
    for (const port of container.ports) {
      map.set(port.PublicPort, {
        exposed: portExposureOverrides[port.PublicPort] ?? true,
        container: container.name,
      });
    }
  }
  return map;
});

let containersPorts = $derived.by(() => {
  if (!podCreation) {
    return [] as { containers: string[]; ports: number[] }[];
  }
  const mapPortPrivate = new SvelteMap<number, string[]>();
  for (const container of podCreation.containers) {
    for (const port of container.ports) {
      mapPortPrivate.set(port.PrivatePort, [...(mapPortPrivate.get(port.PrivatePort) ?? []), container.name]);
    }
  }
  const result: { containers: string[]; ports: number[] }[] = [];
  mapPortPrivate.forEach((containers, privatePort) => {
    if (containers.length < 2) {
      return;
    }
    const indexContainersItem = getIndexSameContainersItems(result, containers);
    if (indexContainersItem !== undefined) {
      result[indexContainersItem].ports.push(privatePort);
    } else {
      result.push({
        containers,
        ports: [privatePort],
      });
    }
  });
  return result;
});

let warningText = $derived.by(() => {
  let text = '';
  for (const item of containersPorts) {
    text += 'Containers ';
    item.containers.forEach((container, index) => {
      text += `${container} `;
      if (index === item.containers.length - 2) {
        text += 'and ';
      } else if (index < item.containers.length - 1) {
        text += ', ';
      }
    });
    text += `use same ${item.ports.length > 1 ? 'ports' : 'port'} ${item.ports.join(', ')}\n`;
  }
  return text;
});

async function createPodFromContainers(): Promise<void> {
  createInProgress = true;
  try {
    await doCreatePodFromContainers();
  } catch (error) {
    createError = String(error);
  }
  createInProgress = false;
}
async function doCreatePodFromContainers(): Promise<void> {
  if (!podCreation) {
    throw new Error('no pod creation');
  }

  if (!selectedProvider) {
    throw new Error('no provider selected');
  }
  if (!podCreation) {
    throw new Error('no pod creation data');
  }

  // fetch port info from all containers
  const portmappingsArray = await Promise.all(
    podCreation.containers.map(async container => {
      const containerInspect = await window.getContainerInspect(container.engineId, container.id);

      // convert port bindings to an port mapping object
      return Object.entries(containerInspect.HostConfig.PortBindings).map(([key, value]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valueAny: any = value;
        const container_port = parseInt(key.split('/')[0]);
        // we may not have any value
        if (!value) {
          return undefined;
        }
        const host_port = parseInt(valueAny[0].HostPort);

        const host_ip = valueAny[0].HostIp as string;
        return {
          host_ip,
          host_port,
          container_port,
          range: 1,
          protocol: '',
        };
      });
    }),
  );

  // make it flat and remove undefined values
  const portmappings = portmappingsArray
    .flat()
    .filter(
      portmapping =>
        portmapping !== undefined &&
        mapPortExposed.has(portmapping.host_port) &&
        mapPortExposed.get(portmapping.host_port)?.exposed,
    )
    .filter(item => item !== undefined) as PodCreatePortOptions[];

  // first create pod
  const { Id, engineId } = await window.createPod({ name: podCreation.name, portmappings, provider: selectedProvider });
  // now, for each container, recreate it with the pod
  // but before, stop the container

  // then, stop all containers
  for (const container of podCreation.containers) {
    // make sure it is stopped
    try {
      await window.stopContainer(container.engineId, container.id);
    } catch (error) {
      // already stopped
    }
  }

  // then replicate containers
  for (const container of podCreation.containers) {
    // recreate the container but adding the pod and using a different name

    await window.replicatePodmanContainer(
      { ...container },
      { engineId },
      { pod: Id, name: container.name + '-podified' },
    );
  }

  // finally, start the pod
  await window.startPod(engineId, Id);

  // ok now, redirect to the pods
  router.goto('/pods/');
}

function getIndexSameContainersItems(
  entries: { containers: string[]; ports: number[] }[],
  containers: string[],
): number | undefined {
  let index = 0;
  for (const entry of entries) {
    const isDiff =
      containers.filter(arr1Item => !entry.containers.includes(arr1Item)).length > 0 ||
      entry.containers.filter(arr1Item => !containers.includes(arr1Item)).length > 0;
    if (!isDiff) {
      return index;
    }
    index++;
  }
  return undefined;
}

onDestroy(() => {
  // reset
  podCreationHolder.set(undefined);
});

function updatePortExposure(port: number, checked: boolean): void {
  portExposureOverrides[port] = checked;
}

function navigateToContainers(): void {
  return handleNavigation({ page: NavigationPage.CONTAINERS });
}
</script>

<EngineFormPage title="Copy containers to a pod" inProgress={createInProgress}>
  {#snippet icon()}
  <SolidPodIcon size="40" />
  {/snippet}

  {#snippet content()}
  <div >
    <div>
      {#if podCreation}
        {#if containersPorts.length > 0}
          <WarningMessage class="flex flex-row w-full  mb-2" error={warningText} />
        {/if}
        <div class="mb-2">
          <span class="block font-semibold rounded-sm text-[var(--pd-content-card-header-text)]"
            >Name of the pod:</span>
        </div>
        <div class="mb-4">
          <Input
            name="podName"
            id="podName"
            bind:value={podCreation.name}
            placeholder="Select name of the pod..."
            aria-label="Pod name"
            required />
        </div>

        <div class="mb-2">
          <span
            class="block font-semibold rounded-sm text-[var(--pd-content-card-header-text)]"
            aria-label="Containers">Containers to replicate to the pod:</span>
        </div>
        <div class="w-full bg-[var(--pd-content-card-inset-bg)] mb-4 max-h-40 overflow-y-auto">
          {#each podCreation.containers as container, index (container.id)}
            <div class="p-2 flex flex-row items-center text-[var(--pd-content-card-text)]">
              <div class="w-10"><StatusIcon icon={ContainerIcon} status="STOPPED" /></div>
              <div class="w-16 pl-3">{index + 1}.</div>
              <div class="grow">{container.name}</div>
              <div class="w-28">({container.id.substring(0, 7)})</div>
            </div>
          {/each}
        </div>

        {#if mapPortExposed.size > 0}
          <div class="mb-2">
            <span
              class="block font-semibold rounded-sm text-[var(--pd-content-card-header-text)]"
              aria-label="Exposed ports">All selected ports will be exposed:</span>
          </div>
          <div class="bg-[var(--pd-content-card-inset-bg)] mb-4 max-h-40 overflow-y-auto">
            {#each [...mapPortExposed] as [port, value] (port)}
              <div class="p-2 flex flex-row align-items text-sm text-[var(--pd-content-card-text)]">
                <Checkbox
                  class="pt-0.5 mr-5"
                  checked={value.exposed}
                  onclick={updatePortExposure.bind(undefined, port)} />
                <div class="w-28 mr-5">Port {port.toString()}</div>
                <span>{value.container}</span>
              </div>
            {/each}
          </div>
        {/if}
      {/if}

      {#if providerConnections.length > 1}
        <label
          for="providerConnectionName"
          class="block mb-2 font-semibold rounded-sm text-[var(--pd-content-card-header-text)]"
          >Container engine:</label>
        <ContainerConnectionDropdown
          class="w-full"
          name="providerChoice"
          bind:value={selectedProvider}
          connections={providerConnections}
        />
      {/if}
      {#if providerConnections.length === 1 && selectedProviderConnection?.name}
        <input type="hidden" name="providerChoice" readonly value={selectedProviderConnection.name} />
      {/if}

      <div class="w-full grid justify-items-end mt-5">
        <div>
          <Button type="link" on:click={navigateToContainers}>Close</Button>
          <Button
            icon={SolidPodIcon}
            disabled={createInProgress}
            on:click={createPodFromContainers}
            inProgress={createInProgress}
            aria-label="Create pod">
            Create Pod
          </Button>
        </div>
      </div>

      {#if createError}
        <ErrorMessage class="pt-2 text-sm" error={createError} />
      {/if}
    </div>
  </div>
  {/snippet}
</EngineFormPage>
