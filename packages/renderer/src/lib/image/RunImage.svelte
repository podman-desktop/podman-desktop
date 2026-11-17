<script lang="ts">
import type {
  ContainerCreateOptions,
  DeviceMapping,
  HostConfig,
  HostConfigPortBinding,
  ImageInspectInfo,
  NetworkInspectInfo,
  SecretInfo,
} from '@desktop-framework/api';
import { NavigationPage } from '@desktop-framework/api';
import type { ImageInfo, OpenDialogOptions } from '@desktop-framework/extension-api';
import { faMinusCircle, faPlay, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  ButtonRow,
  Checkbox,
  Dropdown,
  ErrorMessage,
  Input,
  NumberInput,
  Tab,
} from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import { ContainerUtils } from '/@/lib/container/container-utils';
import type { ContainerInfoUI } from '/@/lib/container/ContainerInfoUI';
import { t } from '/@/lib/i18n/translations.svelte';
import { ImageUtils } from '/@/lib/image/image-utils';
import type { ImageInfoUI } from '/@/lib/image/ImageInfoUI';
import type { PortInfo, RunOptions } from '/@/lib/image/run/run-options';
import { splitSpacesHandlingDoubleQuotes } from '/@/lib/string/string';
import { array2String } from '/@/lib/string/string.js';
import EngineFormPage from '/@/lib/ui/EngineFormPage.svelte';
import FileInput from '/@/lib/ui/FileInput.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import { handleNavigation } from '/@/navigation';
import Route from '/@/Route.svelte';
import { containersInfos } from '/@/stores/containers';
import { imagesInfos } from '/@/stores/images';
import { secretsInfo } from '/@/stores/secrets';
import { volumeListInfos } from '/@/stores/volumes';

interface Props {
  imageID: string;
  engineId: string;
  base64RepoTag: string;
}

let { imageID, engineId, base64RepoTag }: Props = $props();

const imageUtils = new ImageUtils();

let imageInfo: ImageInfo | undefined = $derived($imagesInfos.find(c => c.Id === imageID && c.engineId === engineId));
let image: ImageInfoUI | undefined = $derived(
  imageInfo ? imageUtils.getImageInfoUI(imageInfo, base64RepoTag, $containersInfos) : undefined,
);

