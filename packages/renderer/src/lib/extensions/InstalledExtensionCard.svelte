<script lang="ts">
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import InstalledExtensionCardLeft from './InstalledExtensionCardLeft.svelte';
import InstalledExtensionCardRight from './InstalledExtensionCardRight.svelte';

interface Props {
  extension: CombinedExtensionInfoUI;
  catalogExtension?: CatalogExtensionInfoUI;
}

let { extension, catalogExtension }: Props = $props();
</script>

<div
  class="bg-[var(--pd-content-card-bg)] mb-5 rounded-md p-3 divide-x divide-[var(--pd-content-divider)] flex"
  role="region"
  aria-label={extension.id}>
  <!-- left col  -->
  <InstalledExtensionCardLeft {extension} {catalogExtension} />

  <div class="grow flex flex-wrap divide-[var(--pd-content-divider)] ml-2" role="region">
    <InstalledExtensionCardRight extension={extension} />
  </div>
</div>
