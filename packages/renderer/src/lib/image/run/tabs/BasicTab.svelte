<script lang="ts">
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import type { ImageInspectInfo, OpenDialogOptions } from '@podman-desktop/api';
import { Button, Input } from '@podman-desktop/ui-svelte';

import type { PortInfo, RunOptions } from '/@/lib/image/run/run-options';
import FileInput from '/@/lib/ui/FileInput.svelte';
import { containersInfos } from '/@/stores/containers';

interface Props {
  // bindable
  options: RunOptions['basic'];
  valid: boolean;
  // data
  image: ImageInspectInfo;
  exposedPorts: string[];
}

// eslint-disable-next-line no-useless-assignment
let { options = $bindable(), valid = $bindable(), image, exposedPorts }: Props = $props();

let containerNameError: string | undefined = $derived.by(() => {
  // ok, now check if we already have a matching container: same name and same engine ID
  const containerAlreadyExists = $containersInfos.find(
    container =>
      container.engineId === image.engineId &&
      container.Names.some(iteratingContainerName => iteratingContainerName === `/${options.containerName}`),
  );
  if (containerAlreadyExists) {
    return `The name ${options.containerName} already exists. Please choose another name or leave blank to generate a name.`;
  } else {
    return undefined;
  }
});

let invalidPorts = $derived.by(() => {
  const invalidHostPorts = options.hostContainerPortMappings.filter(pair => pair.hostPort.error);
  const invalidContainerPortMapping = options.containerPortMapping?.filter(port => port.error) ?? [];
  return invalidHostPorts.length > 0 || invalidContainerPortMapping.length > 0;
});

$effect(() => {
  valid = !containerNameError && !invalidPorts;
});

function addVolumeMount(): void {
  options.volumeMounts = [...options.volumeMounts, { source: '', target: '' }];
}

function deleteVolumeMount(index: number): void {
  options.volumeMounts = options.volumeMounts.filter((_, i) => i !== index);
}

function addEnvVariable(): void {
  options.environmentVariables = [...options.environmentVariables, { key: '', value: '' }];
}

function deleteEnvVariable(index: number): void {
  options.environmentVariables = options.environmentVariables.filter((_, i) => i !== index);
}

function addEnvFile(): void {
  options.environmentFiles = [...options.environmentFiles, ''];
}

function deleteEnvFile(index: number): void {
  options.environmentFiles = options.environmentFiles.filter((_, i) => i !== index);
}

