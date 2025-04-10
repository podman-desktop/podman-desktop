<script lang="ts">
import type { Snippet } from 'svelte';

import Page from './Page.svelte';

interface Props {
  title: string;
  titleDetail?: string;
  subtitle?: string;
  breadcrumbLeftPart?: string;
  breadcrumbRightPart?: string;
  breadcrumbTitle?: string;
  onclose?: () => void;
  onbreadcrumbClick?: () => void;
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
  breadcrumbLeftPart = undefined,
  breadcrumbRightPart = undefined,
  breadcrumbTitle = '',
  onclose = (): void => {},
  onbreadcrumbClick = (): void => {},
  contentSnippet,
  tabsSnippet,
  iconSnippet,
  subtitleSnippet,
  actionsSnippet,
  detailSnippet,
}: Props = $props();
</script>

<Page
  title={title}
  titleDetail={titleDetail}
  subtitle={subtitle}
  breadcrumbLeftPart={breadcrumbLeftPart}
  breadcrumbRightPart={breadcrumbRightPart}
  breadcrumbTitle={breadcrumbTitle}
  onclose={onclose}
  onbreadcrumbClick={onbreadcrumbClick}>
  <div slot="content" class="h-full bg-[var(--pd-details-bg)] min-h-0">
    {@render contentSnippet?.()}
  </div>
  <div slot="tabs" class="flex flex-row px-2">
    {@render tabsSnippet?.()}
  </div>
  <svelte:fragment slot="icon">
    {@render iconSnippet?.()}
  </svelte:fragment>
  <svelte:fragment slot="subtitle">
    {@render subtitleSnippet?.()}
  </svelte:fragment>
  <svelte:fragment slot="actions">
    {@render actionsSnippet?.()}
  </svelte:fragment>
  <svelte:fragment slot="detail">
    {@render detailSnippet?.()}
  </svelte:fragment>
</Page>
