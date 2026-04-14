<script context="module" lang="ts">
import LinearProgress from '@podman-desktop/ui-svelte/LinearProgress';
import { type Args, defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';

/**
 * These are the stories for the `LinearProgress` component.
 * Displays undeterminate progres through a line.
 */
const { Story } = defineMeta({
  component: LinearProgress,
  render: template,
  title: 'Progress/LinearProgress',
  tags: ['autodocs'],
});
</script>

{#snippet template({ _children, ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  <LinearProgress {...args} />
{/snippet}

<Story name="Basic" />
