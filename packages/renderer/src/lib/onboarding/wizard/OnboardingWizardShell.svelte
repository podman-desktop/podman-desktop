<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

interface Props extends HTMLAttributes<HTMLDivElement> {
  leftSidebar: Snippet;
  leftSidebarFooter: Snippet;
  rightContent: Snippet;
  footer: Snippet;
  sidebarTitle?: string;
}

let {
  leftSidebar,
  leftSidebarFooter,
  rightContent,
  footer,
  sidebarTitle = 'Get started',
  class: className,
  ...restProps
}: Props = $props();
</script>

<div class={['flex h-full w-full overflow-hidden', className]} {...restProps}>
  <aside
    class="flex min-h-full w-90 min-w-90 shrink-0 flex-col border-r border-(--pd-content-card-border) bg-(--pd-content-bg)">
    <div class="flex h-full flex-col justify-between px-8 pt-12 pb-8">
      <div class="flex min-h-0 flex-1 flex-col gap-8">
        <div class="text-3xl font-semibold leading-none text-(--pd-content-header)">{sidebarTitle}</div>
        <div class="min-h-0 flex-1 overflow-y-auto">
          {@render leftSidebar?.()}
        </div>
      </div>
      {#if leftSidebarFooter}
        <div class="max-w-xs">
          {@render leftSidebarFooter()}
        </div>
      {/if}
    </div>
  </aside>

  <section
    aria-label="Content"
    class="relative flex min-h-full min-w-0 flex-1 flex-col overflow-hidden bg-linear-to-br from-(--pd-content-bg) via-(--pd-content-card-bg) to-(--pd-content-bg)">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-linear-to-br from-transparent via-transparent to-(--pd-button-primary-bg) opacity-10">
    </div>
    <div class="relative z-10 min-h-0 flex-1 overflow-y-auto p-8 lg:p-10">
      {@render rightContent?.()}
    </div>
    {#if footer}
      <footer class="relative z-10 border-t border-(--pd-content-card-border) bg-transparent px-8 py-5 lg:px-10">
        {@render footer()}
      </footer>
    {/if}
  </section>
</div>
