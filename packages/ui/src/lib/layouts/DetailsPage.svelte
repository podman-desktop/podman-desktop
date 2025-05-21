<script lang="ts">
import type { Snippet } from 'svelte';

import Page from './Page.svelte';

interface Props {
  title: string;
  titleDetail?: string;
  subtitle?: string;
  breadcrumbLeftPart?: string;
  breadcrumbRightPart?: string;
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
  onclose = (): void => {},
  onbreadcrumbClick = (): void => {},
  contentSnippet,
  tabsSnippet,
  iconSnippet,
  subtitleSnippet: thisSubtitleSnippet,
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
  onclose={onclose}
  onbreadcrumbClick={onbreadcrumbClick}>
  {#snippet content()}
    <div class="h-full bg-[var(--pd-details-bg)] min-h-0">
      {@render contentSnippet?.()}
    </div>
  {/snippet}
  {#snippet tabs()}
    <div class="flex flex-row px-2">
      {@render tabsSnippet?.()}
    </div>
  {/snippet}
  {#snippet icon()}
    {@render iconSnippet?.()}
  {/snippet}
  {#snippet subtitleSnippet()}
    {@render thisSubtitleSnippet?.()}
  {/snippet}
  {#snippet actions()}
    {@render actionsSnippet?.()}
  {/snippet}
  {#snippet detail()}
    {@render detailSnippet?.()}
  {/snippet}
</Page>
