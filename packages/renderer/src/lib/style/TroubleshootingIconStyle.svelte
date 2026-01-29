<script lang="ts">
import { onDestroy, onMount } from 'svelte';

// Import SVG as raw string and convert to data URI for Electron compatibility
import svgRaw from '/@/lib/images/troubleshooting-icon.svg?raw';

let style: HTMLStyleElement;

function createStyleSheet(): HTMLStyleElement {
  style = document.createElement('style');
  style.media = 'screen';

  // Convert SVG to data URI for mask-image
  const svgDataUri = `data:image/svg+xml,${encodeURIComponent(svgRaw)}`;

  style.textContent = `
    .troubleshooting-icon {
      display: inline-block;
      width: 1em;
      height: 1em;
      mask-image: url('${svgDataUri}');
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      background-color: currentColor;
    }
  `;

  document.head.append(style);
  return style;
}

onMount(() => {
  createStyleSheet();
});

onDestroy(() => {
  style?.remove();
});
</script>
