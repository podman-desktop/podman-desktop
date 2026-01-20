<script context="module" lang="ts">
import { faBell } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowCircleDown,
  faArrowUpRightFromSquare,
  faBroom,
  faCube,
  faMinusCircle,
  faPlay,
  faPlusCircle,
  faRocket,
  faStop,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Button from '@podman-desktop/ui-svelte/Button';
import { defineMeta } from '@storybook/addon-svelte-csf';
import { fn } from 'storybook/test';

const onclickFn = fn().mockName('onclick');

/**
 * These are the stories for the `Button` component.
 * It's the default button we use throughout our application.
 *
 * This collection showcases button types, states, and usage patterns
 * found in the Podman Desktop application.
 */
// biome-ignore lint/correctness/noUnusedVariables: Story is used in markup
const { Story } = defineMeta({
  component: Button,
  render: template,
  title: 'Button/Button',
  tags: ['autodocs'],
  argTypes: {
    kind: {
      table: { disable: true },
    },
  },
  args: {
    onclick: onclickFn,
  },
});

type ButtonVariant = {
  name: string;
  args: Record<string, unknown>;
};

const basicVariants: ButtonVariant[] = [
  { name: 'Primary', args: { type: 'primary', content: 'Primary' } },
  { name: 'Secondary', args: { type: 'secondary', content: 'Secondary' } },
  { name: 'Danger', args: { type: 'danger', content: 'Danger' } },
  { name: 'Link', args: { type: 'link', content: 'Link' } },
  { name: 'Tab', args: { type: 'tab', content: 'Tab' } },
  { name: 'Tab Selected', args: { type: 'tab', content: 'Selected Tab', selected: true } },
  { name: 'Default (No Type)', args: { content: 'Default Button' } },
];

const stateVariants: ButtonVariant[] = [
  { name: 'Primary Disabled', args: { type: 'primary', content: 'Primary Disabled', disabled: true } },
  { name: 'Secondary Disabled', args: { type: 'secondary', content: 'Secondary Disabled', disabled: true } },
  { name: 'Danger Disabled', args: { type: 'danger', content: 'Danger Disabled', disabled: true } },
  { name: 'Primary Loading', args: { type: 'primary', content: 'Loading', inProgress: true } },
  { name: 'Secondary Loading', args: { type: 'secondary', content: 'Loading', inProgress: true } },
  { name: 'Danger Loading', args: { type: 'danger', content: 'Loading', inProgress: true } },
  {
    name: 'Loading With Icon',
    args: { type: 'primary', content: 'Loading with Icon', inProgress: true, icon: faBell },
  },
  {
    name: 'Disabled + Loading',
    args: { type: 'primary', content: 'Disabled + Loading', disabled: true, inProgress: true },
  },
];

const iconVariants: ButtonVariant[] = [
  { name: 'Primary With Icon', args: { type: 'primary', content: 'With Icon', icon: faBell } },
  { name: 'Secondary With Icon', args: { type: 'secondary', content: 'With Icon', icon: faPlay } },
  { name: 'Danger With Icon', args: { type: 'danger', content: 'With Icon', icon: faTrash } },
  { name: 'Link With Icon', args: { type: 'link', content: 'More details', icon: faArrowUpRightFromSquare } },
  { name: 'Icon Only', args: { type: 'primary', icon: faTrash, 'aria-label': 'Delete' } },
  { name: 'Icon Only Secondary', args: { type: 'secondary', icon: faPlusCircle, 'aria-label': 'Add' } },
  { name: 'Icon Only With Title', args: { type: 'primary', icon: faPlusCircle, title: 'Add build argument' } },
  {
    name: 'Disabled Icon Only',
    args: {
      type: 'secondary',
      icon: faPlusCircle,
      disabled: true,
      title: 'Cannot add more items',
      'aria-label': 'Add item',
    },
  },
];

const exampleVariants: ButtonVariant[] = [
  { name: 'Build', args: { type: 'primary', content: 'Build', icon: faCube } },
  { name: 'Pull Image', args: { type: 'primary', content: 'Pull image', icon: faArrowCircleDown } },
  { name: 'Install', args: { type: 'primary', content: 'Install', icon: faRocket } },
  { name: 'Prune', args: { type: 'primary', content: 'Prune', icon: faTrash, title: 'Remove unused data' } },
  { name: 'Cleanup', args: { type: 'danger', content: 'Cleanup / Purge data', icon: faBroom } },
  { name: 'Clear All', args: { type: 'primary', content: 'Clear all', icon: faTrash } },
  { name: 'Start', args: { type: 'primary', content: 'Start', icon: faPlay } },
  { name: 'Stop', args: { type: 'primary', content: 'Stop', icon: faStop } },
  { name: 'Add', args: { type: 'primary', content: 'Add' } },
  { name: 'Cancel (Secondary)', args: { type: 'secondary', content: 'Cancel' } },
  { name: 'Cancel (Link)', args: { type: 'link', content: 'Cancel' } },
  { name: 'Skip', args: { type: 'secondary', content: 'Skip' } },
  { name: 'Next', args: { type: 'primary', content: 'Next' } },
  { name: 'Login', args: { type: 'primary', content: 'Login' } },
  { name: 'Login Disabled', args: { type: 'primary', content: 'Login', disabled: true } },
  { name: 'Login Loading', args: { type: 'primary', content: 'Login', inProgress: true } },
  { name: 'Add Build Argument', args: { type: 'secondary', icon: faPlusCircle, 'aria-label': 'Add build argument' } },
  {
    name: 'Delete Build Argument',
    args: { type: 'secondary', icon: faMinusCircle, 'aria-label': 'Delete build argument' },
  },
];

