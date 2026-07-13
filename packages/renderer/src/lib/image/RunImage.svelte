<script lang="ts">
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import type {
  ContainerCreateOptions,
  DeviceMapping,
  HostConfig,
  HostConfigPortBinding,
  ImageInspectInfo,
  NetworkInspectInfo,
} from '@podman-desktop/core-api';
import { NavigationPage } from '@podman-desktop/core-api';
import { Button, ErrorMessage, Tab } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import { ContainerUtils } from '/@/lib/container/container-utils';
import type { ContainerInfoUI } from '/@/lib/container/ContainerInfoUI';
import type { PortInfo, RunOptions } from '/@/lib/image/run/run-options';
import AdvancedTab from '/@/lib/image/run/tabs/AdvancedTab.svelte';
import BasicTab from '/@/lib/image/run/tabs/BasicTab.svelte';
import NetworkingTab from '/@/lib/image/run/tabs/NetworkingTab.svelte';
import SecurityTab from '/@/lib/image/run/tabs/SecurityTab.svelte';
import { splitSpacesHandlingDoubleQuotes } from '/@/lib/string/string';
import { array2String } from '/@/lib/string/string.js';
import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import { handleNavigation } from '/@/navigation';
import Route from '/@/Route.svelte';
import { containersInfos } from '/@/stores/containers';
import { runImageInfo } from '/@/stores/run-image-store';

let options: RunOptions = $state({
  basic: {
    containerName: '',
    entrypoint: '',
    command: '',
    volumeMounts: [{ source: '', target: '' }],
    environmentVariables: [{ key: '', value: '' }],
    environmentFiles: [''],
    hostContainerPortMappings: [],
    containerPortMapping: [],
  },
  networking: {
    hostname: undefined,
    dnsServers: [''],
    extraHosts: [{ host: '', ip: '' }],
    networkingMode: 'bridge',
    networkingModeUserNetwork: '',
    networkingModeUserContainer: '',
  },
  advanced: {
    useTty: true,
    useInteractive: true,
    runUser: undefined,
    autoRemove: false,
    restartPolicyName: '',
    restartPolicyMaxRetryCount: 1,
    devices: [{ host: '', container: '', read: false, write: false, mknod: false }],
  },
  security: {
    privileged: false,
    readOnly: false,
    securityOpts: [''],
    capAdds: [''],
    capDrops: [''],
    userNamespace: undefined,
  },
});

let imageInspectInfo: ImageInspectInfo;

let containerNameError: string | undefined = $derived.by(() => {
  const containerAlreadyExists = $containersInfos.find(
    container =>
      container.engineId === imageInspectInfo.engineId &&
      container.Names.some(iteratingContainerName => iteratingContainerName === `/${options.basic.containerName}`),
  );
  if (containerAlreadyExists) {
    return `The name ${options.basic.containerName} already exists. Please choose another name or leave blank to generate a name.`;
  } else {
    return undefined;
  }
});

let exposedPorts = $state<string[]>([]);
let createError = $state<string>();
let onPortInputTimeout: NodeJS.Timeout;

let invalidPorts = $derived.by(() => {
  const invalidHostPorts = options.basic.hostContainerPortMappings.filter(pair => pair.hostPort.error);
  const invalidContainerPortMapping = options.basic.containerPortMapping?.filter(port => port.error) ?? [];
  return invalidHostPorts.length > 0 || invalidContainerPortMapping.length > 0;
});
let invalidFields = $derived(!!containerNameError || invalidPorts);

let dataReady = $state(false);

let imageDisplayName = $state('');

let engineNetworks = $state<NetworkInspectInfo[]>([]);
let engineContainers = $state<ContainerInfoUI[]>([]);

const image = $runImageInfo;

