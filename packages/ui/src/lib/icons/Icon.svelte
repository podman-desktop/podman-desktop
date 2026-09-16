<script lang="ts">
import { Fa, type IconSize } from 'svelte-fa';

import { isFontAwesomeIcon, isFontAwesomeSize, isThemedIconImage } from '../utils/icon-utils';
import type { IconType } from './Icon';

interface Props {
  icon: IconType;
  size?: IconSize | number | string;
  class?: string;
  title?: string;
  ariaHidden?: boolean;
}

let { icon, size, class: className, title, ariaHidden }: Props = $props();

const role = $derived(ariaHidden ? undefined : 'img');
const ariaHiddenAttr = $derived(ariaHidden ? 'true' : undefined);
const alt = $derived(ariaHidden ? '' : (title ?? ''));
const sizeStyle = $derived(typeof size === 'number' ? `width: ${size}px; height: ${size}px;` : '');
const IconComponent = $derived(
  typeof icon !== 'string' && !isFontAwesomeIcon(icon) && !isThemedIconImage(icon) ? icon : undefined,
);
</script>


{#if isFontAwesomeIcon(icon)}
    {#if typeof size === 'undefined' || isFontAwesomeSize(size)}
        <Fa {icon} {size} class={className} title={ariaHidden ? undefined : title}/>
    {/if}
{:else if typeof icon === 'string'}
    <!-- fas fa- / far fa- / fab fa- Font Awesome classes, or extension CSS icons e.g. kind-icon -->
    {#if icon.startsWith('fas fa-') || icon.startsWith('far fa-') || icon.startsWith('fab fa-') || icon.endsWith('-icon')}
        <span class={`${icon} ${size} ${className}`} role={role} aria-hidden={ariaHiddenAttr} {title}></span>
    {:else}
        <img src={icon} {alt} {title} role={role} aria-hidden={ariaHiddenAttr} class={className} style={sizeStyle} />
    {/if}
{:else if isThemedIconImage(icon)}
    <img src={icon.light} {alt} {title} role={role} aria-hidden={ariaHiddenAttr} class={['block dark:hidden', className]} style={sizeStyle} />
    <img src={icon.dark} {alt} {title} role={role} aria-hidden={ariaHiddenAttr} class={['hidden dark:block', className]} style={sizeStyle} />
{:else if IconComponent}
    <span role={role} aria-hidden={ariaHiddenAttr} {title}><IconComponent class={className} {size}/></span>
{/if}
