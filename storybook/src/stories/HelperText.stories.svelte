<script context="module" lang="ts">
import { HelperText } from '@podman-desktop/ui-svelte';
import { type Args, defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';

/**
 * These are the stories for the `HelperText` component.
 * Use it to say why a control is disabled. Point the `aria-describedby` of the control at its `id`.
 */
const { Story } = defineMeta({
  component: HelperText,
  render: template,
  title: 'HelperText',
  tags: ['autodocs'],
  args: {
    id: 'helper-text',
  },
});
</script>

{#snippet template({ _children, ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  <HelperText {...args}>{args.content}</HelperText>
{/snippet}

<Story
  name="Basic"
  args={{
    content: 'Choose a Containerfile',
  }} />
