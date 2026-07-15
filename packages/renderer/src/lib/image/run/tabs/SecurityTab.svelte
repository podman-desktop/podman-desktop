<script lang="ts">
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, Input } from '@podman-desktop/ui-svelte';

import type { RunOptions } from '/@/lib/image/run/run-options';

interface Props {
  options: RunOptions['security'];
}

let { options = $bindable() }: Props = $props();

function deleteSecurityOpt(index: number): void {
  options.securityOpts = options.securityOpts.filter((_, i) => i !== index);
}

function addSecurityOpt(): void {
  options.securityOpts = [...options.securityOpts, ''];
}

function addCapAdd(): void {
  options.capAdds = [...options.capAdds, ''];
}

function addCapDrop(): void {
  options.capDrops = [...options.capDrops, ''];
}

function deleteCapAdd(index: number): void {
  options.capAdds = options.capAdds.filter((_, i) => i !== index);
}

function deleteCappDrop(index: number): void {
  options.capDrops = options.capDrops.filter((_, i) => i !== index);
}
</script>

<div class="pr-4">
  <label
    for="containerPrivileged"
    class="block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]">Privileged:</label>
  <Checkbox bind:checked={options.privileged} class="text-[var(--pd-content-card-text)] text-sm mx-2">
    Turn off security<i class="pl-1 fas fa-exclamation-triangle"></i>
  </Checkbox>

  <label
    for="containerReadOnly"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]">Read only:</label>
  <Checkbox bind:checked={options.readOnly} class="text-[var(--pd-content-card-text)] text-sm mx-2">
    Make containers root filesystem read-only
  </Checkbox>

  <label
    for="ContainerSecurityOptions"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Security options (security-opt):</label>
  {#each options.securityOpts as _, index (index)}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <Input
        bind:value={options.securityOpts[index]}
        placeholder="Enter a security option (Ex. seccomp=/path/to/profile.json)"
        class="ml-2" />

      <Button
        type="link"
        hidden={index === options.securityOpts.length - 1}
        aria-label="Delete security option at index {index}"
        on:click={(): void => deleteSecurityOpt(index)}
        icon={faMinusCircle} />
      <Button
        type="link"
        hidden={index < options.securityOpts.length - 1}
        aria-label="Add security option after index {index}"
        on:click={addSecurityOpt}
        icon={faPlusCircle} />
    </div>
  {/each}

  <label
    for="ContainerSecurityCapabilitiesAdd"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Capabilities:</label>

  <label
    for="ContainerSecurityCapabilitiesAdd"
    class="pl-4 pt-2 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Add to the container (CapAdd):</label>
  {#each options.capAdds as _, index (index)}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <Input bind:value={options.capAdds[index]} placeholder="Enter a kernel capability (Ex. SYS_ADMIN)" class="ml-4" />

      <Button
        type="link"
        hidden={index === options.capAdds.length - 1}
        on:click={(): void => deleteCapAdd(index)}
        icon={faMinusCircle}
        aria-label="Remove capability" />
      <Button type="link" hidden={index < options.capAdds.length - 1} on:click={addCapAdd} icon={faPlusCircle} aria-label="Add capability" />
    </div>
  {/each}
  <label
    for="ContainerSecurityCapabilitiesDrop"
    class="pl-4 pt-2 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Drop from the container (CapDrop):</label>
  {#each options.capDrops as _, index (index)}
    <div class="flex flex-row justify-center items-center w-full py-1">
      <Input bind:value={options.capDrops[index]} placeholder="Enter a kernel capability (Ex. SYS_ADMIN)" class="ml-4" />

      <Button
        type="link"
        hidden={index === options.capDrops.length - 1}
        on:click={(): void => deleteCappDrop(index)}
        icon={faMinusCircle}
        aria-label="Remove capability" />
      <Button type="link" hidden={index < options.capDrops.length - 1} on:click={addCapDrop} icon={faPlusCircle} aria-label="Add capability" />
    </div>
  {/each}

  <label
    for="containerUserNamespace"
    class="pt-4 block mb-2 text-sm font-medium text-[var(--pd-content-card-header-text)]"
    >Specify user namespace to use:</label>
  <div class="flex flex-row justify-center items-center w-full">
    <Input bind:value={options.userNamespace} placeholder="Enter a user namespace" class="ml-2 w-full" />
  </div>
</div>
