<script lang="ts">
import { onDestroy, onMount, tick } from 'svelte';
import { router } from 'tinro';

import App from './App.svelte';
import SealRocket from './lib/images/SealRocket.svelte';
import ColorsStyle from './lib/style/ColorsStyle.svelte';
import { lastPage } from './stores/breadcrumb';
import { colorsInfos } from './stores/colors';

let systemReady = false;
let colorsLoaded = false;
// extension page to open once the UI state (system + colors) is fully loaded
let pendingExtensionId: unknown;

let toggle = false;

let loadingSequence: NodeJS.Timeout;

let extensionsStarterChecker: NodeJS.Timeout;

const unsubscribeColors = colorsInfos.subscribe(colors => {
  if (colors && colors.length > 0) {
    colorsLoaded = true;
    maybeOpenPendingExtension();
  }
});

onMount(async () => {
  loadingSequence = setInterval(() => {
    toggle = !toggle;
  }, 100);
  // check if the server side is ready
  try {
    const isReady = await window.extensionSystemIsReady();
    systemReady = isReady;
    if (systemReady) {
      window.dispatchEvent(new CustomEvent('system-ready', {}));
      maybeOpenPendingExtension();
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
  unsubscribeColors();

  if (extensionsStarterChecker) {
    clearInterval(extensionsStarterChecker);
  }
});

// redirect to the extension page
function openExtensionPage(extensionId: unknown): void {
  const action = async (): Promise<void> => {
    const redirectPage = `/extensions/details/${extensionId}`;
    // need to open the extension page
    await tick();
    router.goto(redirectPage);
    // make sure the last page is set to the extensions page so breadcrumb will be correct
    lastPage.set({ name: 'Extensions', path: '/extensions' });
  };
  action().catch((err: unknown) => console.log('Error while redirecting to extensions', err));
}

// if the install request arrives before the UI is fully initialized, keep it for later.
// Note that system-ready may already have fired while colors are still loading, so we
// cannot rely on listening to that event only.
function maybeOpenPendingExtension(): void {
  if (!systemReady || !colorsLoaded || !pendingExtensionId) {
    return;
  }
  const extensionId = pendingExtensionId;
  pendingExtensionId = undefined;
  openExtensionPage(extensionId);
}

window.events?.receive('install-extension:from-id', (extensionId: unknown) => {
  if (systemReady && colorsLoaded) {
    openExtensionPage(extensionId);
  } else {
    // need to wait for the UI state to be loaded, so we delay the install
    pendingExtensionId = extensionId;
  }
});

// Wait that the server-side is ready
window.events.receive('starting-extensions', (value: unknown) => {
  systemReady = value === 'true';
  if (systemReady) {
    window.dispatchEvent(new CustomEvent('system-ready', {}));
    maybeOpenPendingExtension();
  }
  clearInterval(loadingSequence);
});
</script>

<ColorsStyle />

{#if !systemReady || !colorsLoaded}
  <main class="flex flex-row w-screen h-screen justify-center" style="-webkit-app-region: drag;">
    <div class="flex flex-col justify-center">
      <SealRocket />
      <h1 class="text-center text-xl">Initializing...</h1>
    </div>
  </main>
{:else}
  <App />
{/if}