const patternVariants: ButtonVariant[] = [
  { name: 'Full Width', args: { type: 'primary', content: 'Full Width Button', class: 'w-full' } },
  { name: 'Full Width With Icon', args: { type: 'primary', content: 'Build', icon: faCube, class: 'w-full' } },
  { name: 'Custom Padding Small', args: { type: 'primary', content: 'Small Padding', padding: 'px-2 py-1' } },
  { name: 'Custom Padding Large', args: { type: 'primary', content: 'Large Padding', padding: 'px-6 py-3' } },
  {
    name: 'Custom Padding Compact',
    args: { type: 'primary', content: 'Update to v1.2.3', padding: 'px-3 py-0.5', icon: faRocket },
  },
  {
    name: 'Disabled With Validation',
    args: { type: 'primary', content: 'Submit', disabled: true, title: 'Form contains invalid fields' },
  },
  { name: 'Loading Installation', args: { type: 'primary', content: 'Install', icon: faRocket, inProgress: true } },
  { name: 'Loading Pull', args: { type: 'primary', content: 'Pull image', icon: faArrowCircleDown, inProgress: true } },
  { name: 'With Margin Right', args: { type: 'secondary', content: 'Cancel', class: 'mr-3' } },
  { name: 'With Margin Left', args: { type: 'link', content: 'Link Button', class: 'ml-3' } },
  { name: 'Auto Width', args: { type: 'primary', content: 'Auto Width', class: 'w-auto' } },
  { name: 'Link With Underline', args: { type: 'link', content: 'Underlined Link', class: 'underline' } },
];

const edgeVariants: ButtonVariant[] = [
  {
    name: 'Very Long Text',
    args: { type: 'primary', content: 'This is a button with very long text that might wrap or overflow' },
  },
  { name: 'Empty Text With Icon', args: { type: 'primary', icon: faTrash } },
  { name: 'Hidden Button', args: { type: 'primary', content: 'Hidden', hidden: true } },
  { name: 'Custom Class', args: { type: 'primary', content: 'Custom Class', class: 'opacity-50 hover:opacity-100' } },
  {
    name: 'Custom Aria Label',
    args: { type: 'primary', content: 'Button', 'aria-label': 'Custom accessible label for screen readers' },
  },
  {
    name: 'All Props',
    args: {
      type: 'primary',
      content: 'All Props',
      icon: faBell,
      title: 'This is a tooltip',
      'aria-label': 'Accessible label',
      class: 'custom-class',
    },
  },
];

const tabVariants: ButtonVariant[] = [
  { name: 'Tab Group Unselected', args: { type: 'tab', content: 'All', selected: false } },
  { name: 'Tab Group Selected', args: { type: 'tab', content: 'Running', selected: true } },
  { name: 'Tab Capitalize', args: { type: 'tab', content: 'completed', class: 'capitalize', selected: false } },
  { name: 'Tab Capitalize Selected', args: { type: 'tab', content: 'completed', class: 'capitalize', selected: true } },
  { name: 'Tab With Custom Class', args: { type: 'tab', content: 'Custom Tab', class: 'capitalize' } },
];

// biome-ignore lint/correctness/noUnusedVariables: used in markup
const groupKinds: Record<string, { label: string; variants: ButtonVariant[] }> = {
  basic: { label: 'Basic Types', variants: basicVariants },
  states: { label: 'States', variants: stateVariants },
  icons: { label: 'Icons', variants: iconVariants },
  examples: { label: 'Examples', variants: exampleVariants },
  patterns: { label: 'Patterns', variants: patternVariants },
  edges: { label: 'Edge Cases', variants: edgeVariants },
  tabs: { label: 'Tabs', variants: tabVariants },
};
</script>

{#snippet template({ ...args })}
  {#if args.kind && groupKinds[args.kind]}
    <div class="bg-(--pd-content-card-bg) p-4">
      <div class="flex flex-col gap-4">
        <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each groupKinds[args.kind].variants as variant (variant.name)}
            <div class="flex flex-col gap-2">
              <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
              <Button {...variant.args}>{variant.args.content}</Button>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <div class="bg-(--pd-content-card-bg) p-4">
      <Button {...args}>{args.content}</Button>
    </div>
  {/if}
{/snippet}

<Story name="Basic" args={{ kind: 'basic' }} />
<Story name="States" args={{ kind: 'states' }} />
<Story name="Icons" args={{ kind: 'icons' }} />
<Story name="Examples" args={{ kind: 'examples' }} />
<Story name="Patterns" args={{ kind: 'patterns' }} />
<Story name="Edge Cases" args={{ kind: 'edges' }} />
<Story name="Tabs" args={{ kind: 'tabs' }} />
