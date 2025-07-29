<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { Component } from 'svelte';
import { Fa, type IconSize } from 'svelte-fa';

import { isFontAwesomeIcon, isFontAwesomeSize } from '../utils/icon-utils';

interface Props {
  icon: IconDefinition | Component | string;
  size?: IconSize | number | string;
  class?: string;
  title?: string;
}

let { icon, size, class: className, title }: Props = $props();

const role = 'img';
const IconComponent = icon;
</script>


{#if isFontAwesomeIcon(icon)}
    {#if typeof size === 'undefined' || isFontAwesomeSize(size)}
        <Fa {icon} {size} class={className} {title}/>
    {/if}
{:else if typeof icon === 'string'}
    <!-- fas fa- and far fa- for Font awesome icons -->
    <!-- -icon for extension icons e.g. 'kind-icon' -->
    {#if icon.startsWith('fas fa-') || icon.startsWith('far fa-') || icon.endsWith('-icon')}
        <i class={`${icon} ${size} ${className}`} {role} {title}></i>
    {/if}
{:else}
    {#if IconComponent && typeof IconComponent !== 'string' && !isFontAwesomeIcon(IconComponent)}
        <span {role} {title}><IconComponent class={className} {size}/></span>
    {/if}
{/if}
