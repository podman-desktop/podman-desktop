<script context="module" lang="ts">
import { Button, ButtonRow } from '@podman-desktop/ui-svelte';
import { type Args, defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';

const { Story } = defineMeta({
  component: ButtonRow,
  render: template,
  title: 'Button/ButtonRow',
  tags: ['autodocs'],
  argTypes: {
    initialFocus: {
      control: 'select',
      options: ['none', 'first', 'last'],
      description: 'The enabled action that receives focus when the row mounts.',
    },
  },
});
</script>

{#snippet template({ ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  <div class="bg-(--pd-content-card-bg) p-4" dir={args.dir ?? 'ltr'}>
    <ButtonRow initialFocus={args.initialFocus}>
      <Button type="secondary">Cancel</Button>
      <Button type="primary">Save</Button>
    </ButtonRow>
  </div>
{/snippet}

<Story name="One Button" args={{ initialFocus: 'none' }}>
  {#snippet template()}
    <div class="bg-(--pd-content-card-bg) p-4">
      <ButtonRow>
        <Button type="primary">Save</Button>
      </ButtonRow>
    </div>
  {/snippet}
</Story>

<Story name="Two Buttons" args={{ initialFocus: 'none' }} />

<Story name="Three Buttons" args={{ initialFocus: 'none' }}>
  {#snippet template()}
    <div class="bg-(--pd-content-card-bg) p-4">
      <ButtonRow>
        <Button type="link">Back</Button>
        <Button type="secondary">Cancel</Button>
        <Button type="primary">Save</Button>
      </ButtonRow>
    </div>
  {/snippet}
</Story>

<Story name="RTL" args={{ initialFocus: 'none', dir: 'rtl' }} />
<Story name="Initial Focus Primary" args={{ initialFocus: 'last' }} />
<Story name="Initial Focus Cancel" args={{ initialFocus: 'first' }} />

<!-- Use the Themes toolbar to verify light, dark, hc-light, and hc-dark variants. -->
