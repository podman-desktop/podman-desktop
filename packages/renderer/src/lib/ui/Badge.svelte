<script lang="ts">
import { onMount } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

import { AppearanceUtil } from '/@/lib/appearance/appearance-util';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  color?: string | { light: string; dark: string };
  label?: string;
}

let { color = 'bg-[var(--pd-badge-gray)]', label = '', class: className, ...restProps }: Props = $props();

let customStyle = $state('');
let customClass = $state('');

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

<div class={['text-[var(--pd-badge-text)] text-xs me-2 px-1 py-0.5 rounded-sm select-none', customClass, className]} style={customStyle} aria-label="badge-{label}" {...restProps}>
  {label}
</div>
