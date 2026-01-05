<script lang="ts">
import HelpActionsItems from './HelpActionsItems.svelte';

const items = $derived(await window.helpMenuGetItems());
</script>

<HelpActionsItems items={items}/>
