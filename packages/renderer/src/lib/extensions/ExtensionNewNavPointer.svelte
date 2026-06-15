<svelte:options runes={true} />

<script lang="ts">
import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { Button } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount, tick } from 'svelte';
import { router } from 'tinro';

import { dismissExtensionNavPointer, extensionNavPointerState } from '/@/lib/extensions/extension-nav-pointer.svelte';
import {
  resolveExtensionOnboardingStatusById,
  resolveOnboardingRouteExtensionId,
} from '/@/lib/extensions/extension-onboarding-utils';
import { context } from '/@/stores/context';
import { extensionNavigationGroupRevision } from '/@/stores/navigation/navigation-registry-extension.svelte';
import { onboardingList } from '/@/stores/onboarding';

let calloutElement = $state<HTMLDivElement>();
let arrowElement = $state<HTMLDivElement>();
let arrowTop = $state(16);
let isPositioned = $state(false);
let cleanupAutoUpdate: (() => void) | undefined;
let positionRetryTimeout: ReturnType<typeof setTimeout> | undefined;
let onboardingRevision = $state(0);

onMount(() => {
  const unsubOnboarding = onboardingList.subscribe(() => {
    onboardingRevision += 1;
  });
  const unsubContext = context.subscribe(() => {
    onboardingRevision += 1;
  });

  return (): void => {
    unsubOnboarding();
    unsubContext();
  };
});

const onboardingEnabled = $derived.by(() => {
  onboardingRevision;
  const pointer = extensionNavPointerState.value;
  if (!pointer) {
    return false;
  }
  return resolveExtensionOnboardingStatusById(pointer.extensionId).enabled;
});

async function updateCalloutPosition(): Promise<void> {
  const pointer = extensionNavPointerState.value;
  if (!pointer || !calloutElement || !arrowElement) {
    isPositioned = false;
    return;
  }

  const navAnchor = document.querySelector<HTMLElement>(`[data-nav-link="${pointer.link}"]`);
  if (!navAnchor) {
    isPositioned = false;
    return;
  }

  navAnchor.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

  const { x, y, middlewareData } = await computePosition(navAnchor, calloutElement, {
    placement: 'right',
    middleware: [
      offset(12),
      flip({ fallbackAxisSideDirection: 'start', padding: 8 }),
      shift({ padding: 8 }),
      arrow({ element: arrowElement, padding: 8 }),
    ],
  });

  if (!calloutElement) {
    return;
  }

  Object.assign(calloutElement.style, {
    left: `${Math.round(x)}px`,
    top: `${Math.round(y)}px`,
  });

  const arrowY = middlewareData.arrow?.y;
  arrowTop =
    typeof arrowY === 'number' ? Math.max(8, Math.round(arrowY)) : Math.round(calloutElement.offsetHeight / 2 - 6);
  isPositioned = true;
}

function teardownAutoUpdate(): void {
  if (cleanupAutoUpdate) {
    cleanupAutoUpdate();
    cleanupAutoUpdate = undefined;
  }
}

function clearPositionRetry(): void {
  if (positionRetryTimeout !== undefined) {
    clearTimeout(positionRetryTimeout);
    positionRetryTimeout = undefined;
  }
}

function schedulePositionRetry(): void {
  clearPositionRetry();
  positionRetryTimeout = setTimeout(() => {
    positionRetryTimeout = undefined;
    if (!extensionNavPointerState.value || isPositioned) {
      return;
    }
    updateCalloutPosition()
      .then(() => {
        if (!isPositioned && extensionNavPointerState.value) {
          schedulePositionRetry();
        }
      })
      .catch(console.error);
  }, 250);
}

function openOnboarding(): void {
  const pointer = extensionNavPointerState.value;
  if (!pointer || !onboardingEnabled) {
    return;
  }
  const onboardingExtensionId = resolveOnboardingRouteExtensionId(pointer.extensionId);
  dismissExtensionNavPointer();
  router.goto(`/preferences/onboarding/${onboardingExtensionId}`);
}

$effect((): (() => void) => {
  const pointer = extensionNavPointerState.value;
  const element = calloutElement;
  const arrow = arrowElement;
  const navRevision = extensionNavigationGroupRevision.value;
  teardownAutoUpdate();
  clearPositionRetry();
  isPositioned = false;

  if (!pointer || !element || !arrow) {
    return (): void => {
      teardownAutoUpdate();
      clearPositionRetry();
    };
  }

  const currentNavRevision = navRevision;

  tick()
    .then(() => updateCalloutPosition())
    .then(() => {
      if (!isPositioned && currentNavRevision >= 0) {
        schedulePositionRetry();
      }
    })
    .catch(console.error);

  const navAnchor = document.querySelector<HTMLElement>(`[data-nav-link="${pointer.link}"]`);
  if (navAnchor) {
    cleanupAutoUpdate = autoUpdate(navAnchor, element, () => {
      updateCalloutPosition().catch(console.error);
    });
  }

  return (): void => {
    teardownAutoUpdate();
    clearPositionRetry();
  };
});

const routerUnsubscribe = router.subscribe(route => {
  const pointer = extensionNavPointerState.value;
  if (!pointer) {
    return;
  }
  if (route.path === pointer.link || route.path.startsWith(`${pointer.link}/`)) {
    dismissExtensionNavPointer();
  }
});

onDestroy(() => {
  teardownAutoUpdate();
  clearPositionRetry();
  routerUnsubscribe();
});
</script>

{#if extensionNavPointerState.value}
  <div
    bind:this={calloutElement}
    class="fixed z-[10000] w-[min(280px,calc(100vw-96px))] transition-opacity duration-150"
    class:opacity-0={!isPositioned}
    class:pointer-events-none={!isPositioned}
    role="status"
    aria-live="polite"
    aria-label="New extension navigation hint">
    <div class="relative rounded-[9px] border border-[var(--pd-tooltip-outer-border)] shadow-[0_4px_12px_var(--pd-shadow-color)] bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)]">
      <div
        bind:this={arrowElement}
        class="absolute -left-[6px] w-3 h-3 rotate-45 border-l border-b border-[var(--pd-tooltip-outer-border)] bg-[var(--pd-tooltip-bg)]"
        style="top: {arrowTop}px;"></div>
      <div class="px-3 py-2.5 text-[12px] leading-[16px]">
        <div class="font-medium text-[var(--pd-content-header)] mb-1">Just installed</div>
        <p>{extensionNavPointerState.value.tooltip}</p>
      </div>
      <div class="px-3 pb-2.5 flex justify-end gap-2">
        {#if onboardingEnabled}
          <Button type="link" on:click={openOnboarding}>Learn</Button>
        {/if}
        <Button
          type="primary"
          on:click={(): void => {
            dismissExtensionNavPointer();
          }}>Got it</Button>
      </div>
    </div>
  </div>
{/if}
