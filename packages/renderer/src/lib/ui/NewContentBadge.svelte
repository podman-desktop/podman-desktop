<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';
import { router } from 'tinro';

interface Props {
  pagePath: string;
  show?: boolean;
  onHide?: () => void;
}
let { pagePath, show = false, onHide = (): void => {} }: Props = $props();

let isInPage = $derived($router.path === pagePath);
let hasNew = $derived(!isInPage && show);

let routerUnsubscribe: Unsubscriber | undefined;

onMount(() => {
  // listen to router change, so we can reset the changes and update the dot visibility
  routerUnsubscribe = router.subscribe(route => {
    isInPage = route.path === pagePath;
    if (isInPage) {
      onHide();
    }
  });
});

onDestroy(() => {
  routerUnsubscribe?.();
});
</script>

{#if hasNew}
  <div aria-label="New content available" class="w-[6px] h-[6px] bg-[var(--pd-notification-dot)] rounded-full"></div>
{/if}
