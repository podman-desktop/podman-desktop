<script lang="ts">
let theme: 'light' | 'dark' = 'light'; // will also have light theme
let os = 'linux';

theme = 'dark';

/**
 * Generates an object containing the `src` and `srcset` for an image asset
 * based on the provided part.
 *
 * @param {string} part - The name of the part for which the image asset is being generated.
 * @return {{ src: string, srcset: string }} An object containing the `src` and `srcset` paths for the specified image asset.
 */
function imgAsset(part: string): { src: string; srcset: string } {
  const base = new URL(`./border-assets/${os}/${os}-${theme}-${part}.png`, import.meta.url).href;
  const retina = new URL(`./border-assets/${os}/${os}-${theme}-${part}@2x.png`, import.meta.url).href;

  return {
    src: base,
    srcset: `${base} 1x, ${retina} 2x`,
  };
}

const topLeft = imgAsset('1');
const topRight = imgAsset('2');
const bottomLeft = imgAsset('3');
const bottomRight = imgAsset('4');

const top = imgAsset('t');
const bottom = imgAsset('b');
const left = imgAsset('l');
const right = imgAsset('r');
</script>

<div class="absolute top-0 left-0 w-screen h-screen grid grid-cols-[64px_1fr_64px] grid-rows-[64px_1fr_64px] z-0 pointer-events-none">
  <img src={topLeft.src} srcset={topLeft.srcset} class="w-[64px] h-[64px]" width="64" height="64" alt="Top left border"/>
  <img src={top.src} srcset={top.srcset} class="w-full h-[64px] object-fill" height="64" alt="Top border"/>
  <img src={topRight.src} srcset={topRight.srcset} class="w-[64px] h-[64px]" width="64" height="64" alt="Top right border"/>

  <img src={left.src} srcset={left.srcset} class="w-[64px] h-full object-fill" width="64" alt="Left border"/>

  <div class="bg-[var(--pd-content-bg)]"></div>

  <img src={right.src} srcset={right.srcset} class="w-[64px] h-full object-fill" width="64" alt="Right border"/>

  <img src={bottomLeft.src} srcset={bottomLeft.srcset} class="w-[64px] h-[64px]" width="64" height="64" alt="Bottom left border"/>
  <img src={bottom.src} srcset={bottom.srcset} class="w-full h-[64px] object-fill" height="64" alt="Bottom border"/>
  <img src={bottomRight.src} srcset={bottomRight.srcset} class="w-[64px] h-[64px]" width="64" height="64" alt="Bottom right border"/>
</div>
