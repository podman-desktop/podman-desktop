<script lang="ts">
import { images } from './border-assets/linux/images';

let theme: 'light' | 'dark' = 'dark'; // will also have light theme
</script>

<div class="absolute top-0 left-0 w-screen h-screen grid grid-cols-[20px_1fr_20px] grid-rows-[20px_1fr_20px] z-0">
  <img src={images[theme]['tl']} class="w-[40px] h-[40px]" alt='some alt'/>
  <img src={images[theme]['t']} class="w-full h-[40px] object-cover" alt='some alt'/>
  <img src={images[theme]['tr']} class="w-[40px] h-[40px]" alt='some alt'/>

  <img src={images[theme]['l']} class="w-[40px] h-full object-cover"  alt='some alt'/>
  <div class="bg-[var(--pd-content-bg)]"></div>
  <img src={images[theme]['r']} class="w-[40px] h-full object-cover" alt='some alt'/>

  <img src={images[theme]['bl']} class="w-[40px] h-[40px]" alt='some alt'/>
  <img src={images[theme]['b']} class="w-full h-[40px] object-cover"  alt='some alt'/>
  <img src={images[theme]['br']} class="w-[40px] h-[40px]" alt='some alt'/>

</div>
