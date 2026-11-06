<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';
import { router } from 'tinro';

import NewContentBadge from '/@/lib/ui/NewContentBadge.svelte';
import { notificationQueue } from '/@/stores/notifications';
import { providerInfos } from '/@/stores/providers';

let providersId: string[] = $state([]);
let notificationsId: string[] = $state([]);
// content as it was the last time the user visited the dashboard
// (ids are not used as they change each time a provider registers or a notification is posted again)
let seenProvidersId: string[] = $state([]);
let seenNotificationsId: string[] = $state([]);
// computed against the content seen, so the dot disappears if the new content is removed
let hasNewProviders = $derived(hasNewId(seenProvidersId, providersId));
let hasNewNotifications = $derived(hasNewId(seenNotificationsId, notificationsId));
let hasNew = $derived(hasNewProviders || hasNewNotifications);

let providersUnsubscribe: Unsubscriber;
let notificationsUnsubscribe: Unsubscriber;

onMount(() => {
  providersUnsubscribe = providerInfos.subscribe(updatedProviders => {
    providersId = updatedProviders.map(prov => `${prov.extensionId}:${prov.id}`).toSorted();
    // content arriving while the user is on the dashboard is already seen
    if (isOnDashboard()) {
      seenProvidersId = providersId;
    }
  });

  notificationsUnsubscribe = notificationQueue.subscribe(notifications => {
    notificationsId = notifications.map(notification => `${notification.extensionId}:${notification.title}`);
    // content arriving while the user is on the dashboard is already seen
    if (isOnDashboard()) {
      seenNotificationsId = notificationsId;
    }
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

function hasNewId<T>(oldIds: T[], newIds: T[]): boolean {
  const seenIds = new Set(oldIds);
  return newIds.some(id => !seenIds.has(id));
}

function onHide(): void {
  seenProvidersId = providersId;
  seenNotificationsId = notificationsId;
}
</script>

<div class="absolute top-0 right-[-9px]">
  <NewContentBadge pagePath="/" show={hasNew} onHide={onHide} />
</div>
