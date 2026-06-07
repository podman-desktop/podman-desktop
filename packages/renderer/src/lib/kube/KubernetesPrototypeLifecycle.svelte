<script lang="ts">
import { onDestroy } from 'svelte';
import { get } from 'svelte/store';
import { router } from 'tinro';

import {
  developerSandboxPromptPrototypeName,
  registerDeveloperSandboxPromptPrototype,
} from '/@/lib/kube/developer-sandbox-prompt-prototype';
import { activePrototype, currentScreen, unregisterPrototype } from '/@/stores/prototype';

function isKubernetesRoute(path: string | undefined): boolean {
  return path === '/kubernetes' || (path?.startsWith('/kubernetes/') ?? false);
}

function isDeveloperSandboxConnectRoute(path: string | undefined): boolean {
  return path?.startsWith('/preferences/resources') ?? false;
}

function shouldKeepDeveloperSandboxPrototypeActive(path: string | undefined): boolean {
  return isKubernetesRoute(path) || isDeveloperSandboxConnectRoute(path);
}

let preservedScreen = '';
let unsubscribeRouter: (() => void) | undefined;

function syncPrototypeRegistration(path: string | undefined): void {
  if (shouldKeepDeveloperSandboxPrototypeActive(path)) {
    if (get(activePrototype)?.name !== developerSandboxPromptPrototypeName) {
      registerDeveloperSandboxPromptPrototype(preservedScreen || undefined);
      preservedScreen = '';
    }
    return;
  }

  if (get(activePrototype)?.name === developerSandboxPromptPrototypeName) {
    preservedScreen = get(currentScreen);
    unregisterPrototype();
  }
}

unsubscribeRouter = router.subscribe(navigation => {
  syncPrototypeRegistration(navigation.url);
});

onDestroy(() => {
  unsubscribeRouter?.();
  if (get(activePrototype)?.name === developerSandboxPromptPrototypeName) {
    unregisterPrototype();
  }
});
</script>
