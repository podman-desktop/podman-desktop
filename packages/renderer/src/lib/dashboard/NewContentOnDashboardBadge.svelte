<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';

import NewContentBadge from '/@/lib/ui/NewContentBadge.svelte';
import { notificationQueue } from '/@/stores/notifications';
import { providerInfos } from '/@/stores/providers';

let providersId: string[] = $state([]);
let notificationCount: number = $state(0);
// content as it was the last time the user visited the dashboard
let seenProvidersId: string[] = $state([]);
let seenNotificationCount: number = $state(0);
// computed against the content seen, so the dot disappears if the new content is removed
let hasNewProviders = $derived(hasNewProvider(seenProvidersId, providersId));
let hasNewNotifications = $derived(notificationCount > seenNotificationCount);
let hasNew = $derived(hasNewProviders || hasNewNotifications);

let providersUnsubscribe: Unsubscriber;
let notificationsUnsubscribe: Unsubscriber;

onMount(() => {
  providersUnsubscribe = providerInfos.subscribe(updatedProviders => {
    providersId = updatedProviders.map(prov => prov.internalId).toSorted();
  });

  notificationsUnsubscribe = notificationQueue.subscribe(notifications => {
    notificationCount = notifications.length;
  });
});

onDestroy(() => {
  providersUnsubscribe?.();
  notificationsUnsubscribe?.();
});

function hasNewProvider(oldProvidersId: string[], newProvidersId: string[]): boolean {
  return newProvidersId.some(id => !oldProvidersId.includes(id));
}

function onHide(): void {
  seenProvidersId = providersId;
  seenNotificationCount = notificationCount;
}
</script>

<div class="absolute top-0 right-[-9px]">
  <NewContentBadge pagePath="/" show={hasNew} onHide={onHide} />
</div>
