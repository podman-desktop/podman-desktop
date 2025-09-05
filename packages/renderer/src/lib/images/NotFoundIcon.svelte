<script lang="ts">
import { isDark } from '/@/stores/appearance';

import NotFoundDarkIcon from '../images/NotFoundDarkIcon.svelte';
import NotFoundLightIcon from '../images/NotFoundLightIcon.svelte';
</script>

{#if $isDark}
    <NotFoundDarkIcon />
{:else}
    <NotFoundLightIcon />
{/if}