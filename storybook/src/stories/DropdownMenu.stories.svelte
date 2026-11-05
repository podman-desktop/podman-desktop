<script context="module" lang="ts">
import { faBell, faExternalLinkSquareAlt, faRocket, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import { type Args, defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';

/**
 * These are the stories for the `DropdownMenu` component.
 * Interact with a drop down from a kebab menu.
 */
const { Story } = defineMeta({
  component: DropdownMenu,
  render: template,
  title: 'DropdownMenu',
  tags: ['autodocs'],
  args: {},
});
</script>

{#snippet template({ _children, ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  <div class="flex min-h-52 justify-center p-10">
    <DropdownMenu>
      {#each args.items as item, index (index)}
        <DropdownMenu.Item {...item} />
      {/each}
    </DropdownMenu>
  </div>
{/snippet}

{#snippet submenuTemplate({ _children, ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  <div class="flex min-h-64 p-10 {args.alignRight ? 'justify-end' : 'justify-center'}">
    <DropdownMenu>
      <DropdownMenu.Item title="Item 1" icon={faBell} />
      <DropdownMenu.Submenu title={args.title} icon={faExternalLinkSquareAlt} enabled={args.enabled}>
        {#each args.items as item, index (index)}
          <DropdownMenu.Item {...item} />
        {/each}
      </DropdownMenu.Submenu>
      <DropdownMenu.Item title="Item 3" icon={faTrash} />
    </DropdownMenu>
  </div>
{/snippet}

<Story
  name="Basic"
  args={{
    items: [
      { title: 'Item 1', icon: faBell },
      { title: 'Item 2', icon: faRocket },
      { title: 'Item 3', icon: faTrash },
    ],
  }} />

<!-- Hover, click or press → on "Open Browser" to open the submenu, ← to go back -->
<Story
  name="Submenu"
  template={submenuTemplate}
  args={{
    title: 'Open Browser',
    enabled: true,
    items: [
      { title: 'http://localhost:8080', icon: faExternalLinkSquareAlt },
      { title: 'http://localhost:9090', icon: faExternalLinkSquareAlt },
      { title: 'http://localhost:9443', icon: faExternalLinkSquareAlt },
    ],
  }} />

<!-- The menu is at the right edge of the screen: the submenu opens on the left -->
<Story
  name="Submenu at right edge"
  template={submenuTemplate}
  args={{
    title: 'Open Browser',
    enabled: true,
    alignRight: true,
    items: [
      { title: 'http://localhost:8080', icon: faExternalLinkSquareAlt },
      { title: 'http://localhost:9090', icon: faExternalLinkSquareAlt },
    ],
  }} />

<Story
  name="Submenu disabled"
  template={submenuTemplate}
  args={{
    title: 'Open Browser',
    enabled: false,
    items: [{ title: 'http://localhost:8080', icon: faExternalLinkSquareAlt }],
  }} />
