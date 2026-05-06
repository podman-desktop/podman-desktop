<script context="module" lang="ts">
import ProgressBar from '@podman-desktop/ui-svelte/ProgressBar';
import { defineMeta } from '@storybook/addon-svelte-csf';

/**
 * Stories for the `ProgressBar` component from `packages/renderer`.
 *
 * A linear progress indicator supporting determinate (0-100% with percentage text)
 * and indeterminate (animated sweep for unknown duration) modes. Used in the Task Manager
 * table and the bottom Status Bar.
 *
 * **Accessibility**: The inner bar uses `role="progressbar"`. Additional ARIA attributes
 * (e.g. `aria-label`) can be passed and are spread onto the wrapper element.
 *
 * **Theming**: Uses CSS custom properties `--pd-progressBar-bg` and
 * `--pd-progressBar-in-progress-bg` from the color registry.
 */
const { Story } = defineMeta({
  component: ProgressBar,
  render: template,
  title: 'Progress/ProgressBar',
  tags: ['autodocs'],
  argTypes: {
    progress: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100). Undefined shows indeterminate animation.',
    },
    width: {
      control: 'text',
      description: 'Tailwind width class for the bar',
    },
    height: {
      control: 'text',
      description: 'Tailwind height class for the bar',
    },
    class: {
      control: 'text',
      description: 'Additional CSS classes on the wrapper element',
    },
    kind: {
      table: { disable: true },
    },
  },
});

type ProgressVariant = { label: string; progress?: number; note?: string };

const progressVariants: ProgressVariant[] = [
  { label: 'Indeterminate', progress: undefined, note: 'progress=undefined' },
  { label: '0%', progress: 0 },
  { label: '25%', progress: 25 },
  { label: '50%', progress: 50 },
  { label: '75%', progress: 75 },
  { label: '100%', progress: 100 },
];

const roundingVariants: ProgressVariant[] = [
  { label: '100/3', progress: 100 / 3, note: 'Displays as 33%' },
  { label: '200/3', progress: 200 / 3, note: 'Displays as 67%' },
  { label: '5/3', progress: 5 / 3, note: 'Displays as 2%' },
  { label: '99.9', progress: 99.9, note: 'Displays as 100%' },
];

type DimensionVariant = { label: string; width: string; height: string; note?: string };

const dimensionVariants: DimensionVariant[] = [
  { label: 'Default (w-36, h-4)', width: 'w-36', height: 'h-4', note: 'Component defaults' },
  { label: 'Compact (w-20, h-1)', width: 'w-20', height: 'h-1', note: 'Used in Task Manager and Status Bar' },
  { label: 'Wide (w-48, h-2)', width: 'w-48', height: 'h-2' },
  { label: 'Full width (w-full, h-2)', width: 'w-full', height: 'h-2' },
];
</script>

{#snippet template({ _children, ...args })}
  {#if args.kind === 'levels'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {#each progressVariants as variant (variant.label)}
          <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
            <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

            <div class="py-2">
              <ProgressBar progress={variant.progress} />
            </div>

            {#if variant.note}
              <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {:else if args.kind === 'dimensions'}
    <div class="flex flex-col gap-6">
      <div class="text-sm text-(--pd-content-text)">
        Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
      </div>

      {#each dimensionVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar width={variant.width} height={variant.height} progress={65} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  {:else if args.kind === 'rounding'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Percentage text uses <code>Math.round()</code> for display.
      </div>

      <div class="grid grid-cols-2 gap-4">
        {#each roundingVariants as variant (variant.label)}
          <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
            <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

            <div class="py-2">
              <ProgressBar progress={variant.progress} />
            </div>

            {#if variant.note}
              <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {:else if args.kind === 'accessibility'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        The inner bar element uses <code>role="progressbar"</code>. Note: <code>aria-label</code> and other
        ARIA props land on the outer wrapper via <code>restProps</code>, not on the inner element with
        <code>role="progressbar"</code>.
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Determinate with role</div>

          <div class="py-2">
            <ProgressBar progress={50} />
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate with role</div>

          <div class="py-2">
            <ProgressBar />
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

          <div class="py-2">
            <ProgressBar progress={75} aria-label="Downloading image" />
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Downloading image"</code>
        </div>
      </div>
    </div>
  {:else if args.kind === 'contexts'}
    <div class="flex flex-col gap-6 text-(--pd-content-text)">
      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

        <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
          <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
          <div class="flex items-center gap-x-2">
            <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

        <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
          <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

        <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
          <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
          <ProgressBar class="items-center" height="h-1" width="w-20" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
          <div class="text-sm">Installing extension from OCI image...</div>
          <ProgressBar progress={68} />
        </div>
      </div>
    </div>
  {:else}
    <ProgressBar {...args} />
  {/if}
{/snippet}

<Story name="Basic" args={{ progress: 50 }} />
<Story
  name="Progress Levels"
  args={{
    kind: 'levels',
  }} />
<Story
  name="Dimensions"
  args={{
    kind: 'dimensions',
  }} />
<Story
  name="Rounding"
  args={{
    kind: 'rounding',
  }} />
<Story
  name="Accessibility"
  args={{
    kind: 'accessibility',
  }} />
<Story
  name="Contexts"
  args={{
    kind: 'contexts',
  }} />
