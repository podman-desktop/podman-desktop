<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { Component } from 'svelte';
import { Fa, type IconSize } from 'svelte-fa';

import { isFontAwesomeIcon, isFontAwesomeSize, isThemedIconImage } from '../utils/icon-utils';
import type { ThemedIconImage } from './Icon';

interface Props {
  icon: IconDefinition | Component | string | ThemedIconImage;
  size?: IconSize | number | string;
  class?: string;
  title?: string;
  ariaHidden?: boolean;
}

let { icon, size, class: className, title, ariaHidden }: Props = $props();

const role = $derived(ariaHidden ? undefined : 'img');
const ariaHiddenAttr = $derived(ariaHidden ? 'true' : undefined);
const IconComponent = icon;
const sizeStyle = $derived(typeof size === 'number' ? `width: ${size}px; height: ${size}px;` : '');

const themedImageSrc = $derived(
  isThemedIconImage(icon) ? (document.documentElement.classList.contains('dark') ? icon.dark : icon.light) : undefined,
);
</script>


{#if isFontAwesomeIcon(icon)}
    {#if typeof size === 'undefined' || isFontAwesomeSize(size)}
        <Fa {icon} {size} class={className} title={ariaHidden ? undefined : title}/>
    {/if}
{:else if typeof icon === 'string'}
    <!-- fas fa- and far fa- and fab fa- for Font awesome icons -->
    <!-- -icon for extension icons e.g. 'kind-icon' -->
    {#if icon.startsWith('fas fa-') || icon.startsWith('far fa-') || icon.startsWith('fab fa-') || icon.endsWith('-icon')}
        <span class={`${icon} ${size} ${className}`} role={role} aria-hidden={ariaHiddenAttr} {title}></span>
    {:else if icon.startsWith('data:image/')}
        <img src={icon} alt={ariaHidden ? '' : (title ?? '')} {title} role={role} aria-hidden={ariaHiddenAttr} class={className} style={sizeStyle} />
    {/if}
{:else if themedImageSrc}
    <img src={themedImageSrc} alt={ariaHidden ? '' : (title ?? '')} {title} role={role} aria-hidden={ariaHiddenAttr} class={className} style={sizeStyle} />
{:else}
    {#if IconComponent && typeof IconComponent !== 'string' && !isFontAwesomeIcon(IconComponent) && !isThemedIconImage(IconComponent)}
        <span role={role} aria-hidden={ariaHiddenAttr} {title}><IconComponent class={className} {size}/></span>
    {/if}
{/if}
