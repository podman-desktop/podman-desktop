<script lang="ts">
import { onDestroy, onMount, tick } from 'svelte';
import { router } from 'tinro';

import App from './App.svelte';
import SealRocket from './lib/images/SealRocket.svelte';
import ColorsStyle from './lib/style/ColorsStyle.svelte';
import { lastPage } from './stores/breadcrumb';

let systemReady = false;

let toggle = false;

let loadingSequence: NodeJS.Timeout;

let extensionsStarterChecker: NodeJS.Timeout;

let bridgeWatchdog: NodeJS.Timeout;

// If the preload bridge fails to attach (rare cold-start failure, observed on Windows), none of
// the window.extensionSystem* functions exist and the app is stuck on "Initializing..." forever.
// Reloading the page once re-runs the preload from a now-warm file cache and reliably recovers.
const BRIDGE_WATCHDOG_TIMEOUT_MS = 5000;
const BRIDGE_RELOAD_FLAG = 'pd-bridge-reload-attempted';

onMount(async () => {
  loadingSequence = setInterval(() => {
    toggle = !toggle;
  }, 100);

  // Watchdog: if the preload bridge is still missing after the grace period, reload the page once
  // (guarded via sessionStorage so a persistently broken bridge cannot cause an infinite loop).
  bridgeWatchdog = setTimeout(() => {
    if (typeof window.extensionSystemIsReady === 'function') {
      return;
    }
    if (window.sessionStorage?.getItem(BRIDGE_RELOAD_FLAG)) {
      console.error('Preload bridge still missing after a reload; not reloading again.');
      return;
    }
    window.sessionStorage?.setItem(BRIDGE_RELOAD_FLAG, 'true');
    console.warn('Preload bridge missing; reloading window once to recover.');
    window.location.reload();
  }, BRIDGE_WATCHDOG_TIMEOUT_MS);

  // check if the server side is ready
  try {
    const isReady = await window.extensionSystemIsReady();
    systemReady = isReady;
    if (systemReady) {
      // the bridge is present and the backend answered: cancel the watchdog and clear the guard
      // so a future cold start in this session can self-heal again.
      clearTimeout(bridgeWatchdog);
      window.sessionStorage?.removeItem(BRIDGE_RELOAD_FLAG);
      window.dispatchEvent(new CustomEvent('system-ready', {}));
    }
  } catch (error) {
    console.error('Unable to check if system is ready', error);
  }

  const checkRemoteStarted = async (): Promise<void> => {
    const extensionsStarted = await window.extensionSystemIsExtensionsStarted();
    if (extensionsStarted) {
      window.dispatchEvent(new CustomEvent('extensions-already-started', {}));
      clearInterval(extensionsStarterChecker);
    }
  };

  extensionsStarterChecker = setInterval(() => {
    checkRemoteStarted().catch((error: unknown) => {
      console.error('Unable to check if extensions are started', error);
    });
  }, 100);
});

onDestroy(() => {
  if (loadingSequence) {
    clearInterval(loadingSequence);
  }

  if (extensionsStarterChecker) {
    clearInterval(extensionsStarterChecker);
  }

  if (bridgeWatchdog) {
    clearTimeout(bridgeWatchdog);
  }
});

// receive events from main process to install a new extension
window.events?.receive('install-extension:from-id', (extensionId: unknown) => {
  const action = async (): Promise<void> => {
    const redirectPage = `/extensions/details/${extensionId}`;
    // need to open the extension page
    await tick();
    router.goto(redirectPage);
    // make sure the last page is set to the extensions page so breadcrumb will be correct
    lastPage.set({ name: 'Extensions', path: '/extensions' });
  };

  if (!systemReady) {
    // need to wait for the system to be ready, so we delay the install
    window.addEventListener('system-ready', () => {
      action().catch((err: unknown) => console.log('Error while redirecting to extensions', err));
    });
  } else {
    action().catch((err: unknown) => console.log('Error while redirecting to extensions', err));
  }
});

// Wait that the server-side is ready
window.events.receive('starting-extensions', (value: unknown) => {
  systemReady = value === 'true';
  if (systemReady) {
    window.dispatchEvent(new CustomEvent('system-ready', {}));
  }
  clearInterval(loadingSequence);
});
</script>

<ColorsStyle />

{#if !systemReady}
  <main class="flex flex-row w-screen h-screen justify-center" style="-webkit-app-region: drag;">
    <div class="flex flex-col justify-center">
      <SealRocket />
      <h1 class="text-center text-xl">Initializing...</h1>
    </div>
  </main>
{:else}
  <App />
{/if}
