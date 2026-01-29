<script lang="ts">
import { onDestroy, onMount } from 'svelte';

let style: HTMLStyleElement;

function createStyleSheet(): HTMLStyleElement {
  style = document.createElement('style');
  style.media = 'screen';

  const svgPath =
    'M6.5 1.02441C8.86223 1.25894 10.7411 3.13777 10.9756 5.5H12V6.5H10.9756C10.7411 8.8622 8.86218 10.74 6.5 10.9746V12H5.5V10.9746C3.13782 10.74 1.25893 8.8622 1.02441 6.5H0V5.5H1.02441C1.25894 3.13777 3.13777 1.25894 5.5 1.02441V0H6.5V1.02441ZM6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2ZM6.5 5.5H9V6.5H6.5V9H5.5V6.5H3V5.5H5.5V3H6.5V5.5Z';

  const svgDataUri = `data:image/svg+xml,${encodeURIComponent(
    `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="${svgPath}"/></svg>`,
  )}`;

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
