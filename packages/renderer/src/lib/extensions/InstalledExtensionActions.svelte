<script lang="ts">
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import InstalledExtensionCardLeftLifecycle from './InstalledExtensionCardLeftLifecycle.svelte';
import InstalledExtensionCardLeftOnboardingAndProperties from './InstalledExtensionCardLeftOnboardingAndProperties.svelte';

interface Props {
  extension: CombinedExtensionInfoUI;
  className: string;
}

let { extension, className }: Props = $props();
</script>

<div class="text-center flex-row flex {className}">
  <InstalledExtensionCardLeftLifecycle {extension} />
  <InstalledExtensionCardLeftOnboardingAndProperties {extension} />
</div>
