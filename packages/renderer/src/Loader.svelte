<script lang="ts">
import { onDestroy, onMount, tick } from 'svelte';
import { router } from 'tinro';

import App from './App.svelte';
import SealRocket from './lib/images/SealRocket.svelte';
import ColorsStyle from './lib/style/ColorsStyle.svelte';
import { lastPage } from './stores/breadcrumb';

// (delete-me) cold-start trace logging
const _t0 = Date.now();
const _trace = (msg: string): void => console.log(`[TRACE:renderer] +${Date.now() - _t0}ms ${msg}`);
_trace(
  `Loader.svelte module init — window.events=${typeof window.events} window.extensionSystemIsReady=${typeof window.extensionSystemIsReady}`,
);

let systemReady = false;

let toggle = false;

let loadingSequence: NodeJS.Timeout;

let extensionsStarterChecker: NodeJS.Timeout;

onMount(async () => {
  _trace('onMount fired');
  loadingSequence = setInterval(() => {
    toggle = !toggle;
  }, 100);
  // check if the server side is ready
  try {
    _trace('calling extensionSystemIsReady()');
    const isReady = await window.extensionSystemIsReady();
    _trace(`extensionSystemIsReady() returned: ${isReady}`);
    systemReady = isReady;
    if (systemReady) {
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
window.events?.receive('starting-extensions', (value: unknown) => {
  _trace(`received 'starting-extensions' event: ${value}`);
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
