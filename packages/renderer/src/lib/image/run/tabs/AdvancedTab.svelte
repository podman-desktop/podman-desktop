<script lang="ts">
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, Dropdown, Input, NumberInput } from '@podman-desktop/ui-svelte';

import type { RunOptions } from '/@/lib/image/run/run-options';

interface Props {
  options: RunOptions['advanced'];
}

let { options = $bindable() }: Props = $props();

function addDevice(): void {
  options.devices = [...options.devices, { host: '', container: '', read: false, write: false, mknod: false }];
}

function deleteDevice(index: number): void {
  options.devices = options.devices.filter((_, i) => i !== index);
}
</script>

<div class="pr-4">
  <label for="containerTty" class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Use TTY:</label>
  <div class="flex flex-col text-[var(--pd-content-card-text)] text-sm ml-2">
    <Checkbox bind:checked={options.useTty} title="Attach a pseudo terminal">Attach a pseudo terminal</Checkbox>
    <Checkbox bind:checked={options.useInteractive} title="Use interactive">
      Interactive: Keep STDIN open even if not attached
    </Checkbox>
  </div>

  <label
    for="containerUser"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Specify user to run container as:</label>
  <div class="flex flex-row justify-center items-center w-full">
    <Input
      bind:value={options.runUser}
      placeholder="If you specify a username, user must exist in /etc/passwd file (use user id instead)"
      class="ml-2" />
  </div>

  <label
    for="containerAutoRemove"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Auto removal of container:</label>
  <Checkbox class="text-[var(--pd-content-card-text)] text-sm ml-2" bind:checked={options.autoRemove}>
    Automatically remove the container when the process exits
  </Checkbox>

  <label
    for="containerRestartPolicy"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Restart policy:</label>
  <div
    class="p-0 flex flex-row justify-start items-center align-middle w-full text-[var(--pd-content-card-text)]">
    <span class="text-sm w-28 inline-block align-middle whitespace-nowrap">Policy name:</span>

    <Dropdown class="w-full" name="restartPolicyName" bind:value={options.restartPolicyName}>
      <option value="">No restart</option>
      <option value="no">Do not restart automatically</option>
      <option value="always">Always restart</option>
      <option value="unless-stopped">Restart only if user has not manually stopped</option>
      <option value="on-failure">Restart only if exit code is non-zero</option>
    </Dropdown>
  </div>

  <div
    class="flex flex-row justify-center items-center w-full py-1 {options.restartPolicyName === 'on-failure'
      ? 'opacity-100'
      : 'opacity-20'}">
    <span
      class="text-sm w-28 inline-block align-middle whitespace-nowrap text-[var(--pd-content-card-text)]"
      title="Number of times to retry before giving up.">Retries:</span>
    <NumberInput
      minimum={0}
      bind:value={options.restartPolicyMaxRetryCount}
      type="integer"
      class="w-24 p-2"
      disabled={options.restartPolicyName !== 'on-failure'} />
  </div>

  <label
    for="modalDevices"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]">Devices:</label>
  {#each options.devices as device, index (index)}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <Input
        bind:value={device.host}
        placeholder="Host Device"
        class="w-full"
        aria-label="device.host.{index}" />
      <Input
        bind:value={device.container}
        placeholder="Container Device (leave blank for same as host device)"
        class="ml-2"
        aria-label="device.container.{index}" />
      <div class="flex flew-row space-x-4 ml-2 text-sm">
        <Checkbox bind:checked={device.read} title="Read">Read</Checkbox>
        <Checkbox bind:checked={device.write} title="Write">Write</Checkbox>
        <Checkbox bind:checked={device.mknod} title="Mknod">Mknod</Checkbox>
      </div>
      <Button
        type="link"
        hidden={index === options.devices.length - 1}
        aria-label="Delete device at index {index}"
        on:click={(): void => deleteDevice(index)}
        icon={faMinusCircle} />
      <Button
        type="link"
        hidden={index < options.devices.length - 1}
        aria-label="Add device after index {index}"
        on:click={addDevice}
        icon={faPlusCircle} />
    </div>
  {/each}
</div>
