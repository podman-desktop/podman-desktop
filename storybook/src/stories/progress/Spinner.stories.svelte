<script context="module" lang="ts">
import { Button, StatusIcon } from '@podman-desktop/ui-svelte';
import Spinner from '@podman-desktop/ui-svelte/Spinner';
import { defineMeta } from '@storybook/addon-svelte-csf';

/**
 * These are the stories for the `Spinner` component.
 * Displays undeterminate progres through a circle/spinner.
 */
const { Story } = defineMeta({
  component: Spinner,
  render: template,
  title: 'Progress/Spinner',
  tags: ['autodocs'],
  argTypes: {
    kind: {
      table: { disable: true },
    },
  },
});

const sizeVariants: { label: string; size?: string }[] = [
  { label: 'Default (2em)' },
  { label: '2em', size: '2em' },
  { label: '1em', size: '1em' },
  { label: '1.4em', size: '1.4em' },
  { label: '1.5em', size: '1.5em' },
  { label: '12px', size: '12px' },
  { label: '12', size: '12' },
  { label: '16px', size: '16px' },
];
</script>

{#snippet template({ _children, ...args })}
  {#if args.kind === 'sizes'}
    <div class="pd-spinner-story flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Sizes used across the app (values preserved exactly).
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {#each sizeVariants as variant (variant.label)}
          <div class="flex flex-col items-center gap-2 rounded-md border border-(--pd-content-divider) p-3">
            <div class="text-xs text-(--pd-content-text)">{variant.label}</div>
            {#if variant.size}
              <Spinner size={variant.size} />
            {:else}
              <Spinner />
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {:else if args.kind === 'contexts'}
    <div class="pd-spinner-story flex flex-col gap-6 text-(--pd-content-text)">
      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Button in progress</div>
        <Button inProgress={true}>Creating</Button>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">StatusIcon deleting/updating</div>

        <div class="flex flex-row items-center gap-3">
          <StatusIcon status="DELETING" />
          <StatusIcon status="UPDATING" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Toast in-progress state</div>

        <div class="flex flex-nowrap min-h-10 cursor-default max-h-50 max-w-(--toastWidth) flex-row gap-2 rounded-md border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base">
          <div class="mr-1 text-(--pd-state-info)">
            <Spinner size="1.5em" />
          </div>

          <div class="text-base text-(--pd-card-text)">In progress: Pulling image</div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Preflight check pending</div>

        <div class="flex flex-row items-center gap-2">
          <Spinner size="1em" />
          <div>Checking prerequisites</div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Typeahead loading</div>

        <div class="flex flex-row items-center gap-2 rounded-md border border-(--pd-input-field-stroke) bg-(--pd-input-field-bg) px-2 py-1">
          <div class="text-sm text-(--pd-input-field-placeholder-text)">Search...</div>
          <Spinner size="1em" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Kubernetes context checking</div>

        <div class="flex flex-row items-center gap-2">
          <Spinner size="12px" />
          <div>Checking context health</div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Markdown command button loading</div>

        <button class="flex flex-row items-center px-4 py-[6px] rounded-[4px] text-white text-[13px] whitespace-nowrap bg-purple-600 hover:bg-purple-500 no-underline">
          <div class="mr-2">
            <Spinner size="16px" />
          </div>
          Run command
        </button>
      </div>
    </div>
  {:else}
    <Spinner {...args} />
  {/if}
{/snippet}

<Story name="Basic" />
<Story
  name="Sizes"
  args={{
    kind: 'sizes',
  }} />
<Story
  name="Contexts"
  args={{
    kind: 'contexts',
  }} />

<style>
  :global(body.light .pd-spinner-story) {
    --pd-content-text: #1f2937;
    --pd-content-header: #111827;
    --pd-content-divider: #e5e7eb;
    --pd-modal-bg: #ffffff;
    --pd-state-info: #2563eb;
    --pd-card-text: #111827;
    --pd-input-field-stroke: #d1d5db;
    --pd-input-field-bg: #ffffff;
    --pd-input-field-placeholder-text: #6b7280;
    --toastWidth: 420px;
  }

  :global(body.dark .pd-spinner-story) {
    --pd-content-text: #e5e7eb;
    --pd-content-header: #f9fafb;
    --pd-content-divider: #374151;
    --pd-modal-bg: #1f2937;
    --pd-state-info: #93c5fd;
    --pd-card-text: #f9fafb;
    --pd-input-field-stroke: #4b5563;
    --pd-input-field-bg: #111827;
    --pd-input-field-placeholder-text: #9ca3af;
    --toastWidth: 420px;
  }
</style>