onMount(async () => {
  if (!image) {
    router.goto('/images/');
    return;
  }

  imageInspectInfo = await window.getImageInspect(image.engineId, image.id);
  exposedPorts = Array.from(Object.keys(imageInspectInfo?.Config?.ExposedPorts ?? {}));

  options.basic.command = array2String(imageInspectInfo.Config?.Cmd ?? []);

  if (imageInspectInfo.Config?.Entrypoint) {
    if (typeof imageInspectInfo.Config.Entrypoint === 'string') {
      options.basic.entrypoint = imageInspectInfo.Config.Entrypoint;
    } else {
      options.basic.entrypoint = array2String(imageInspectInfo.Config.Entrypoint);
    }
  } else {
    options.basic.entrypoint = '';
  }

  options.basic.containerPortMapping = new Array<PortInfo>(exposedPorts.length);
  await Promise.all(
    exposedPorts.map(async (port, index) => {
      const localPorts = await getPortsInfo(port);
      if (localPorts) {
        options.basic.containerPortMapping[index] = { port: localPorts, error: '' };
      }
    }),
  );
  dataReady = true;
  if (image.name && image.name.length > 60) {
    imageDisplayName = '...' + image.name.substring(image.name.length - 60);
  } else {
    imageDisplayName = image.name;
  }

  const allNetworks = await window.listNetworks();
  engineNetworks = allNetworks.filter(network => network.engineId === image.engineId);

  if (engineNetworks.length > 0) {
    const bridgeNetwork = engineNetworks.find(network => network.Name === 'bridge');
    if (bridgeNetwork) {
      options.networking.networkingModeUserNetwork = bridgeNetwork.Id;
    } else {
      options.networking.networkingModeUserNetwork = engineNetworks[0].Id;
    }
  }

  const allContainers = await window.listContainers();
  const containerUtils = new ContainerUtils();
  engineContainers = allContainers
    .filter(container => container.engineId === image.engineId)
    .map(container => containerUtils.getContainerInfoUI(container));

  if (engineContainers.length > 0) {
    const runningContainers = engineContainers
      .filter(container => container.state === 'RUNNING')
      .toSorted((a, b) => b.created - a.created);
    if (runningContainers.length > 0) {
      options.networking.networkingModeUserContainer = runningContainers[0].id;
    } else {
      options.networking.networkingModeUserContainer = engineContainers[0].id;
    }
  }
});

async function getPortsInfo(portDescriptor: string): Promise<string | undefined> {
  if (portDescriptor.includes('-')) {
    return await getPortRange(portDescriptor);
  } else {
    const localPort = await getPort(portDescriptor);
    if (!localPort) {
      return undefined;
    }
    return `${localPort}`;
  }
}

