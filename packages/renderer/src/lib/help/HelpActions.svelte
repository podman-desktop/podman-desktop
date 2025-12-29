<script lang="ts">
import HelpActionsExperimental from '/@/lib/help/HelpActionsExperimental.svelte';
import { Items } from '/@/lib/help/HelpItems';

import HelpActionsItems from './HelpActionsItems.svelte';

const isExperimentalHelpEnabled = $derived(
  await window.isExperimentalConfigurationEnabled('helpMenu.useProductConfig'),
);
</script>

{#if isExperimentalHelpEnabled}
  <HelpActionsExperimental />
{:else}
  <HelpActionsItems items={Items}/>
{/if}
