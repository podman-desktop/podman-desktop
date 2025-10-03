<script context="module" lang="ts">
import Spinner from '@podman-desktop/ui-svelte/Spinner';
import { type Args, defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';

const { Story } = defineMeta({
  component: Spinner,
  render: template,
  title: 'Progress/Spinner',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'text',
      description: 'Size of the spinner (CSS value). Accepts any CSS unit (px, em, rem, etc.) or unitless numbers.',
      defaultValue: '2em',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '2em' },
      },
    },
    class: {
      control: 'text',
      description: 'Additional CSS classes for custom styling.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    style: {
      control: 'text',
      description: 'Inline CSS styles for advanced customization (e.g., filters, transforms).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
A modern, accessible spinner component for displaying indeterminate progress states in Podman Desktop.

## Overview

The \`Spinner\` component provides an animated circular progress indicator used throughout the application
to show loading states, background operations, and processing activities. It features a smooth, continuous
rotation animation with a gradient-masked circle design.

## Accessibility

The component implements proper ARIA attributes:
- \`role="progressbar"\` - Indicates an element displaying progress status
- \`aria-label="Loading"\` - Provides screen reader description
- \`aria-busy="true"\` - Indicates active loading state

## Common Size Patterns

| Size | Use Case |
|------|----------|
| \`12\` or \`12px\` | Connection badges, inline status indicators |
| \`1em\` | Button loading states, input fields |
| \`1.4em\` | Status icons (deleting, updating) |
| \`1.5em\` | Toast notifications |
| \`2em\` | Default standalone spinner |
| \`4em\` | Large loading screens |

## Implementation Details

The spinner uses two synchronized SVG animations:
1. **Rotation**: Continuous 360° rotation with variable speed (3s duration)
2. **Mask Animation**: Oscillating gradient mask that creates a "chasing" effect (1.5s duration)

## Best Practices

1. **Size Selection**: Match the spinner size to the context (text-inline vs. standalone)
3. **Accessibility**: Always provide context (adjacent text or container labels)
4. **Performance**: Use sparingly - don't render dozens simultaneously
5. **User Feedback**: Combine with explanatory text when possible
      `,
      },
    },
  },
});
</script>

{#snippet template({ _children, ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  <Spinner {...args} />
{/snippet}

<Story name="Default Size (2em)" args={{}} />

<Story name="Small (1em)" args={{ size: '1em' }} />

<Story name="Medium Button Size (1.4em)" args={{ size: '1.4em' }} />

<Story name="Toast Size (1.5em)" args={{ size: '1.5em' }} />

<Story name="Tiny (12px)" args={{ size: '12px' }} />

<Story name="Tiny (12 - no unit)" args={{ size: '12' }} />

<Story name="Large (4em)" args={{ size: '4em' }} />

<Story name="On Dark Background">
  {#snippet children(args: Args<typeof Story>, _context: StoryContext<typeof Story>)}
    <div class="bg-[var(--pd-content-card-bg)] p-4 rounded">
      <Spinner {...args} />
    </div>
  {/snippet}
</Story>

<Story name="On Light Background">
  {#snippet children(args: Args<typeof Story>, _context: StoryContext<typeof Story>)}
    <div class="bg-white p-4 rounded">
      <Spinner {...args} class="text-gray-800" />
    </div>
  {/snippet}
</Story>

<Story name="With Custom Color">
  {#snippet children(args: Args<typeof Story>, _context: StoryContext<typeof Story>)}
    <div class="p-4">
      <Spinner {...args} class="text-purple-500" />
    </div>
  {/snippet}
</Story>

<Story name="In Button (Loading State)">
  {#snippet children(_args: Args<typeof Story>, _context: StoryContext<typeof Story>)}
    <button
      class="px-4 py-2 bg-[var(--pd-button-primary-bg)] text-[var(--pd-button-text)] rounded flex items-center gap-2"
      disabled>
      <Spinner size="1em" />
      <span>Loading...</span>
    </button>
  {/snippet}
</Story>

<Story name="In Status Icon (Deleting)">
  {#snippet children(_args: Args<typeof Story>, _context: StoryContext<typeof Story>)}
    <div class="flex items-center gap-2 p-4">
      <div class="grid place-content-center rounded-sm aspect-square text-xs">
        <Spinner size="1.4em" />
      </div>
      <span>Deleting resource...</span>
    </div>
  {/snippet}
</Story>

<Story name="In Toast Notification">
  {#snippet children(_args: Args<typeof Story>, _context: StoryContext<typeof Story>)}
    <div
      class="flex flex-row gap-2 items-center min-h-10 p-2 border rounded-md bg-[var(--pd-modal-bg)] border-[var(--pd-content-divider)]">
      <Spinner size="1.5em" class="text-[var(--pd-state-info)]" />
      <span class="text-[var(--pd-card-text)]">Processing your request...</span>
    </div>
  {/snippet}
</Story>

<Story name="In Input Field (Typeahead)">
  {#snippet children(_args: Args<typeof Story>, _context: StoryContext<typeof Story>)}
    <div class="flex flex-row items-center px-2 py-1 bg-[var(--pd-input-field-bg)] border-b rounded w-64">
      <input type="text" class="flex-1 bg-transparent outline-none" placeholder="Searching..." disabled />
      <Spinner size="1em" />
    </div>
  {/snippet}
</Story>

<Story name="Centered with Text">
  {#snippet children(_args: Args<typeof Story>, _context: StoryContext<typeof Story>)}
    <div class="flex flex-col items-center gap-2 p-8">
      <Spinner />
      <div class="text-[var(--pd-content-text)]">Initializing</div>
    </div>
  {/snippet}
</Story>

<Story name="With Connection Badge">
  {#snippet children(_args: Args<typeof Story>, _context: StoryContext<typeof Story>)}
    <div class="flex items-center gap-1 p-4">
      <Spinner size="12px" />
      <span class="text-sm">Checking connection...</span>
    </div>
  {/snippet}
</Story>

<Story name="With Custom Class" args={{ class: 'opacity-50' }} />

<Story name="With Custom Style" args={{ style: 'filter: hue-rotate(180deg);' }} />

<Story name="Multiple Spinners (Size Comparison)">
  {#snippet children(_args: Args<typeof Story>, _context: StoryContext<typeof Story>)}
    <div class="flex items-center gap-4 p-4">
      <div class="flex flex-col items-center gap-1">
        <Spinner size="12" />
        <span class="text-xs">12 (no unit)</span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <Spinner size="12px" />
        <span class="text-xs">12px</span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <Spinner size="1em" />
        <span class="text-xs">1em</span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <Spinner size="1.4em" />
        <span class="text-xs">1.4em</span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <Spinner size="1.5em" />
        <span class="text-xs">1.5em</span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <Spinner size="2em" />
        <span class="text-xs">2em (default)</span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <Spinner size="4em" />
        <span class="text-xs">4em</span>
      </div>
    </div>
  {/snippet}
</Story>