async function getPortRange(portDescriptor: string): Promise<string | undefined> {
  const rangeValues = getStartEndRange(portDescriptor);
  if (!rangeValues) {
    return Promise.resolve(undefined);
  }

  const rangeSize = rangeValues.endRange + 1 - rangeValues.startRange;
  try {
    return await window.getFreePortRange(rangeSize);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function getPort(portDescriptor: string): Promise<number | undefined> {
  let port: number;
  if (portDescriptor.endsWith('/tcp') || portDescriptor.endsWith('/udp')) {
    port = parseInt(portDescriptor.substring(0, portDescriptor.length - 4));
  } else {
    port = parseInt(portDescriptor);
  }
  if (isNaN(port)) {
    return Promise.resolve(undefined);
  }
  try {
    return await window.getFreePort(port);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function startContainer(): Promise<void> {
  createError = undefined;
  const ExposedPorts: { [key: string]: object } = {};

  const PortBindings: HostConfigPortBinding = {};
  try {
    exposedPorts.forEach((port, index) => {
      if (port.includes('-') || options.basic.containerPortMapping[index]?.port.includes('-')) {
        addPortsFromRange(ExposedPorts, PortBindings, port, options.basic.containerPortMapping[index].port);
      } else {
        if (options.basic.containerPortMapping[index]?.port) {
          PortBindings[port] = [{ HostPort: options.basic.containerPortMapping[index].port }];
        }
        ExposedPorts[port] = {};
      }
    });

    options.basic.hostContainerPortMappings
      .filter(pair => pair.hostPort.port && pair.containerPort)
      .forEach(pair => {
        if (pair.containerPort.includes('-') || pair.hostPort.port.includes('-')) {
          addPortsFromRange(ExposedPorts, PortBindings, pair.containerPort, pair.hostPort.port);
        } else {
          PortBindings[pair.containerPort] = [{ HostPort: pair.hostPort.port }];
          ExposedPorts[pair.containerPort] = {};
        }
      });
  } catch (e) {
    createError = String(e);
    console.error('Error while creating container', e);
    return;
  }

  const Env = options.basic.environmentVariables.filter(env => env.key).map(env => `${env.key}=${env.value ?? ''}`);

  const EnvFiles = options.basic.environmentFiles.filter(env => env);

  const Image = image.tag ? `${image.name}:${image.tag}` : image.id;

  const RestartPolicy: { Name: string; MaximumRetryCount?: number } = {
    Name: options.advanced.restartPolicyName,
  };

  if (options.advanced.restartPolicyName === 'on-failure') {
    RestartPolicy.MaximumRetryCount = options.advanced.restartPolicyMaxRetryCount;
  }

  const Binds = options.basic.volumeMounts
    .filter(volume => volume.source && volume.target)
    .map(volume => `${volume.source}:${volume.target}`);

  const SecurityOpt = options.security.securityOpts.filter(opt => opt);

  const CapAdd = options.security.capAdds.filter(cap => cap);
  const CapDrop = options.security.capDrops.filter(cap => cap);

  const ExtraHosts = options.networking.extraHosts
    .filter(host => host.host && host.ip)
    .map(host => `${host.host}:${host.ip}`);

  const Privileged = options.security.privileged;

  let NetworkMode;
  switch (options.networking.networkingMode) {
    case 'bridge':
      NetworkMode = 'bridge';
      break;
    case 'host':
      NetworkMode = 'host';
      break;
    case 'none':
      NetworkMode = 'none';
      break;
    case 'choice-network':
      NetworkMode = options.networking.networkingModeUserNetwork;
      break;
    case 'choice-container':
      NetworkMode = `container:${options.networking.networkingModeUserContainer}`;
      break;
    default:
      NetworkMode = 'bridge';
  }

  const ReadonlyRootfs = options.security.readOnly;
  const Tty = options.advanced.useTty;
  const OpenStdin = options.advanced.useInteractive;

  let Devices: DeviceMapping[] | undefined = options.advanced.devices
    .filter(d => d.host)
    .map(d => ({
      PathOnHost: d.host,
      PathInContainer: d.container !== '' ? d.container : d.host,
      CgroupPermissions:
        !d.read && !d.write && !d.mknod ? 'rwm' : `${d.read ? 'r' : ''}${d.write ? 'w' : ''}${d.mknod ? 'm' : ''}`,
    }));
  if (Devices.length === 0) {
    Devices = undefined;
  }

  const HostConfig: HostConfig = {
    Binds,
    AutoRemove: options.advanced.autoRemove,
    RestartPolicy,
    PortBindings,
    SecurityOpt,
    Privileged,
    ReadonlyRootfs,
    CapAdd,
    CapDrop,
    NetworkMode,
    Devices,
  };

  const Dns = options.networking.dnsServers.filter(dns => dns);
  if (Dns.length > 0) {
    HostConfig.Dns = Dns;
  }

  if (ExtraHosts.length > 0) {
    HostConfig.ExtraHosts = ExtraHosts;
  }

  if (options.security.userNamespace) {
    HostConfig.UsernsMode = options.security.userNamespace;
  }

  const createOptions: ContainerCreateOptions = {
    Image,
    Env,
    EnvFiles,
    name: options.basic.containerName,
    HostConfig,
    ExposedPorts,
    Tty,
    OpenStdin,
  };
  if (options.basic.command.trim().length > 0) {
    createOptions.Cmd = splitSpacesHandlingDoubleQuotes(options.basic.command);
  }
  if (options.basic.entrypoint.trim().length > 0) {
    createOptions.Entrypoint = splitSpacesHandlingDoubleQuotes(options.basic.entrypoint);
  }

  if (options.advanced.runUser) {
    createOptions.User = options.advanced.runUser;
  }

  if (options.networking.hostname) {
    createOptions.Hostname = options.networking.hostname;
  }

  try {
    const data = await window.createAndStartContainer(imageInspectInfo.engineId, createOptions);

    if (Tty && OpenStdin) {
      handleNavigation({
        page: NavigationPage.CONTAINER_TTY,
        parameters: {
          id: data.id,
        },
      });
    } else {
      handleNavigation({ page: NavigationPage.CONTAINERS });
    }
  } catch (e) {
    createError = String(e);
    console.error('Error while creating container', e);
    return;
  }
}

function addPortsFromRange(
  exposedPorts: { [key: string]: unknown },
  portBindings: { [key: string]: unknown },
  containerRange: string,
  hostRange: string,
): void {
  const containerRangeValues = getStartEndRange(containerRange);
  if (!containerRangeValues) {
    throw new Error(`range ${containerRange} is not valid. Must be in format <port>-<port> (e.g 8080-8085)`);
  }
  const startContainerRange = containerRangeValues.startRange;
  const endContainerRange = containerRangeValues.endRange;

  const hostRangeValues = getStartEndRange(hostRange);
  if (!hostRangeValues) {
    throw new Error(`range ${hostRange} is not valid. Must be in format <port>-<port> (e.g 8080-8085)`);
  }
  const startHostRange = hostRangeValues.startRange;
  const endHostRange = hostRangeValues.endRange;

  const containerRangeSize = endContainerRange + 1 - startContainerRange;
  const hostRangeSize = endHostRange + 1 - startHostRange;
  if (containerRangeSize !== hostRangeSize) {
    throw new Error(
      `host and container port ranges (${hostRange}:${containerRange}) have different lengths: ${hostRangeSize} vs ${containerRangeSize}`,
    );
  }

  for (let i = 0; i < containerRangeSize; i++) {
    portBindings[`${startContainerRange + i}`] = [{ HostPort: `${startHostRange + i}` }];
    exposedPorts[`${startContainerRange + i}`] = {};
  }
}

function getStartEndRange(range: string):
  | {
      startRange: number;
      endRange: number;
    }
  | undefined {
  if (range.endsWith('/tcp') || range.endsWith('/udp')) {
    range = range.substring(0, range.length - 4);
  }

  const rangeValues = range.split('-');
  if (rangeValues.length !== 2) {
    return undefined;
  }
  const startRange = parseInt(rangeValues[0]);
  const endRange = parseInt(rangeValues[1]);

  if (isNaN(startRange) || isNaN(endRange)) {
    return undefined;
  }
  return {
    startRange,
    endRange,
  };
}

function onContainerPortMappingInput(event: Event, index: number): void {
  onPortInput(event, options.basic.containerPortMapping[index]);
}

function onPortInput(event: Event, portInfo: PortInfo): void {
  clearTimeout(onPortInputTimeout);
  const target = event.currentTarget as HTMLInputElement;
  const _value: number = Number(target.value);
  onPortInputTimeout = setTimeout(() => {
    window
      .isFreePort(_value)
      .then(_ => {
        portInfo.error = '';
      })
      .catch((error: unknown) => {
        if (error && typeof error === 'object' && 'message' in error) {
          portInfo.error = (error as { message: string }).message;
        }
      });
  }, 500);
}
</script>

<Route path="/*">
  {#if dataReady}
    <EngineFormPage title="Create a container from image {imageDisplayName}:{image.tag}">
    {#snippet icon()}
      <i class="fas fa-play fa-2x" aria-hidden="true"></i>
    {/snippet}
    {#snippet content()}
    <div class="space-y-2">
        <div class="flex flex-row px-2 border-b border-[var(--pd-content-divider)]">
          <Tab title="Basic" selected={isTabSelected($router.path, 'basic')} url={getTabUrl($router.path, 'basic')} />
          <Tab
            title="Advanced"
            selected={isTabSelected($router.path, 'advanced')}
            url={getTabUrl($router.path, 'advanced')} />
          <Tab
            title="Networking"
            selected={isTabSelected($router.path, 'networking')}
            url={getTabUrl($router.path, 'networking')} />
          <Tab
            title="Security"
            selected={isTabSelected($router.path, 'security')}
            url={getTabUrl($router.path, 'security')} />
        </div>
        <div class="pt-4">
          <Route path="/basic" breadcrumb="Basic" navigationHint="tab">
            <BasicTab
              bind:options={options.basic}
              {containerNameError}
              {exposedPorts}
              {onContainerPortMappingInput} />
          </Route>
          <Route path="/advanced" breadcrumb="Advanced" navigationHint="tab">
            <AdvancedTab bind:options={options.advanced} />
          </Route>
          <Route path="/security" breadcrumb="Security" navigationHint="tab">
            <SecurityTab bind:options={options.security} />
          </Route>
          <Route path="/networking" breadcrumb="Networking" navigationHint="tab">
            <NetworkingTab bind:options={options.networking} {engineNetworks} {engineContainers} />
          </Route>
        </div>

      <div class="pt-4 pb-2">
        <div class="flex items-center justify-end gap-3">
          <Button
            type="link"
            on:click={(): void => router.goto('/images/')}
            aria-label="Cancel">
            Cancel
          </Button>
          <Button
            on:click={startContainer}
            icon={faPlay}
            aria-label="Start Container"
            disabled={invalidFields}>
            Start Container
          </Button>
        </div>
        <div aria-label="createError">
          {#if createError}
            <ErrorMessage class="py-2 text-sm" error={createError} />
          {/if}
        </div>
      </div>
    </div>
    {/snippet}
    </EngineFormPage>
  {/if}
</Route>
