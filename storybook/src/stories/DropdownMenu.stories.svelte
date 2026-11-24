<script context="module" lang="ts">
import {
  faAlignLeft,
  faArrowsRotate,
  faBell,
  faDownload,
  faExternalLinkSquareAlt,
  faFileCode,
  faRocket,
  faTerminal,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
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

{#snippet groupTemplate({ _children, ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  <div class="flex min-h-[28rem] justify-center p-10">
    <DropdownMenu>
      <DropdownMenu.Item title="Open Logs" icon={faAlignLeft} />
      <DropdownMenu.Item title="Generate Kube" icon={faFileCode} />
      <DropdownMenu.Item title="Deploy to Kubernetes" icon={faRocket} />
      <DropdownMenu.Separator />
      <DropdownMenu.Group label={args.label}>
        {#each args.urls as url (url)}
          <DropdownMenu.Item title={url} icon={faExternalLinkSquareAlt} />
        {/each}
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Item title="Open Terminal" icon={faTerminal} />
      <DropdownMenu.Item title="Restart Container" icon={faArrowsRotate} />
      <DropdownMenu.Item title="Export Container" icon={faDownload} />
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

<!-- Items grouped under a label, between separators (e.g. the exposed ports of a container) -->
<Story
  name="Group with label"
  template={groupTemplate}
  args={{
    label: 'Open Browser',
    urls: ['http://localhost:8080', 'http://localhost:9090', 'http://localhost:9443'],
  }} />
