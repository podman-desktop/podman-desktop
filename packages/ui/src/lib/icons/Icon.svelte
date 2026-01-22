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
    <!-- fas fa- and far fa- and fab fa- for Font awesome icons -->
    <!-- -icon for extension icons e.g. 'kind-icon' -->
    {#if icon.startsWith('fas fa-') || icon.startsWith('far fa-') || icon.startsWith('fab fa-') || icon.endsWith('-icon')}
        <span class={`${icon} ${size} ${className} flex flex-row`} {role} {title}></span>
    {:else if icon.startsWith('data:image/')}
        <img src={icon} alt={title ?? ''} {title} {role} class={`${className} flex flex-row`} style={typeof size === 'number' ? `width: ${size}px; height: ${size}px;` : ''} />
    {/if}
{:else}
    {#if IconComponent && typeof IconComponent !== 'string' && !isFontAwesomeIcon(IconComponent)}
        <span {role} {title}><IconComponent class={`${className} flex flex-row`} {size}/></span>
    {/if}
{/if}
