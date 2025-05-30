<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { Component } from 'svelte';
import { Fa, type IconSize } from 'svelte-fa';

import { isFontAwesomeIcon, isFontAwesomeSize } from '../utils/icon-utils';

interface Props {
  icon: IconDefinition | Component | string;
  size?: IconSize | number | string;
  class?: string;
  color?: string;
  'aria-label'?: string;
  'aria-hidden'?: string;
  role?: string;
  solid?: boolean;
}

let {
  icon,
  size,
  class: className,
  color,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role = 'img',
  solid = true,
}: Props = $props();

const IconComponent = icon;
</script>


{#if isFontAwesomeIcon(icon) && (typeof size === 'undefined' || isFontAwesomeSize(size))}
    <Fa {icon} {size} class={className} {color}/>
{:else if typeof icon === 'string' && (icon.startsWith('fas fa-') || icon.startsWith('far fa-'))}
    <i class={`${icon} ${size} ${className}`} aria-label={ariaLabel} aria-hidden={ariaHidden ? Boolean(ariaHidden) : false} {role}></i>
{:else if IconComponent && typeof IconComponent !== 'string' && !isFontAwesomeIcon(IconComponent)}
    <IconComponent class={className} {size} {role} {solid}/>
{/if}
