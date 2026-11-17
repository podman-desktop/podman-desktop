<script lang="ts">
import { createEventDispatcher, type Snippet } from 'svelte';

import { LinearProgress } from '..';
import CloseButton from '../button/CloseButton.svelte';
import Link from '../link/Link.svelte';
import Tooltip from '../tooltip/Tooltip.svelte';

interface Props {
  title: string;
  titleDetail?: string;
  clampTitle?: boolean;
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
  clampTitle = false,
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

let showBreadcrumb = breadcrumbLeftPart ?? breadcrumbRightPart;
let titleElement = $state<HTMLHeadingElement>();
let isTitleTruncated = $state(false);

$effect(() => {
  const heading = titleElement;
  const headingText = title;
  const shouldClamp = clampTitle;
  if (!heading || !shouldClamp) {
    isTitleTruncated = false;
    return;
  }

  const updateTitleOverflow = (): void => {
    isTitleTruncated = shouldClamp && headingText.length > 0 && heading.scrollHeight > heading.clientHeight;
  };

  const observer = new ResizeObserver(updateTitleOverflow);
  observer.observe(heading);
  const fonts = heading.ownerDocument.fonts;
  fonts?.addEventListener('loadingdone', updateTitleOverflow);
  updateTitleOverflow();
  return (): void => {
    observer.disconnect();
    fonts?.removeEventListener('loadingdone', updateTitleOverflow);
  };
});

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
      <div class="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
        <div class="flex min-w-0 grow basis-44 items-center">
          {#if icon}
            <div class="shrink-0 pr-3">
              {@render icon()}
            </div>
          {/if}
          <div class="flex min-w-0 grow flex-col wrap-anywhere">
            <div class="flex flex-wrap items-baseline gap-x-2">
              <Tooltip
                bottomLeft
                containerClass="min-w-0"
                class="block max-w-[calc(100vw-1rem)]"
                tip={isTitleTruncated ? title : undefined}>
                <!-- svelte-ignore a11y_no_noninteractive_tabindex (focus exposes the truncated title in a tooltip) -->
                <h1
                  bind:this={titleElement}
                  aria-label={title}
                  {title}
                  tabindex={isTitleTruncated ? 0 : undefined}
                  class="min-w-0 text-xl font-bold leading-tight text-(--pd-content-header) focus-visible:outline-(--pd-button-focus-ring)"
                  class:line-clamp-2={clampTitle}>
                  {title}
                </h1>
              </Tooltip>
              <div class="leading-normal text-(--pd-table-body-text-sub-secondary)" class:hidden={!titleDetail}>
                {titleDetail}
              </div>
            </div>
            <div>
              <span
                class="text-sm leading-none text-(--pd-content-sub-header) line-clamp-1"
                class:hidden={!subtitle}>{subtitle}</span>
              {@render subtitleSnippet?.()}
            </div>
          </div>
        </div>
        <div class="ml-auto flex max-w-full flex-col">
          <div class="flex flex-wrap justify-end-safe gap-2" aria-label="Control Actions" role="group">
            {@render actions?.()}
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
  <div class="flex flex-row-reverse flex-wrap items-end border-b border-(--pd-content-divider)">
    {#if detail}
      <!-- Reuse the header's bottom padding so tall details don't add another band above the tabs. -->
      <div class="max-w-full pr-5" class:-mt-2={!inProgress} aria-label="Page details" role="region">
        {@render detail()}
      </div>
    {/if}
    <div
      class="flex min-w-0 grow basis-28 overflow-x-auto px-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--pd-content-sub-header)"
      aria-label="Tabs"
      role="region">
      {@render tabs?.()}
    </div>
  </div>
  <div class="h-full min-h-0" aria-label="Tab Content" role="region">
    {@render content?.()}
  </div>
</div>
