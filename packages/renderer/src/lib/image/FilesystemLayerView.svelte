<script lang="ts">
import type { ImageFile, ImageFileSymlink } from '@podman-desktop/api';
import { SvelteMap } from 'svelte/reactivity';

import type { FilesystemNode } from '/@api/filesystem-tree';

import { ImageUtils } from './image-utils';

const expansionState = new SvelteMap<string, boolean>();

export let tree: FilesystemNode<ImageFile>;
export let margin = 0;
export let root = true;
export let layerMode = false;

$: label = tree.name;
$: children = tree?.children;
$: file = tree?.data;
$: colorClass = getColor(tree);
function getColor(tree: FilesystemNode<ImageFile>): string {
  if (tree.hidden) {
    return 'text-[var(--pd-files-hidden)]';
  }
  if (!tree.data) {
    if (tree.children.size) {
      return 'text-[var(--pd-files-directory)]';
    }
    return '';
  }
  if (tree.data.type === 'symlink') {
    return 'text-[var(--pd-files-symlink)]';
  }
  if (tree.data.type === 'directory') {
    return 'text-[var(--pd-files-directory)]';
  }
  if (isExec(tree.data)) {
    return 'text-[var(--pd-files-executable)]';
  }
  return '';
}
let expanded = false;
$: expanded = expansionState.get(label) ?? false;

const toggleExpansion = (): void => {
  expanded = !expanded;
  expansionState.set(label, expanded);
};
$: arrowDown = expanded;
function getLink(file: ImageFile | undefined): string {
  if (!file) {
    return '';
  }
  if (file.type === 'symlink') {
    return ' → ' + (file as ImageFileSymlink).linkPath;
  }
  return '';
}

function isExec(data: ImageFile): boolean {
  return (data.mode & 0o111) !== 0;
}

// SUID, SGID, and sticky bit: https://www.redhat.com/sysadmin/suid-sgid-sticky-bit
function modeString(data: ImageFile): string {
  return (
    (data.type === 'directory' ? 'd' : '-') +
    (data.mode & 0o400 ? 'r' : '-') +
    (data.mode & 0o200 ? 'w' : '-') +
    (data.mode & 0o4000 ? (data.mode & 0o100 ? 's' : 'S') : data.mode & 0o100 ? 'x' : '-') +
    (data.mode & 0o040 ? 'r' : '-') +
    (data.mode & 0o020 ? 'w' : '-') +
    (data.mode & 0o2000 ? (data.mode & 0o010 ? 's' : 'S') : data.mode & 0o010 ? 'x' : '-') +
    (data.mode & 0o004 ? 'r' : '-') +
    (data.mode & 0o002 ? 'w' : '-') +
    (data.mode & 0o1000 ? 't' : data.mode & 0o001 ? 'x' : '-')
  );
}
</script>

{#if layerMode || !tree.hidden}
  {#if root}
    {#if children}
      {#each children as [key, child] (key)}
        <svelte:self root={false} margin={margin + 0.5} tree={child} layerMode={layerMode} />
      {/each}
    {/if}
  {:else}
    <div class="font-mono">{tree.data && !tree.hidden ? modeString(tree.data) : ''}</div>
    <div class="text-right">{tree.data && !tree.hidden ? tree.data.uid + ':' + tree.data.gid : ''}</div>
    <span class="text-right">{!tree.hidden ? new ImageUtils().getHumanSize(tree.size) : ''}</span>
    {#if children?.size || (file && file.type === 'directory')}
      <button style="margin-left: {margin}rem" class={`text-left ${colorClass}`} on:click={toggleExpansion}>
        <span class="cursor-pointer inline-block mr-1" class:rotate-90={arrowDown}>&gt;</span>
        {label}<span class="text-[var(--pd-content-text)] opacity-70">{getLink(tree?.data)}</span>
      </button>
      {#if expanded && children}
        {#each children as [key, child] (key)}
          <svelte:self root={false} margin={margin + 0.5} tree={child} layerMode={layerMode} />
        {/each}
      {/if}
    {:else}
      <div class={`${colorClass}`}>
        <span style="margin-left: {margin}rem" class="pl-4"></span>
        {label}<span class="text-[var(--pd-content-text)] opacity-70">{getLink(tree?.data)}</span>
      </div>
    {/if}
  {/if}
{/if}
