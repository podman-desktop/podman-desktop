<!--
  Renders an icon with theme-aware light/dark support.
  - String icons render as-is
  - Object icons use light variant on light theme, dark variant on dark theme
  - Falls back to alternate variant if preferred variant is missing
-->
<script lang="ts">
import { isDark } from '/@/stores/appearance';

interface Props {
  icon: string | { light?: string; dark?: string } | undefined;
  alt: string;
  class?: string;
}

let { icon, alt, class: className = '' }: Props = $props();

function getThemedSrc(icon: string | { light?: string; dark?: string } | undefined): string | undefined {
  if (!icon) return undefined;
  if (typeof icon === 'string') return icon;

  return $isDark ? (icon.dark ?? icon.light) : (icon.light ?? icon.dark);
}
</script>

{#if icon}
  {@const src = getThemedSrc(icon)}
  {#if src}
    <img {src} {alt} class={className} />
  {/if}
{/if}
