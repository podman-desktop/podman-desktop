<script lang="ts" generics="T">
import { onDestroy, untrack } from 'svelte';
import type { TinroBreadcrumb, TinroRouteMeta } from 'tinro';
import { createRouteObject } from 'tinro/dist/tinro_lib';

import type { NavigationHint } from './navigation';
import { currentPage, history, lastPage } from './stores/breadcrumb';
import { TelemetryService } from './TelemetryService';

interface Props {
  path?: string;
  fallback?: boolean;
  redirect?: boolean;
  firstmatch?: boolean;
  breadcrumb?: string;
  navigationHint?: NavigationHint;
  requestParser?: (request: { query: Record<string, string>; params: Record<string, string> }) => T;
}

let {
  path = '/*',
  fallback = false,
  redirect = false,
  firstmatch = false,
  breadcrumb,
  navigationHint,
  requestParser,
}: Props = $props();

let showContent = $state(false);
let params = $state<Record<string, string>>({});
let meta = $state<TinroRouteMeta>({ url: '' } as TinroRouteMeta);
let request: T | undefined = $derived(requestParser && meta ? requestParser(meta) : undefined);

const route = createRouteObject({
  fallback,
  onShow() {
    showContent = true;
  },
  onHide() {
    showContent = false;
  },
  onMeta(newMeta: TinroRouteMeta) {
    processMetaBreadcrumbs(newMeta.breadcrumbs);
    meta = newMeta;
    params = meta.params;
  },
});

function processMetaBreadcrumbs(breadcrumbs?: Array<TinroBreadcrumb>): void {
  if (breadcrumbs) {
    const curPage = breadcrumbs[breadcrumbs.length - 1];
    if (!curPage) return;

    if (navigationHint === 'root') {
      history.set([curPage]);
    } else if (navigationHint === 'details') {
      history.set([$history[0], curPage]);
      lastPage.set($history[0]);
    } else if (navigationHint === 'tab') {
      // if we're on a details tab, fix the breadcrumb to come back to this tab
      const path = curPage.path.substring(0, curPage.path.lastIndexOf('/'));
      const last = $history[$history.length - 1];
      if (last?.path.startsWith(path)) {
        last.path = curPage.path;
      } else {
        // otherwise, set the last page normally
        lastPage.set(last);
      }
    } else {
      // set the last page from the history
      lastPage.set($history[$history.length - 1]);
    }

    // set the current page to this route, unless we're on a tab
    if (navigationHint !== 'tab') {
      currentPage.set(curPage);
    }

    TelemetryService.getService().handlePageOpen(breadcrumbs.map(breadcrumb => breadcrumb.name).join('/'));
  }
}

$effect.pre(() => {
  const args = { path, redirect, firstmatch, breadcrumb };

  // untrack to prevent route.update() internal store reads/writes from being tracked as dependencies
  untrack(() => route.update(args));
});

onDestroy(() => {
  TelemetryService.getService().handlePageClose();
});
</script>

{#if showContent}
  <slot params={params} meta={meta} request={request} />
{/if}
