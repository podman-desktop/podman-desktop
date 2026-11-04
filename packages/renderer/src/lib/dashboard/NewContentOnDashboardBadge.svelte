<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';
import { router } from 'tinro';

import NewContentBadge from '/@/lib/ui/NewContentBadge.svelte';
import { notificationQueue } from '/@/stores/notifications';
import { providerInfos } from '/@/stores/providers';

let providersId: string[] = $state([]);
let notificationCount: number = $state(0);
let hasNewProviders = $state(false);
let hasNewNotifications = $state(false);
let hasNew = $derived(hasNewProviders || hasNewNotifications);

let providersUnsubscribe: Unsubscriber;
let notificationsUnsubscribe: Unsubscriber;

onMount(() => {
  // if there is a new provider we display the dot
  providersUnsubscribe = providerInfos.subscribe(updatedProviders => {
    const updatedProvidersId = updatedProviders.map(prov => prov.internalId).toSorted();
    // content arriving while the user is on the dashboard is already seen:
    // only flag changes made while away, the baseline is always updated
    if (!isOnDashboard() && !hasNewProviders) {
      hasNewProviders = hasNewProvider(providersId, updatedProvidersId);
    }
    providersId = updatedProvidersId;
  });

  // if there is a new notification we display the dot
  notificationsUnsubscribe = notificationQueue.subscribe(notifications => {
    // content arriving while the user is on the dashboard is already seen:
    // only flag changes made while away, the baseline is always updated
    if (!isOnDashboard() && !hasNewNotifications) {
      hasNewNotifications = notifications.length > notificationCount;
    }
    notificationCount = notifications.length;
  });
});

onDestroy(() => {
  providersUnsubscribe?.();
  notificationsUnsubscribe?.();
});

// true when the dashboard page is displayed
function isOnDashboard(): boolean {
  return $router.path === '/';
}

function hasNewProvider(oldProvidersId: string[], newProvidersId: string[]): boolean {
  if (oldProvidersId.length < newProvidersId.length) {
    return true;
  }
  for (let [index, id] of newProvidersId.entries()) {
    if (id !== oldProvidersId[index]) {
      return true;
    }
  }
  return false;
}

function onHide(): void {
  hasNewProviders = false;
  hasNewNotifications = false;
}
</script>

<div class="absolute top-0 right-[-9px]">
  <NewContentBadge pagePath="/" show={hasNew} onHide={onHide} />
</div>
