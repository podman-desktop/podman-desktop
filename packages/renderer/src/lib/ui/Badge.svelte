<script lang="ts">
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { onMount } from 'svelte';
import Fa from 'svelte-fa';

import { AppearanceUtil } from '/@/lib/appearance/appearance-util';

export let color: string | { light: string; dark: string } = 'bg-[var(--pd-badge-gray)]';
export let label: string = '';
export let icon: IconDefinition | undefined = undefined;

let customStyle: string = '';
let customClass: string = '';

onMount(async () => {
  const appearanceUtil = new AppearanceUtil();

  // get the color
  let singleColor = appearanceUtil.getImage(color);
  singleColor ??= '';

  if (singleColor?.startsWith('#')) {
    customStyle = `background-color: ${singleColor};`;
  } else {
    customClass = singleColor ?? '';
  }
});
</script>

<div class="text-[var(--pd-badge-text)] text-xs px-1.5 py-1 rounded-sm select-none inline-flex items-center gap-1 leading-none {customClass} {$$props.class}" style={customStyle} aria-label="badge-{label}">
  {#if icon}
    <Fa {icon} size="xs" />
  {/if}
  {label}
</div>