let options: RunOptions = $state({
  basic: {
    containerName: '',
    entrypoint: '',
    command: '',
    volumeMounts: [{ sourceType: 'bind', source: '', target: '' }],
    environmentVariables: [{ key: '', value: '' }],
    environmentFiles: [''],
    hostContainerPortMappings: [],
    containerPortMapping: [],
    secretMappings: [],
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

let secrets: Array<SecretInfo> = $derived($secretsInfo.filter(secret => secret.engineId === imageInspectInfo.engineId));

let containerNameError: string | undefined = $derived.by(() => {
  // ok, now check if we already have a matching container: same name and same engine ID
  const containerAlreadyExists = $containersInfos.find(
    container =>
      container.engineId === imageInspectInfo.engineId &&
      // `names` keeps the raw aliases with their leading slash; `name` is a single
      // compose-stripped string and cannot answer a multi-alias match
      container.names.some(iteratingContainerName => iteratingContainerName === `/${options.basic.containerName}`),
  );
  if (containerAlreadyExists) {
    return (
      t('resources.container-name-exists', { name: options.basic.containerName }) ??
      `The name ${options.basic.containerName} already exists. Please choose another name or leave blank to generate a name.`
    );
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

const volumeSourceTypeOptions = $derived([
  { value: 'bind', label: t('resources.host-path') ?? 'Host path' },
  { value: 'volume', label: t('resources.existing-volume') ?? 'Existing volume' },
]);

let existingVolumeOptions = $derived([
  { value: '', label: t('resources.select-a-volume') ?? 'Select a volume' },
  ...$volumeListInfos
    .filter(volume => volume.engineId === imageInspectInfo?.engineId)
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map(volume => ({
      value: volume.name,
      label: volume.shortName,
    })),
]);

function changeVolumeSourceType(index: number, sourceType: string): void {
  if (sourceType !== 'bind' && sourceType !== 'volume') {
    return;
  }
  const volumeMount = options.basic.volumeMounts[index];
  if (!volumeMount || volumeMount.sourceType === sourceType) {
    return;
  }
  volumeMount.sourceType = sourceType;
  volumeMount.source = '';
}

onMount(async () => {
  if (!image) {
    // go back to image list
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

  // grab all networks
  const allNetworks = await window.listNetworks();
  // keep only the network matching our engine
  engineNetworks = allNetworks.filter(network => network.engineId === image.engineId);

  if (engineNetworks.length > 0) {
    // try to match the bridge network
    const bridgeNetwork = engineNetworks.find(network => network.Name === 'bridge');
    if (bridgeNetwork) {
      options.networking.networkingModeUserNetwork = bridgeNetwork.Id;
    } else {
      // fallback to the first network
      options.networking.networkingModeUserNetwork = engineNetworks[0].Id;
    }
  }

  // grab all containers
  const allContainers = await window.listContainers();
  const containerUtils = new ContainerUtils();
  // keep only the containers matching our engine
  engineContainers = allContainers
    .filter(container => container.engineId === image.engineId)
    .map(container => containerUtils.getContainerInfoUI(container));

  if (engineContainers.length > 0) {
    // do we have a Running container ?
    // sort from newest to oldest
    const runningContainers = engineContainers
      .filter(container => container.state === 'RUNNING')
      .toSorted((a, b) => b.created - a.created);
    if (runningContainers.length > 0) {
      // use the first running container
      options.networking.networkingModeUserContainer = runningContainers[0].id;
    } else {
      // fallback to the first container
      options.networking.networkingModeUserContainer = engineContainers[0].id;
    }
  }
});

async function getPortsInfo(portDescriptor: string): Promise<string | undefined> {
  // check if portDescriptor is a range of ports
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

/**
 * return a range of the same length as portDescriptor containing free ports
 * undefined if the portDescriptor range is not valid
 * e.g 5000:5001 -> 9000:9001
 */
async function getPortRange(portDescriptor: string): Promise<string | undefined> {
  const rangeValues = getStartEndRange(portDescriptor);
  if (!rangeValues) {
    return Promise.resolve(undefined);
  }

  const rangeSize = rangeValues.endRange + 1 - rangeValues.startRange;
  try {
    // if free port range fails, return undefined
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
  // invalid port
  if (isNaN(port)) {
    return Promise.resolve(undefined);
  }
  try {
    // if getFreePort fails, it returns undefined
    return await window.getFreePort(port);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

function buildCreateOptions(): ContainerCreateOptions | undefined {
  if (!image) return undefined;

  createError = undefined;
  // create ExposedPorts objects
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
    return undefined;
  }

  const Env = options.basic.environmentVariables
    // filter variables withouts keys
    .filter(env => env.key)
    // no value, use empty string
    .map(env => `${env.key}=${env.value ?? ''}`);

  // filter empty files
  const EnvFiles = options.basic.environmentFiles.filter(env => env);

  const Image = image.tag ? `${image.name}:${image.tag}` : image.id;

  const RestartPolicy: { Name: string; MaximumRetryCount?: number } = {
    Name: options.advanced.restartPolicyName,
  };

  // only set MaximumRetryCount if policy is 'on-failure'
  if (options.advanced.restartPolicyName === 'on-failure') {
    RestartPolicy.MaximumRetryCount = options.advanced.restartPolicyMaxRetryCount;
  }

  // need both source and target to be set
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
    Secrets: options.basic.secretMappings
      .filter(({ type }) => type === 'mount')
      .map(({ name, target }) => ({
        Source: name,
        Target: target,
      })),
    SecretEnv: Object.fromEntries(
      options.basic.secretMappings.filter(({ type }) => type === 'env').map(({ name, target }) => [target, name]),
    ),
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

  return createOptions;
}

async function submitContainer(start: boolean): Promise<void> {
  const createOptions = buildCreateOptions();
  if (!createOptions) return;

  createOptions.start = start;

  try {
    const data = await window.createAndStartContainer(imageInspectInfo.engineId, createOptions);

    if (start && createOptions.Tty && createOptions.OpenStdin) {
      handleNavigation({
        page: NavigationPage.CONTAINER_TTY,
        parameters: {
          id: data.id,
        },
      });
    } else if (start) {
      handleNavigation({ page: NavigationPage.CONTAINERS });
    } else {
      handleNavigation({
        page: NavigationPage.CONTAINER_SUMMARY,
        parameters: {
          id: data.id,
        },
      });
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
    throw new Error(
      t('resources.portRange.invalid', { range: containerRange }) ??
        `range ${containerRange} is not valid. Must be in format <port>-<port> (e.g 8080-8085)`,
    );
  }
  const startContainerRange = containerRangeValues.startRange;
  const endContainerRange = containerRangeValues.endRange;

  const hostRangeValues = getStartEndRange(hostRange);
  if (!hostRangeValues) {
    throw new Error(
      t('resources.portRange.invalid', { range: hostRange }) ??
        `range ${hostRange} is not valid. Must be in format <port>-<port> (e.g 8080-8085)`,
    );
  }
  const startHostRange = hostRangeValues.startRange;
  const endHostRange = hostRangeValues.endRange;

  // if the two ranges have different size, do not proceed
  const containerRangeSize = endContainerRange + 1 - startContainerRange;
  const hostRangeSize = endHostRange + 1 - startHostRange;
  if (containerRangeSize !== hostRangeSize) {
    throw new Error(
      t('resources.portRange.differentLengths', { hostRange, containerRange, hostRangeSize, containerRangeSize }) ??
        `host and container port ranges (${hostRange}:${containerRange}) have different lengths: ${hostRangeSize} vs ${containerRangeSize}`,
    );
  }

  // we add all ports separately - if we have two ranges like 8080-8082 and 9000-9002 we'll end up with a mapping like
  // 8080 => HostPort: 9000
  // 8081 => HostPort: 9001
  // 8082 => HostPort: 9002
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

function addEnvVariable(): void {
  options.basic.environmentVariables = [...options.basic.environmentVariables, { key: '', value: '' }];
}

function deleteEnvVariable(index: number): void {
  options.basic.environmentVariables = options.basic.environmentVariables.filter((_, i) => i !== index);
}

function addEnvFile(): void {
  options.basic.environmentFiles = [...options.basic.environmentFiles, ''];
}

function deleteEnvFile(index: number): void {
  options.basic.environmentFiles = options.basic.environmentFiles.filter((_, i) => i !== index);
}

function addHostContainerPorts(): void {
  options.basic.hostContainerPortMappings = [
    ...options.basic.hostContainerPortMappings,
    {
      hostPort: {
        port: '',
        error: '',
      },
      containerPort: '',
    },
  ];
}

async function deleteHostContainerPorts(index: number): Promise<void> {
  options.basic.hostContainerPortMappings = options.basic.hostContainerPortMappings.filter((_, i) => i !== index);
}

function addVolumeMount(): void {
  options.basic.volumeMounts = [...options.basic.volumeMounts, { sourceType: 'bind', source: '', target: '' }];
}

function deleteVolumeMount(index: number): void {
  options.basic.volumeMounts = options.basic.volumeMounts.filter((_, i) => i !== index);
}

function deleteSecurityOpt(index: number): void {
  options.security.securityOpts = options.security.securityOpts.filter((_, i) => i !== index);
}

function addSecurityOpt(): void {
  options.security.securityOpts = [...options.security.securityOpts, ''];
}

function addCapAdd(): void {
  options.security.capAdds = [...options.security.capAdds, ''];
}
function addCapDrop(): void {
  options.security.capDrops = [...options.security.capDrops, ''];
}

function deleteCapAdd(index: number): void {
  options.security.capAdds = options.security.capAdds.filter((_, i) => i !== index);
}

function deleteCappDrop(index: number): void {
  options.security.capDrops = options.security.capDrops.filter((_, i) => i !== index);
}

function addDnsServer(): void {
  options.networking.dnsServers = [...options.networking.dnsServers, ''];
}

function deleteDnsServer(index: number): void {
  options.networking.dnsServers = options.networking.dnsServers.filter((_, i) => i !== index);
}

function addExtraHost(): void {
  options.networking.extraHosts = [...options.networking.extraHosts, { host: '', ip: '' }];
}

function deleteExtraHost(index: number): void {
  options.networking.extraHosts = options.networking.extraHosts.filter((_, i) => i !== index);
}

function addDevice(): void {
  options.advanced.devices = [
    ...options.advanced.devices,
    { host: '', container: '', read: false, write: false, mknod: false },
  ];
}

function deleteDevice(index: number): void {
  options.advanced.devices = options.advanced.devices.filter((_, i) => i !== index);
}

function onContainerPortMappingInput(event: Event, index: number): void {
  onPortInput(event, options.basic.containerPortMapping[index]);
}

function onHostContainerPortMappingInput(event: Event, index: number): void {
  onPortInput(event, options.basic.hostContainerPortMappings[index].hostPort);
}

function onPortInput(event: Event, portInfo: PortInfo): void {
  // clear the timeout so if there was an old call to areAllPortsFree pending is deleted. We will create a new one soon
  clearTimeout(onPortInputTimeout);
  const target = event.currentTarget as HTMLInputElement;
  // convert string to number
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

function addSecretMapping(): void {
  if (secrets.length === 0) {
    return;
  }

  options.basic.secretMappings.push({
    name: secrets[0].Name,
    target: '',
    type: 'mount',
  });
}

function removeSecretMapping(index: number): void {
  options.basic.secretMappings.splice(index, 1);
}

const volumeDialogOptions: OpenDialogOptions = {
  title: t('resources.select-a-directory-to-mount-in-the-container') ?? 'Select a directory to mount in the container',
  selectors: ['openDirectory'],
};

const envDialogOptions: OpenDialogOptions = {
  title: t('resources.select-environment-file') ?? 'Select environment file',
  selectors: ['openFile'],
};
</script>

<Route path="/*">
  {#if dataReady && image}
    <EngineFormPage title={t('resources.create-a-container-from-image-imagedisplayname-tag', { imageDisplayName: imageDisplayName, tag: image.tag }) ?? `Create a container from image ${imageDisplayName}:${image.tag}`}>
    {#snippet icon()}
      <i class="fas fa-play fa-2x" aria-hidden="true"></i>
    {/snippet}
    {#snippet content()}
    <div class="space-y-2">
        <div class="flex flex-row px-2 border-b border-[var(--pd-content-divider)]">
          <Tab title={t('resources.basic') ?? 'Basic'} selected={isTabSelected($router.path, 'basic')} url={getTabUrl($router.path, 'basic')} />
          <Tab
            title={t('resources.advanced') ?? 'Advanced'}
            selected={isTabSelected($router.path, 'advanced')}
            url={getTabUrl($router.path, 'advanced')} />
          <Tab
            title={t('resources.networking') ?? 'Networking'}
            selected={isTabSelected($router.path, 'networking')}
            url={getTabUrl($router.path, 'networking')} />
          <Tab
            title={t('resources.security') ?? 'Security'}
            selected={isTabSelected($router.path, 'security')}
            url={getTabUrl($router.path, 'security')} />
        </div>
        <div class="pt-4">
          <Route path="/basic" breadcrumb={t('resources.basic') ?? 'Basic'} navigationHint="tab">
            <div class="pr-4">
              <label
                for="modalContainerName"
                class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]">{t('resources.container-name') ?? 'Container name:'}</label>
              <Input
                bind:value={options.basic.containerName}
                name="modalContainerName"
                id="modalContainerName"
                placeholder={t('resources.leave-blank-to-generate-a-name') ?? 'Leave blank to generate a name'}
                aria-label={t('resources.container-name') ?? 'Container Name'}
                error={containerNameError} />
              <label
                for="modalEntrypoint"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.entrypoint') ?? 'Entrypoint:'}</label>
              <Input bind:value={options.basic.entrypoint} name="modalEntrypoint" id="modalEntrypoint" aria-label={t('resources.entrypoint') ?? 'Entrypoint'} />
              <label
                for="modalCommand"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]">{t('resources.command') ?? 'Command:'}</label>
              <Input bind:value={options.basic.command} name="modalCommand" id="modalCommand" aria-label={t('resources.command') ?? 'Command'} />
              <label for="volumes" class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.volumes') ?? 'Volumes:'}</label>
              <!-- Display the list of volumes -->
              {#each options.basic.volumeMounts as volumeMount, index (index)}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <div class="w-32 shrink-0">
                    <Dropdown
                      ariaLabel={t('resources.volume-source-type-index', { index: index }) ?? `Volume source type ${index}`}
                      options={volumeSourceTypeOptions}
                      bind:value={volumeMount.sourceType}
                      onChange={changeVolumeSourceType.bind(undefined, index)} />
                  </div>
                  <div class="flex-1 ml-2 min-w-0">
                    {#if volumeMount.sourceType === 'bind'}
                      <FileInput
                        id="volumeMount.{index}"
                        placeholder={t('resources.path-on-the-host') ?? 'Path on the host'}
                        bind:value={volumeMount.source}
                        options={volumeDialogOptions}
                        aria-label={t('resources.host-path-index', { index: index }) ?? `Host path ${index}`} />
                    {:else}
                      <Dropdown
                        class="w-full"
                        ariaLabel={t('resources.existing-volume-index', { index: index }) ?? `Existing volume ${index}`}
                        options={existingVolumeOptions}
                        bind:value={volumeMount.source} />
                    {/if}
                  </div>
                  <div class="flex-1 ml-2 min-w-0">
                    <Input
                      bind:value={volumeMount.target}
                      placeholder={t('resources.path-inside-the-container') ?? 'Path inside the container'}
                      aria-label={t('resources.path-inside-the-container-index', { index: index }) ?? `Path inside the container ${index}`} />
                  </div>
                  <Button
                    type="link"
                    hidden={index === options.basic.volumeMounts.length - 1}
                    aria-label={t('resources.delete-volume-mount-at-index-index', { index: index }) ?? `Delete volume mount at index ${index}`}
                    on:click={(): void => deleteVolumeMount(index)}
                    icon={faMinusCircle} />
                  <Button
                    type="link"
                    hidden={index < options.basic.volumeMounts.length - 1}
                    aria-label={t('resources.add-volume-mount-after-index-index', { index: index }) ?? `Add volume mount after index ${index}`}
                    on:click={addVolumeMount}
                    icon={faPlusCircle} />
                </div>
              {/each}

              <!-- add a label for each port-->
              <label
                for="modalContainerName"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.port-mapping') ?? 'Port mapping:'}</label>
              {#each exposedPorts as port, index (index)}
                <div class="flex flex-row justify-center items-center w-full">
                  <span
                    class="text-sm flex-1 inline-block align-middle whitespace-nowrap text-[var(--pd-content-card-text)]"
                    >{t('resources.local-port-for', { port }) ?? `Local port for ${port}:`}</span>
                  <Input
                    bind:value={options.basic.containerPortMapping[index].port}
                    on:input={(event): void => onContainerPortMappingInput(event, index)}
                    placeholder={t('resources.enter-value-for-port-port', { port: port }) ?? `Enter value for port ${port}`}
                    error={options.basic.containerPortMapping[index].error}
                    class="ml-2 w-full"
                    title={options.basic.containerPortMapping[index].error} />
                </div>
              {/each}

              <Button
                on:click={addHostContainerPorts}
                icon={faPlusCircle}
                type="link"
                aria-label={t('resources.add-custom-port-mapping') ?? 'Add custom port mapping'}>
                {t('resources.add-custom-port-mapping') ?? 'Add custom port mapping'}
              </Button>
              <!-- Display the list of existing hostContainerPortMappings -->
              {#each options.basic.hostContainerPortMappings as hostContainerPortMapping, index (index)}
                <div class="flex flex-row justify-center w-full py-1">
                  <Input
                    bind:value={hostContainerPortMapping.hostPort.port}
                    on:input={(event): void => onHostContainerPortMappingInput(event, index)}
                    aria-label={t('resources.host-port') ?? 'host port'}
                    placeholder={t('resources.host-port') ?? 'Host Port'}
                    error={hostContainerPortMapping.hostPort.error}
                    title={hostContainerPortMapping.hostPort.error} />
                  <Input
                    bind:value={hostContainerPortMapping.containerPort}
                    aria-label={t('resources.container-port') ?? 'container port'}
                    placeholder={t('resources.container-port') ?? 'Container Port'}
                    class="ml-2" />
                  <Button type="link" on:click={async (): Promise<void> => await deleteHostContainerPorts(index)} icon={faMinusCircle} aria-label={t('resources.remove-port-mapping') ?? 'Remove port mapping'} />
                </div>
              {/each}
              <label
                for="modalEnvironmentVariables"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.environment-variables') ?? 'Environment variables:'}</label>
              <!-- Display the list of existing environment variables -->
              {#each options.basic.environmentVariables as environmentVariable, index (index)}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <Input bind:value={environmentVariable.key} placeholder={t('resources.name') ?? 'Name'} class="w-full" />

                  <Input
                    bind:value={environmentVariable.value}
                    placeholder={t('resources.value-leave-blank-for-empty') ?? 'Value (leave blank for empty)'}
                    class="ml-2" />
                  <Button
                    type="link"
                    hidden={index === options.basic.environmentVariables.length - 1}
                    aria-label={t('resources.delete-environment-variable-at-index-index', { index: index }) ?? `Delete environment variable at index ${index}`}
                    on:click={(): void => deleteEnvVariable(index)}
                    icon={faMinusCircle} />
                  <Button
                    type="link"
                    hidden={index < options.basic.environmentVariables.length - 1}
                    aria-label={t('resources.add-environment-variable-after-index-index', { index: index }) ?? `Add environment variable after index ${index}`}
                    on:click={addEnvVariable}
                    icon={faPlusCircle} />
                </div>
              {/each}

              <label
                for="modalEnvironmentFiles"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.environment-files') ?? 'Environment files:'}</label>
              <!-- Display the list of existing environment files -->
              {#each options.basic.environmentFiles as _, index (index)}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <FileInput
                    id="filePath.{index}"
                    placeholder={t('resources.environment-file-containing-key-value-items') ?? 'Environment file containing KEY=VALUE items'}
                    bind:value={options.basic.environmentFiles[index]}
                    options={envDialogOptions}
                    aria-label="environmentFile.{index}" />
                  <Button
                    type="link"
                    hidden={index === options.basic.environmentFiles.length - 1}
                    aria-label={t('resources.delete-env-file-at-index-index', { index: index }) ?? `Delete env file at index ${index}`}
                    on:click={(): void => deleteEnvFile(index)}
                    icon={faMinusCircle} />
                  <Button
                    type="link"
                    hidden={index < options.basic.environmentFiles.length - 1}
                    aria-label={t('resources.add-env-file-after-index-index', { index: index }) ?? `Add env file after index ${index}`}
                    on:click={addEnvFile}
                    icon={faPlusCircle} />
                </div>
              {/each}

              {#if imageInspectInfo?.engineType === 'podman'}
                <label
                  for="secrets"
                  class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.secrets') ?? 'Secrets:'}</label>
                {#each options.basic.secretMappings as _, index (index)}
                  <div class="flex gap-x-2 flex-row justify-center items-center w-full py-1">
                    <Dropdown class="w-full" name="type" bind:value={options.basic.secretMappings[index].name}>
                      {#each secrets as secret (secret.Id)}
                        <option value={secret.Name}>{secret.Name}</option>
                      {/each}
                    </Dropdown>

                    <Dropdown class="w-fit" name="type" bind:value={options.basic.secretMappings[index].type}>
                      <option value="mount">{t('resources.mount') ?? 'Mount'}</option>
                      <option value="env">{t('resources.env') ?? 'Env'}</option>
                    </Dropdown>

                    <div class="w-full">
                      <Input
                        bind:value={options.basic.secretMappings[index].target}
                        placeholder={options.basic.secretMappings[index].type === 'mount' ? 'Path inside the container' : 'Name of the environment variable'} />
                    </div>

                    <div class="w-fit">
                      <Button
                        type="link"
                        aria-label={t('resources.remove-secret') ?? 'Remove secret'}
                        onclick={removeSecretMapping.bind(undefined, index)}
                        icon={faMinusCircle} />
                    </div>
                  </div>
                {/each}

                <Button
                  onclick={addSecretMapping}
                  icon={faPlusCircle}
                  disabled={secrets.length === 0}
                  type="link"
                  title={secrets.length === 0 ? (t('resources.no-secrets-available') ?? 'No secrets available') : ''}
                  aria-label={t('resources.add-secret-mapping') ?? 'Add secret mapping'}>
                  {t('resources.add-secret-mapping') ?? 'Add secret mapping'}
                </Button>
              {/if}
            </div>
          </Route>
          <Route path="/advanced" breadcrumb={t('resources.advanced') ?? 'Advanced'} navigationHint="tab">
            <div class="pr-4">
              <!-- Use tty -->
              <label for="containerTty" class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.use-tty') ?? 'Use TTY:'}</label>
              <div class="flex flex-col text-[var(--pd-content-card-text)] text-sm ml-2">
                <Checkbox bind:checked={options.advanced.useTty} title={t('resources.attach-a-pseudo-terminal') ?? 'Attach a pseudo terminal'}>{t('resources.attach-a-pseudo-terminal') ?? 'Attach a pseudo terminal'}</Checkbox>
                <Checkbox bind:checked={options.advanced.useInteractive} title={t('resources.use-interactive') ?? 'Use interactive'}>
                  {t('resources.interactive-keep-stdin-open-even-if-not-attached') ?? 'Interactive: Keep STDIN open even if not attached'}
                </Checkbox>
              </div>

              <!-- Specify user-->
              <label
                for="containerUser"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.specify-user-to-run-container-as') ?? 'Specify user to run container as:'}</label>
              <div class="flex flex-row justify-center items-center w-full">
                <Input
                  bind:value={options.advanced.runUser}
                  placeholder={t('resources.if-you-specify-a-username-user-must-exist-in-etc-passwd-file-use-user-id-instead') ?? 'If you specify a username, user must exist in /etc/passwd file (use user id instead)'}
                  class="ml-2" />
              </div>

              <!-- Autoremove-->
              <label
                for="containerAutoRemove"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.auto-removal-of-container') ?? 'Auto removal of container:'}</label>
              <Checkbox class="text-[var(--pd-content-card-text)] text-sm ml-2" bind:checked={options.advanced.autoRemove}>
                {t('resources.automatically-remove-the-container-when-the-process-exits') ?? 'Automatically remove the container when the process exits'}
              </Checkbox>

              <!-- RestartPolicy-->
              <label
                for="containerRestartPolicy"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.restart-policy') ?? 'Restart policy:'}</label>
              <div
                class="p-0 flex flex-row justify-start items-center align-middle w-full text-[var(--pd-content-card-text)]">
                <span class="text-sm w-28 inline-block align-middle whitespace-nowrap">{t('resources.policy-name') ?? 'Policy name:'}</span>

                <Dropdown class="w-full" name="restartPolicyName" bind:value={options.advanced.restartPolicyName}>
                  <option value="">{t('resources.no-restart') ?? 'No restart'}</option>
                  <option value="no">{t('resources.do-not-restart-automatically') ?? 'Do not restart automatically'}</option>
                  <option value="always">{t('resources.always-restart') ?? 'Always restart'}</option>
                  <option value="unless-stopped">{t('resources.restart-only-if-user-has-not-manually-stopped') ?? 'Restart only if user has not manually stopped'}</option>
                  <option value="on-failure">{t('resources.restart-only-if-exit-code-is-non-zero') ?? 'Restart only if exit code is non-zero'}</option>
                </Dropdown>
              </div>

              <div
                class="flex flex-row justify-center items-center w-full py-1 {options.advanced.restartPolicyName === 'on-failure'
                  ? 'opacity-100'
                  : 'opacity-20'}">
                <span
                  class="text-sm w-28 inline-block align-middle whitespace-nowrap text-[var(--pd-content-card-text)]"
                  title={t('resources.number-of-times-to-retry-before-giving-up') ?? 'Number of times to retry before giving up.'}>{t('resources.retries') ?? 'Retries:'}</span>
                <NumberInput
                  minimum={0}
                  bind:value={options.advanced.restartPolicyMaxRetryCount}
                  type="integer"
                  class="w-24 p-2"
                  disabled={options.advanced.restartPolicyName !== 'on-failure'} />
              </div>

              <!-- devices -->
              <label
                for="modalDevices"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]">{t('resources.devices') ?? 'Devices:'}</label>
              <!-- Display the list of existing devices -->
              {#each options.advanced.devices as device, index (index)}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <Input
                    bind:value={device.host}
                    placeholder={t('resources.host-device') ?? 'Host Device'}
                    class="w-full"
                    aria-label="device.host.{index}" />
                  <Input
                    bind:value={device.container}
                    placeholder={t('resources.container-device-leave-blank-for-same-as-host-device') ?? 'Container Device (leave blank for same as host device)'}
                    class="ml-2"
                    aria-label="device.container.{index}" />
                  <div class="flex flew-row space-x-4 ml-2 text-sm">
                    <Checkbox bind:checked={device.read} title={t('resources.read') ?? 'Read'}>{t('resources.read') ?? 'Read'}</Checkbox>
                    <Checkbox bind:checked={device.write} title={t('resources.write') ?? 'Write'}>{t('resources.write') ?? 'Write'}</Checkbox>
                    <Checkbox bind:checked={device.mknod} title="Mknod">Mknod</Checkbox>
                  </div>
                  <Button
                    type="link"
                    hidden={index === options.advanced.devices.length - 1}
                    aria-label={t('resources.delete-device-at-index-index', { index: index }) ?? `Delete device at index ${index}`}
                    on:click={(): void => deleteDevice(index)}
                    icon={faMinusCircle} />
                  <Button
                    type="link"
                    hidden={index < options.advanced.devices.length - 1}
                    aria-label={t('resources.add-device-after-index-index', { index: index }) ?? `Add device after index ${index}`}
                    on:click={addDevice}
                    icon={faPlusCircle} />
                </div>
              {/each}
            </div>
          </Route>

          <Route path="/security" breadcrumb={t('resources.security') ?? 'Security'} navigationHint="tab">
            <div class="pr-4">
              <!-- Privileged-->
              <label
                for="containerPrivileged"
                class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]">{t('resources.privileged') ?? 'Privileged:'}</label>
              <Checkbox bind:checked={options.security.privileged} class="text-[var(--pd-content-card-text)] text-sm mx-2">
                {t('resources.turn-off-security') ?? 'Turn off security'}<i class="pl-1 fas fa-exclamation-triangle"></i>
              </Checkbox>

              <!-- Read-Only -->
              <label
                for="containerReadOnly"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]">{t('resources.read-only') ?? 'Read only:'}</label>
              <Checkbox bind:checked={options.security.readOnly} class="text-[var(--pd-content-card-text)] text-sm mx-2">
                {t('resources.make-containers-root-filesystem-read-only') ?? 'Make containers root filesystem read-only'}
              </Checkbox>

              <label
                for="ContainerSecurityOptions"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.security-options-security-opt') ?? 'Security options (security-opt):'}</label>
              <!-- Display the list of existing security options -->
              {#each options.security.securityOpts as _, index (index)}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <Input
                    bind:value={options.security.securityOpts[index]}
                    placeholder={t('resources.enter-a-security-option-ex-seccomp-path-to-profile-json') ?? 'Enter a security option (Ex. seccomp=/path/to/profile.json)'}
                    class="ml-2" />

                  <Button
                    type="link"
                    hidden={index === options.security.securityOpts.length - 1}
                    aria-label={t('resources.delete-security-option-at-index-index', { index: index }) ?? `Delete security option at index ${index}`}
                    on:click={(): void => deleteSecurityOpt(index)}
                    icon={faMinusCircle} />
                  <Button
                    type="link"
                    hidden={index < options.security.securityOpts.length - 1}
                    aria-label={t('resources.add-security-option-after-index-index', { index: index }) ?? `Add security option after index ${index}`}
                    on:click={addSecurityOpt}
                    icon={faPlusCircle} />
                </div>
              {/each}

              <label
                for="ContainerSecurityCapabilitiesAdd"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.capabilities') ?? 'Capabilities:'}</label>

              <label
                for="ContainerSecurityCapabilitiesAdd"
                class="pl-4 pt-2 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.add-to-the-container-capadd') ?? 'Add to the container (CapAdd):'}</label>
              <!-- Display the list of existing capAdd -->
              {#each options.security.capAdds as _, index (index)}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <Input bind:value={options.security.capAdds[index]} placeholder={t('resources.enter-a-kernel-capability-ex-sys-admin') ?? 'Enter a kernel capability (Ex. SYS_ADMIN)'} class="ml-4" />

                  <Button
                    type="link"
                    hidden={index === options.security.capAdds.length - 1}
                    on:click={(): void => deleteCapAdd(index)}
                    icon={faMinusCircle}
                    aria-label={t('resources.remove-capability') ?? 'Remove capability'} />
                  <Button type="link" hidden={index < options.security.capAdds.length - 1} on:click={addCapAdd} icon={faPlusCircle} aria-label={t('resources.add-capability') ?? 'Add capability'} />
                </div>
              {/each}
              <label
                for="ContainerSecurityCapabilitiesDrop"
                class="pl-4 pt-2 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.drop-from-the-container-capdrop') ?? 'Drop from the container (CapDrop):'}</label>
              <!-- Display the list of existing capDrop -->
              {#each options.security.capDrops as _, index (index)}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <Input bind:value={options.security.capDrops[index]} placeholder={t('resources.enter-a-kernel-capability-ex-sys-admin') ?? 'Enter a kernel capability (Ex. SYS_ADMIN)'} class="ml-4" />

                  <Button
                    type="link"
                    hidden={index === options.security.capDrops.length - 1}
                    on:click={(): void => deleteCappDrop(index)}
                    icon={faMinusCircle}
                    aria-label={t('resources.remove-capability') ?? 'Remove capability'} />
                  <Button type="link" hidden={index < options.security.capDrops.length - 1} on:click={addCapDrop} icon={faPlusCircle} aria-label={t('resources.add-capability') ?? 'Add capability'} />
                </div>
              {/each}

              <!-- Specify user namespace-->
              <label
                for="containerUserNamespace"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.specify-user-namespace-to-use') ?? 'Specify user namespace to use:'}</label>
              <div class="flex flex-row justify-center items-center w-full">
                <Input bind:value={options.security.userNamespace} placeholder={t('resources.enter-a-user-namespace') ?? 'Enter a user namespace'} class="ml-2 w-full" />
              </div>
            </div>
          </Route>

          <Route path="/networking" breadcrumb={t('resources.networking') ?? 'Networking'} navigationHint="tab">
            <div class="pr-4">
              <!-- hostname-->
              <label
                for="containerHostname"
                class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.defines-container-hostname') ?? 'Defines container hostname:'}</label>
              <div class="flex flex-row justify-center items-center w-full">
                <Input bind:value={options.networking.hostname} placeholder={t('resources.must-be-a-valid-rfc-1123-hostname') ?? 'Must be a valid RFC 1123 hostname'} class="ml-2" />
              </div>

              <!-- DNS -->
              <label
                for="ContainerDns"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.custom-dns-server-s') ?? 'Custom DNS server(s):'}</label>

              {#each options.networking.dnsServers as _, index (index)}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <Input bind:value={options.networking.dnsServers[index]} placeholder={t('resources.ip-address') ?? 'IP Address'} class="ml-2" />

                  <Button
                    type="link"
                    hidden={index === options.networking.dnsServers.length - 1}
                    aria-label={t('resources.delete-dns-server-at-index-index', { index: index }) ?? `Delete DNS server at index ${index}`}
                    on:click={(): void => deleteDnsServer(index)}
                    icon={faMinusCircle} />
                  <Button
                    type="link"
                    hidden={index < options.networking.dnsServers.length - 1}
                    aria-label={t('resources.add-dns-server-after-index-index', { index: index }) ?? `Add DNS server after index ${index}`}
                    on:click={addDnsServer}
                    icon={faPlusCircle} />
                </div>
              {/each}

              <label
                for="containerExtraHosts"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.add-extra-hosts-appends-to-etc-hosts-file') ?? 'Add extra hosts (appends to /etc/hosts file):'}</label>
              <!-- Display the list of extra hosts -->
              {#each options.networking.extraHosts as extraHost, index (index)}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <Input bind:value={extraHost.host} placeholder={t('resources.hostname') ?? 'Hostname'} class="ml-2" />

                  <Input bind:value={extraHost.ip} placeholder={t('resources.ip-address') ?? 'IP Address'} class="ml-2" />
                  <Button
                    type="link"
                    hidden={index === options.networking.extraHosts.length - 1}
                    aria-label={t('resources.delete-extra-host-at-index-index', { index: index }) ?? `Delete extra host at index ${index}`}
                    on:click={(): void => deleteExtraHost(index)}
                    icon={faMinusCircle} />
                  <Button
                    type="link"
                    hidden={index < options.networking.extraHosts.length - 1}
                    aria-label={t('resources.add-extra-host-after-index-index', { index: index }) ?? `Add extra host after index ${index}`}
                    on:click={addExtraHost}
                    icon={faPlusCircle} />
                </div>
              {/each}

              <!-- Select network -->
              <label
                for="containerNetwork"
                class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
                >{t('resources.select-container-networking') ?? 'Select container networking:'}</label>
              <div
                class="p-0 flex flex-row justify-start items-center align-middle w-full text-[var(--pd-content-card-text)]">
                <span class="text-sm w-28 inline-block align-middle whitespace-nowrap">{t('resources.mode') ?? 'Mode:'}</span>

                <Dropdown class="w-full" name="providerChoice" bind:value={options.networking.networkingMode}>
                  <option value="bridge">{t('resources.creates-a-network-stack-on-the-default-bridge-default') ?? 'Creates a network stack on the default bridge (default)'}</option>
                  <option value="none">{t('resources.no-networking') ?? 'No networking'}</option>
                  <option value="host">{t('resources.use-the-host-networking-stack') ?? 'Use the host networking stack'}</option>
                  <option value="choice-container">{t('resources.use-another-container-networking-stack') ?? 'Use another container networking stack'}</option>
                  <!-- display only if there is at least one network-->
                  <option value="choice-network">{t('resources.user-defined-network') ?? 'User-defined network'}</option>
                </Dropdown>
              </div>

              {#if options.networking.networkingMode === 'choice-network'}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <span
                    class="text-sm w-28 inline-block align-middle whitespace-nowrap text-[var(--pd-content-card-text)]"
                    >{t('resources.network') ?? 'Network:'}</span>
                  <Dropdown
                    class="w-full"
                    disabled={options.networking.networkingMode !== 'choice-network'}
                    name="networkingModeUserNetwork"
                    bind:value={options.networking.networkingModeUserNetwork}>
                    {#each engineNetworks as network (network.Id)}
                      <option value={network.Id}
                        >{t('resources.network-used-by', { name: network.Name, count: Object.keys(network.Containers ?? {}).length }) ?? `${network.Name} (used by ${Object.keys(network.Containers ?? {}).length} containers)`}</option>
                    {/each}
                  </Dropdown>
                </div>
              {/if}
              {#if options.networking.networkingMode === 'choice-container'}
                <div class="flex flex-row justify-center items-center w-full py-1">
                  <span
                    class="text-sm w-28 inline-block align-middle whitespace-nowrap text-[var(--pd-content-card-text)]"
                    >{t('resources.container') ?? 'Container:'}</span>
                  <Dropdown
                    class="w-full"
                    disabled={options.networking.networkingMode !== 'choice-container'}
                    name="networkingModeUserContainer"
                    bind:value={options.networking.networkingModeUserContainer}>
                    {#each engineContainers as container (container.id)}
                      <option value={container.id}>{container.name} ({container.shortId})</option>
                    {/each}
                  </Dropdown>
                </div>
              {/if}
            </div>
          </Route>
        </div>

      <div class="pt-4 pb-2">
        <ButtonRow>
          <Button
            type="link"
            on:click={(): void => router.goto('/images/')}
            aria-label={t('resources.cancel') ?? 'Cancel'}>
            {t('resources.cancel') ?? 'Cancel'}
          </Button>
          <Button
            type="secondary"
            on:click={(): void => {submitContainer(false).catch((e: unknown) => console.error(e));}}
            aria-label={t('resources.create') ?? 'Create'}
            disabled={invalidFields}
            icon={faPlusCircle}>
            {t('resources.create') ?? 'Create'}
          </Button>
          <Button
            on:click={(): void => {submitContainer(true).catch((e: unknown) => console.error(e));}}
            icon={faPlay}
            aria-label={t('resources.create-and-start') ?? 'Create and start'}
            disabled={invalidFields}>
            {t('resources.create-and-start') ?? 'Create and start'}
          </Button>
        </ButtonRow>
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
