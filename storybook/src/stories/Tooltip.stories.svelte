<script context="module" lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import { defineMeta } from '@storybook/addon-svelte-csf';

/**
 * These are the stories for the `Tooltip` component.
 * Allow to display a tooltip at a given position (top, bottom, etc.).
 * Supports simple text tooltips and complex content using snippets.
 */
// biome-ignore lint/correctness/noUnusedVariables: Story is used in markup
const { Story } = defineMeta({
  component: Tooltip,
  render: template,
  title: 'Tooltip',
  tags: ['autodocs'],
  argTypes: {
    kind: {
      table: { disable: true },
    },
    tip: {
      control: 'text',
      description: 'Text to show in the tooltip',
      defaultValue: 'This is a tooltip',
    },
    top: {
      control: 'boolean',
      description: 'Flag the tooltip as being at the top',
      defaultValue: false,
    },
    topLeft: {
      control: 'boolean',
      description: 'Flag the tooltip as being at the top left',
      defaultValue: false,
    },
    topRight: {
      control: 'boolean',
      description: 'Flag the tooltip as being at the top right',
      defaultValue: false,
    },
    right: {
      control: 'boolean',
      description: 'Flag the tooltip as being at the right',
      defaultValue: false,
    },
    bottom: {
      control: 'boolean',
      description: 'Flag the tooltip as being at the bottom',
      defaultValue: false,
    },
    bottomLeft: {
      control: 'boolean',
      description: 'Flag the tooltip as being at the bottom left',
      defaultValue: false,
    },
    bottomRight: {
      control: 'boolean',
      description: 'Flag the tooltip as being at the bottom right',
      defaultValue: false,
    },
    left: {
      control: 'boolean',
      description: 'Flag the tooltip as being at the left',
      defaultValue: false,
    },
  },
});

// biome-ignore lint/correctness/noUnusedVariables: used in markup
const placementVariants = [
  { name: 'Top', args: { tip: 'this is a custom top tooltip', top: true } },
  { name: 'Top Left', args: { tip: 'this is a custom top left tooltip', topLeft: true } },
  { name: 'Top Right', args: { tip: 'this is a custom top right tooltip', topRight: true } },
  { name: 'Right', args: { tip: 'this is a custom right tooltip', right: true } },
  { name: 'Bottom', args: { tip: 'this is a custom bottom tooltip', bottom: true } },
  { name: 'Bottom Left', args: { tip: 'this is a custom bottom left tooltip', bottomLeft: true } },
  { name: 'Bottom Right', args: { tip: 'this is a custom bottom right tooltip', bottomRight: true } },
  { name: 'Left', args: { tip: 'this is a custom left tooltip', left: true } },
];

// biome-ignore lint/correctness/noUnusedVariables: used in markup
const longText =
  'This is a very long tooltip message that demonstrates how tooltips handle extended content. It can contain detailed information that users need to understand the context of the UI element.';
</script>

{#snippet template({ ...args })}
  {#if args.kind === 'placements'}
    <div class="bg-(--pd-content-card-bg) p-8">
      <div class="flex flex-col gap-4 text-(--pd-content-text)">
        <div class="text-sm font-semibold text-(--pd-content-text)">Placements</div>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {#each placementVariants as variant (variant.name)}
            <div class="flex flex-col gap-2">
              <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
              <Tooltip {...variant.args}>
                <span
                  class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
                  i
                </span>
              </Tooltip>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else if args.kind === 'long'}
    <div class="bg-(--pd-content-card-bg) p-8">
      <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
        <span>Long text tooltip example</span>
        <Tooltip top tip={longText}>
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
            i
          </span>
        </Tooltip>
      </div>
    </div>
  {:else if args.kind === 'snippet'}
    <div class="bg-(--pd-content-card-bg) p-8">
      <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
        <span>Snippet tooltip content</span>
        <Tooltip>
          {#snippet tipSnippet()}
            <div class="flex flex-col gap-1 max-w-64">
              <div class="font-semibold">Custom snippet content</div>
              <div class="text-xs">
                Useful for richer tooltip layouts with multiple lines of information.
              </div>
            </div>
          {/snippet}
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
            i
          </span>
        </Tooltip>
      </div>
    </div>
  {:else if args.kind === 'container'}
    <div class="bg-(--pd-content-card-bg) p-8">
      <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
        <span>Container/class example</span>
        <Tooltip tip="Top-right tooltip with container class applied" topRight containerClass="inline-flex" class="mb-[20px]">
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
            i
          </span>
        </Tooltip>
      </div>
    </div>
  {:else}
    <div class="bg-(--pd-content-card-bg) p-8">
      <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
        <span>Move mouse over the icon to see the tooltip</span>
        <Tooltip {...args}>
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
            i
          </span>
        </Tooltip>
      </div>
    </div>
  {/if}
{/snippet}

<Story name="Basic" args={{ tip: 'this is a custom tooltip' }} />
<Story name="Placements" args={{ kind: 'placements' }} />
<Story name="Long Text" args={{ kind: 'long' }} />
<Story name="Snippet Content" args={{ kind: 'snippet' }} />
<Story name="Container/Class" args={{ kind: 'container' }} />
