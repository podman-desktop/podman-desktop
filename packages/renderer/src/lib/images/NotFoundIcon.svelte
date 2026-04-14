<script lang="ts">
import NotFoundDarkIcon from '/@/lib/images/NotFoundDarkIcon.svelte';
import NotFoundLightIcon from '/@/lib/images/NotFoundLightIcon.svelte';
import { isDark } from '/@/stores/appearance';
</script>

{#if $isDark}
    <NotFoundDarkIcon />
{:else}
    <NotFoundLightIcon />
{/if}