function addHostContainerPorts(): void {
  options.hostContainerPortMappings = [
    ...options.hostContainerPortMappings,
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
  options.hostContainerPortMappings = options.hostContainerPortMappings.filter((_, i) => i !== index);
}

function onHostContainerPortMappingInput(event: Event, index: number): void {
  onPortInput(event, options.hostContainerPortMappings[index].hostPort);
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

let onPortInputTimeout: NodeJS.Timeout;

function onContainerPortMappingInput(event: Event, index: number): void {
  onPortInput(event, options.containerPortMapping[index]);
}

const volumeDialogOptions: OpenDialogOptions = {
  title: 'Select a directory to mount in the container',
  selectors: ['openDirectory'],
};

const envDialogOptions: OpenDialogOptions = {
  title: 'Select environment file',
  selectors: ['openFile'],
};
</script>

<div class="pr-4">
  <label
    for="modalContainerName"
    class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]">Container name:</label>
  <Input
    bind:value={options.containerName}
    name="modalContainerName"
    id="modalContainerName"
    placeholder="Leave blank to generate a name"
    aria-label="Container Name"
    error={containerNameError} />
  <label
    for="modalEntrypoint"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Entrypoint:</label>
  <Input bind:value={options.entrypoint} name="modalEntrypoint" id="modalEntrypoint" aria-label="Entrypoint" />
  <label
    for="modalCommand"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]">Command:</label>
  <Input bind:value={options.command} name="modalCommand" id="modalCommand" aria-label="Command" />
  <label for="volumes" class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Volumes:</label>
  {#each options.volumeMounts as volumeMount, index (index)}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <FileInput
        id="volumeMount.{index}"
        placeholder="Path on the host"
        bind:value={volumeMount.source}
        options={volumeDialogOptions}
        aria-label="volumeMount.{index}" />
      <Input bind:value={volumeMount.target} placeholder="Path inside the container" class="ml-2" />
      <Button
        type="link"
        hidden={index === options.volumeMounts.length - 1}
        aria-label="Delete volume mount at index {index}"
        on:click={(): void => deleteVolumeMount(index)}
        icon={faMinusCircle} />
      <Button
        type="link"
        hidden={index < options.volumeMounts.length - 1}
        aria-label="Add volume mount after index {index}"
        on:click={addVolumeMount}
        icon={faPlusCircle} />
    </div>
  {/each}

  <label
    for="modalContainerName"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Port mapping:</label>
  {#each exposedPorts as port, index (index)}
    <div class="flex flex-row justify-center items-center w-full">
      <span
        class="text-sm flex-1 inline-block align-middle whitespace-nowrap text-[var(--pd-content-card-text)]"
        >Local port for {port}:</span>
      <Input
        bind:value={options.containerPortMapping[index].port}
        on:input={(event): void => onContainerPortMappingInput(event, index)}
        placeholder="Enter value for port {port}"
        error={options.containerPortMapping[index].error}
        class="ml-2 w-full"
        title={options.containerPortMapping[index].error} />
    </div>
  {/each}

  <Button
    on:click={addHostContainerPorts}
    icon={faPlusCircle}
    type="link"
    aria-label="Add custom port mapping">
    Add custom port mapping
  </Button>
  {#each options.hostContainerPortMappings as hostContainerPortMapping, index (index)}
    <div class="flex flex-row justify-center w-full py-1">
      <Input
        bind:value={hostContainerPortMapping.hostPort.port}
        on:input={(event): void => onHostContainerPortMappingInput(event, index)}
        aria-label="host port"
        placeholder="Host Port"
        error={hostContainerPortMapping.hostPort.error}
        title={hostContainerPortMapping.hostPort.error} />
      <Input
        bind:value={hostContainerPortMapping.containerPort}
        aria-label="container port"
        placeholder="Container Port"
        class="ml-2" />
      <Button type="link" on:click={async (): Promise<void> => await deleteHostContainerPorts(index)} icon={faMinusCircle} aria-label="Remove port mapping" />
    </div>
  {/each}
  <label
    for="modalEnvironmentVariables"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Environment variables:</label>
  {#each options.environmentVariables as environmentVariable, index (index)}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <Input bind:value={environmentVariable.key} placeholder="Name" class="w-full" />

      <Input
        bind:value={environmentVariable.value}
        placeholder="Value (leave blank for empty)"
        class="ml-2" />
      <Button
        type="link"
        hidden={index === options.environmentVariables.length - 1}
        aria-label="Delete environment variable at index {index}"
        on:click={(): void => deleteEnvVariable(index)}
        icon={faMinusCircle} />
      <Button
        type="link"
        hidden={index < options.environmentVariables.length - 1}
        aria-label="Add environment variable after index {index}"
        on:click={addEnvVariable}
        icon={faPlusCircle} />
    </div>
  {/each}

  <label
    for="modalEnvironmentFiles"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Environment files:</label>
  {#each options.environmentFiles as _, index (index)}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <FileInput
        id="filePath.{index}"
        placeholder="Environment file containing KEY=VALUE items"
        bind:value={options.environmentFiles[index]}
        options={envDialogOptions}
        aria-label="environmentFile.{index}" />
      <Button
        type="link"
        hidden={index === options.environmentFiles.length - 1}
        aria-label="Delete env file at index {index}"
        on:click={(): void => deleteEnvFile(index)}
        icon={faMinusCircle} />
      <Button
        type="link"
        hidden={index < options.environmentFiles.length - 1}
        aria-label="Add env file after index {index}"
        on:click={addEnvFile}
        icon={faPlusCircle} />
    </div>
  {/each}
</div>
