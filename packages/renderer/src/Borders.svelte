<script lang="ts">
let theme: 'light' | 'dark' = 'light'; // will also have light theme
let os = 'linux';

const topLeftBorder = new URL(`./border-assets/${os}/${os}-${theme}-1.png`, import.meta.url).href;
const topRightBorder = new URL(`./border-assets/${os}/${os}-${theme}-2.png`, import.meta.url).href;
const bottomLeftBorder = new URL(`./border-assets/${os}/${os}-${theme}-3.png`, import.meta.url).href;
const bottomRightBorder = new URL(`./border-assets/${os}/${os}-${theme}-4.png`, import.meta.url).href;

const topBorder = new URL(`./border-assets/${os}/${os}-${theme}-t.png`, import.meta.url).href;
const bottomBorder = new URL(`./border-assets/${os}/${os}-${theme}-b.png`, import.meta.url).href;
const leftBorder = new URL(`./border-assets/${os}/${os}-${theme}-l.png`, import.meta.url).href;
const rightBorder = new URL(`./border-assets/${os}/${os}-${theme}-r.png`, import.meta.url).href;
</script>

<div class="absolute top-0 left-0 w-screen h-screen grid grid-cols-[40px_1fr_40px] grid-rows-[40px_1fr_40px] z-0">
  <img src={topLeftBorder} class="w-[40px] h-[40px]" alt="Top left border"/>
  <img src={topBorder} class="w-full h-[40px] object-fill" alt="Top border"/>
  <img src={topRightBorder} class="w-[40px] h-[40px]" alt="Top right border"/>

  <img src={leftBorder} class="w-[40px] h-full object-fill"  alt="Left border"/>
  <div class="bg-[var(--pd-content-bg)]"></div>
  <img src={rightBorder} class="w-[40px] h-full object-fill" alt="Right border"/>

  <img src={bottomLeftBorder} class="w-[40px] h-[40px]" alt="Bottom left border"/>
  <img src={bottomBorder} class="w-full h-[40px] object-fill"  alt="Bottom border"/>
  <img src={bottomRightBorder} class="w-[40px] h-[40px]" alt="Bottom right border"/>

</div>
