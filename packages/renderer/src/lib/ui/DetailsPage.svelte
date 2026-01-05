<script lang="ts">
import { DetailsPage } from '@podman-desktop/ui-svelte';
import type { Snippet } from 'svelte';
import { router } from 'tinro';

import { currentPage, lastPage } from '/@/stores/breadcrumb';

interface Props {
  title: string;
  titleDetail?: string;
  subtitle?: string;

  contentSnippet?: Snippet;
  tabsSnippet?: Snippet;
  iconSnippet?: Snippet;
  subtitleSnippet?: Snippet;
  actionsSnippet?: Snippet;
  detailSnippet?: Snippet;
}

const {
  title,
  titleDetail = undefined,
  subtitle = undefined,
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
  onclose={close}
  onbreadcrumbClick={close}>

  {#snippet iconSnippet()}{@render localIconSnippet?.()}{/snippet}
  {#snippet subtitleSnippet()}{@render localSubtitleSnippet?.()}{/snippet}
  {#snippet actionsSnippet()}{@render localActionsSnippet?.()}{/snippet}
  {#snippet detailSnippet()}{@render localDetailSnippet?.()}{/snippet}
  {#snippet tabsSnippet()}{@render localTabsSnippet?.()}{/snippet}
  {#snippet contentSnippet()}{@render localContentSnippet?.()}{/snippet}
</DetailsPage>
