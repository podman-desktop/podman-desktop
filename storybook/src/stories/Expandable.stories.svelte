<script context="module" lang="ts">
import { Expandable } from '@podman-desktop/ui-svelte';
import { type Args, defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';

/**
 * These are the stories for the `Expandable` component.
 */
const { Story } = defineMeta({
  component: Expandable,
  render: template,
  title: 'Expandable',
  tags: ['autodocs'],
});
</script>

{#snippet template({ ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  <Expandable {...args}>{args.children}</Expandable>
{/snippet}

<Story name="Basic">
  <Expandable>
    <!-- eslint-disable-next-line sonarjs/no-unused-vars -->
    {#snippet title()}
      Title
    {/snippet}
    Children
  </Expandable>
</Story>
