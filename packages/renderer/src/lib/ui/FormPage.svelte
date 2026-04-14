<script lang="ts">
import { FormPage } from '@podman-desktop/ui-svelte';
import type { Snippet } from 'svelte';
import { router } from 'tinro';

import { currentPage, lastPage } from '/@/stores/breadcrumb';

interface Props {
  title: string;
  inProgress?: boolean;
  icon?: Snippet;
  actions?: Snippet;
  content?: Snippet;
}

const { title, inProgress = false, icon: localIcon, actions: localActions, content: localContent }: Props = $props();

export function goToPreviousPage(): void {
  router.goto($lastPage.path);
}
</script>

<FormPage
  title={title}
  inProgress={inProgress}
  breadcrumbLeftPart={$lastPage.name}
  breadcrumbRightPart={$currentPage.name}
  onclose={goToPreviousPage}
  onbreadcrumbClick={goToPreviousPage}>
  {#snippet icon()}{@render localIcon?.()}{/snippet}
  {#snippet actions()}{@render localActions?.()}{/snippet}
  {#snippet content()}{@render localContent?.()}{/snippet}
</FormPage>
