<script lang="ts" generics="T">
import { DetailsPage } from '@podman-desktop/ui-svelte';
import type { Snippet } from 'svelte';
import { router } from 'tinro';

import { currentPage, lastPage } from '../../stores/breadcrumb';

interface Props {
  title: string;
  titleDetail?: string;
  subtitle?: string;

  snippetsData: T;
  contentSnippet?: Snippet<[T]>;
  tabsSnippet?: Snippet<[T]>;
  iconSnippet?: Snippet<[T]>;
  subtitleSnippet?: Snippet<[T]>;
  actionsSnippet?: Snippet<[T]>;
  detailSnippet?: Snippet<[T]>;
}

const {
  title,
  titleDetail = undefined,
  subtitle = undefined,
  snippetsData,
  contentSnippet: localContentSnippet,
  tabsSnippet: localTabsSnippet,
  iconSnippet: localIconSnippet,
  subtitleSnippet: localSubtitleSnippet,
  actionsSnippet: localActionsSnippet,
  detailSnippet: localDetailSnippet,
}: Props = $props();

export function close(): void {
  router.goto($lastPage.path);
}
</script>

<DetailsPage
  title={title}
  titleDetail={titleDetail}
  subtitle={subtitle}
  breadcrumbLeftPart={$lastPage.name}
  breadcrumbRightPart={$currentPage.name}
  breadcrumbTitle="Go back to {$lastPage.name}"
  onclose={close}
  onbreadcrumbClick={close}>

  {#snippet iconSnippet()}{@render localIconSnippet?.(snippetsData)}{/snippet}
  {#snippet subtitleSnippet()}{@render localSubtitleSnippet?.(snippetsData)}{/snippet}
  {#snippet actionsSnippet()}{@render localActionsSnippet?.(snippetsData)}{/snippet}
  {#snippet detailSnippet()}{@render localDetailSnippet?.(snippetsData)}{/snippet}
  {#snippet tabsSnippet()}{@render localTabsSnippet?.(snippetsData)}{/snippet}
  {#snippet contentSnippet()}{@render localContentSnippet?.(snippetsData)}{/snippet}
</DetailsPage>
