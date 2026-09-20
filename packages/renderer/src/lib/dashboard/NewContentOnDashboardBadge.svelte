<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { get, type Unsubscriber } from 'svelte/store';

import NewContentBadge from '/@/lib/ui/NewContentBadge.svelte';
import { notificationQueue } from '/@/stores/notifications';
import { providerInfos } from '/@/stores/providers';

let providersId: string[] = [];
let providersBaselineSet = false;
let notificationCount = 0;
let notificationsBaselineSet = false;

let hasNewProviders = $state(false);
let hasNewNotifications = $state(false);
let hasNew = $derived(hasNewProviders || hasNewNotifications);

// becomes true once extensions have finished starting; until then, every store
// emission is startup content and must not light the dot (spec #4043)
let ready = false;

let providersUnsubscribe: Unsubscriber | undefined;
let notificationsUnsubscribe: Unsubscriber | undefined;

function onReady(): void {
  if (ready) {
    return;
  }
  ready = true;

  // If a source already holds data at readiness, that data is the startup
  // snapshot: capture it as the baseline now. If it is still empty, leave the
  // baseline unset so the first post-readiness emission (the async startup
  // fetch) becomes the baseline instead of looking like new content.
  const currentProviders = get(providerInfos);
  if (currentProviders.length > 0) {
    providersId = currentProviders.map(prov => prov.internalId).toSorted();
    providersBaselineSet = true;
  }

  const currentNotifications = get(notificationQueue);
  if (currentNotifications.length > 0) {
    notificationCount = currentNotifications.length;
    notificationsBaselineSet = true;
  }
}

onMount(() => {
  // if there is a new provider we display the dot
  providersUnsubscribe = providerInfos.subscribe(updatedProviders => {
    if (!ready) {
      return;
    }
    const updatedProvidersId = updatedProviders.map(prov => prov.internalId).toSorted();
    if (!providersBaselineSet) {
      providersId = updatedProvidersId;
      providersBaselineSet = true;
      return;
    }
    if (!hasNewProviders) {
      hasNewProviders = hasNewProvider(providersId, updatedProvidersId);
    }
    providersId = updatedProvidersId;
  });

  // if there is a new notification we display the dot
  notificationsUnsubscribe = notificationQueue.subscribe(notifications => {
    if (!ready) {
      return;
    }
    if (!notificationsBaselineSet) {
      notificationCount = notifications.length;
      notificationsBaselineSet = true;
      return;
    }
    if (!hasNewNotifications) {
      hasNewNotifications = notifications.length > notificationCount;
    }
    notificationCount = notifications.length;
  });

  // one-shot event dispatched by Loader.svelte once extensions have started
  window.addEventListener('extensions-already-started', onReady);

  // the event may have already fired before this component mounted, so also
  // query the current state (same idiom as Loader.svelte)
  window
    .extensionSystemIsExtensionsStarted?.()
    .then(started => {
      if (started) {
        onReady();
      }
    })
    .catch((err: unknown) => console.error('Unable to check if extensions are started', err));
});

onDestroy(() => {
  providersUnsubscribe?.();
  notificationsUnsubscribe?.();
  window.removeEventListener('extensions-already-started', onReady);
});

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
