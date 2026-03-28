<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import type { Component } from 'svelte';
import type { IconSize } from 'svelte-fa';

interface Props {
  icon: IconDefinition | Component | string;
  loading?: boolean;
  iconSize?: IconSize;
}

let { icon, loading = false, iconSize = undefined }: Props = $props();
</script>

<Icon size={iconSize} icon={icon} class={loading ? 'invisible' : ''}/>
{#if loading}
  <Spinner class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2"/>
{/if}
