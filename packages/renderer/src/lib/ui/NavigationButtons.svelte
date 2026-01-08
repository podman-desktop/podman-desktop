<script lang="ts">
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import { goBack, goForward, navigationHistory } from '/@/stores/navigation-history.svelte';

let canGoBack = $derived(navigationHistory.index > 0);
let canGoForward = $derived(navigationHistory.index < navigationHistory.stack.length - 1);
</script>

<div
    class="flex items-center gap-1 text-[color:var(--pd-global-nav-icon)]"
    style="-webkit-app-region: none;">
    <div class="relative">
    <button
        class="h-[25px] w-[25px] flex place-items-center justify-center hover:rounded hover:bg-[var(--pd-titlebar-hover-bg)] disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
        title="Back (hold for history)"
        onclick={goBack}
        disabled={!canGoBack}>
        <Icon icon={faArrowLeft} />
    </button>
    </div>
    <div class="relative">
    <button
        class="h-[25px] w-[25px] flex place-items-center justify-center hover:rounded hover:bg-[var(--pd-titlebar-hover-bg)] disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
        title="Forward (hold for history)"
        onclick={goForward}
        disabled={!canGoForward}>
        <Icon icon={faArrowRight} />
    </button>
    </div>
</div>
