<script lang="ts">
import { createEventDispatcher, onDestroy, onMount, type Snippet } from 'svelte';

import { LinearProgress } from '..';
import CloseButton from '../button/CloseButton.svelte';
import Link from '../link/Link.svelte';

interface Props {
  title: string;
  titleDetail?: string;
  subtitle?: string;
  breadcrumbLeftPart?: string;
  breadcrumbRightPart?: string;
  hasClose?: boolean;
  inProgress?: boolean;
  onclose?: () => void;
  onbreadcrumbClick?: () => void;
  icon?: Snippet;
  subtitleSnippet?: Snippet;
  actions?: Snippet;
  detail?: Snippet;
  tabs?: Snippet;
  content?: Snippet;
}

const {
  title,
  titleDetail = undefined,
  subtitle = undefined,
  breadcrumbLeftPart = undefined,
  breadcrumbRightPart = undefined,
  hasClose = true,
  inProgress = false,
  onclose = (): void => {
    dispatchClose('close');
  },
  onbreadcrumbClick = (): void => {
    dispatchBreadCrumb('breadcrumbClick');
  },
  icon,
  subtitleSnippet,
  actions,
  detail,
  tabs,
  content,
}: Props = $props();

let heightOfDetail = $state(0);

let showBreadcrumb = breadcrumbLeftPart ?? breadcrumbRightPart;
let detailSlot: HTMLDivElement;
let observer: MutationObserver;

onMount(() => {
  observer = new MutationObserver(() => updateHeight());
  observer.observe(detailSlot, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  updateHeight();
});

onDestroy(() => observer?.disconnect());

function updateHeight(): void {
  heightOfDetail = detailSlot ? detailSlot.getBoundingClientRect().height : 0;
}

const dispatchClose = createEventDispatcher<{ close: undefined }>();

const dispatchBreadCrumb = createEventDispatcher<{ breadcrumbClick: undefined }>();

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    onclose();
    e.preventDefault();
  }
}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex flex-col w-full h-full bg-[var(--pd-content-bg)]">
  <div class="flex flex-row w-full h-fit px-5 pt-4 pb-2" aria-label="Header" role="region">
    <div class="flex flex-col w-full h-fit">
      {#if showBreadcrumb}
        <div
          class="flex flew-row items-center text-sm text-[var(--pd-content-breadcrumb)]"
          role="navigation"
          aria-label="Breadcrumb">
          {#if breadcrumbLeftPart}
            <Link class="text-sm" aria-label="Back" on:click={onbreadcrumbClick}
              >{breadcrumbLeftPart}</Link>
          {/if}
          {#if breadcrumbRightPart}
            <div class="mx-2">&gt;</div>
            <div class="grow font-extralight" aria-label="Page Name">{breadcrumbRightPart}</div>
          {/if}
          {#if hasClose}
            <CloseButton class="justify-self-end text-lg" onclick={onclose} />
          {/if}
        </div>
      {/if}
      <div class="flex flex-row items-center pt-1">
        {#if icon}
          <div class="pr-3">
            {@render icon()}
          </div>
        {/if}
        <div class="flex flex-col grow pr-2">
          <div class="flex flex-row items-baseline">
            <h1 aria-label={title} class="text-xl font-bold leading-tight text-[var(--pd-content-header)]">
              {title}
            </h1>
            <div class="text-[var(--pd-table-body-text-sub-secondary)] ml-2 leading-normal" class:hidden={!titleDetail}>
              {titleDetail}
            </div>
          </div>
          <div>
            <span class="text-sm leading-none text-[var(--pd-content-sub-header)] line-clamp-1" class:hidden={!subtitle}
              >{subtitle}</span>
            {@render subtitleSnippet?.()}
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex flex-nowrap justify-self-end pl-3 space-x-2" aria-label="Control Actions" role="group">
            {@render actions?.()}
          </div>
          <div class="relative">
            <div bind:this={detailSlot} class="absolute top-0 right-0">
              {@render detail?.()}
            </div>
          </div>
          {#if !showBreadcrumb}
            <CloseButton class="justify-self-end" onclick={onclose} />
          {/if}
        </div>
      </div>
    </div>
  </div>
  {#if inProgress}
    <LinearProgress />
  {/if}
  <div
    class="flex flex-row px-2 border-b border-[var(--pd-content-divider)]"
    style="padding-top: {heightOfDetail > 50 ? '1rem' : '0px'}"
    aria-label="Tabs"
    role="region">
    {@render tabs?.()}
  </div>
  <div class="h-full min-h-0" aria-label="Tab Content" role="region">
    {@render content?.()}
  </div>
</div>
