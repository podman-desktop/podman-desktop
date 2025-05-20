<script lang="ts">
import type { Snippet } from 'svelte';

import Page from './Page.svelte';

interface Props {
  title: string;
  inProgress?: boolean;
  breadcrumbLeftPart?: string;
  breadcrumbRightPart?: string;
  onclose?: () => void;
  onbreadcrumbClick?: () => void;
  icon?: Snippet;
  actions?: Snippet;
  content?: Snippet;
}

const {
  title,
  inProgress = false,
  breadcrumbLeftPart = undefined,
  breadcrumbRightPart = undefined,
  onclose = (): void => {},
  onbreadcrumbClick = (): void => {},
  icon,
  actions,
  content,
}: Props = $props();
</script>

<Page
  title={title}
  breadcrumbLeftPart={breadcrumbLeftPart}
  breadcrumbRightPart={breadcrumbRightPart}
  inProgress={inProgress}
  onclose={onclose}
  onbreadcrumbClick={onbreadcrumbClick}>
  <svelte:fragment slot="icon">
    {@render icon?.()}
  </svelte:fragment>
  <svelte:fragment slot="actions">
    {@render actions?.()}
  </svelte:fragment>
  <div slot="content" class="flex w-full h-full overflow-auto">
    {@render content?.()}
  </div>
</Page>
