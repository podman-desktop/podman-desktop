<!-- The markdown rendered has it's own style that you'll have to customize / check against podman desktop
UI guidelines -->
<style lang="postcss">
.markdown > :global(p) {
  line-height: normal;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.markdown > :global(h1),
:global(h2),
:global(h3),
:global(h4),
:global(h5) {
  font-size: revert;
  line-height: normal;
  font-weight: revert;
  border-bottom: 1px solid var(--pd-content-divider);
  margin-bottom: 20px;
}

.markdown > :global(ul) {
  line-height: normal;
  list-style: revert;
  margin: revert;
  padding: revert;
}

.markdown > :global(b),
:global(strong) {
  font-weight: 600;
}
.markdown > :global(blockquote) {
  opacity: 0.8;
  line-height: normal;
}
.markdown :global(a) {
  color: var(--pd-link);
  text-decoration: none;
  border-radius: 4px;
}
.markdown :global(a):hover {
  background-color: var(--pd-link-hover-bg);
}
</style>

<script lang="ts">
import { micromark } from 'micromark';
import { directive, directiveHtml } from 'micromark-extension-directive';
import { onDestroy, onMount } from 'svelte';

import { button } from './micromark-button-directive';
import { image } from './micromark-image-directive';
import { link } from './micromark-link-directive';
import { createListener } from './micromark-listener-handler';
import { warnings } from './micromark-warnings-directive';

interface Props {
  markdown?: string;

  /**
   * Button micromark related:
   * In progress execution callbacks for all markdown buttons.
   */
  inProgressMarkdownCommandExecutionCallback?: (
    command: string,
    state: 'starting' | 'failed' | 'successful',
    value?: unknown,
  ) => void;
}

let { markdown, inProgressMarkdownCommandExecutionCallback = (): void => {} }: Props = $props();

let urlProtocol: string = $derived(await window.getUrlProtocol());
let html: string = $derived.by(() => {
  if (!markdown) return '';

  // Provide micromark + extensions
  const html = micromark(markdown, {
    extensions: [directive()],
    htmlExtensions: [directiveHtml({ button, image, link, warnings })],
  });

  const protocolPrefix = `${urlProtocol}://`;

  // remove href values in each anchor using # for links
  // and set the attribute data-pd-jump-in-page
  const parser = new DOMParser();
  const doc = parser.parseFromString(decode(html), 'text/html');
  const links = doc.querySelectorAll('a');
  links.forEach(link => {
    const currentHref = link.getAttribute('href');
    // remove and replace href attribute if matching
    if (currentHref?.startsWith('#')) {
      // get current value of href
      link.removeAttribute('href');

      // remove from current href the #
      const withoutHashHRef = currentHref.substring(1);

      // add an attribute to handle onclick
      link.setAttribute('data-pd-jump-in-page', withoutHashHRef);

      // add a class for cursor
      link.classList.add('cursor-pointer');
    } else if (link.getAttribute('href')?.startsWith(protocolPrefix)) {
      let internalLink = link.getAttribute('href')?.replace(protocolPrefix, '/') ?? '';
      link.setAttribute('href', internalLink);
    }
  });

  // for all h1/h2/h3/h4/h5/h6, add an id attribute being the name of the attibute all in lowercase without spaces (replaced by -)
  const headers = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headers.forEach(header => {
    const headerText = header.textContent;
    const headerId = headerText?.toLowerCase().replace(/\s/g, '-');
    if (headerId) {
      header.setAttribute('id', headerId);
    }
  });

  return doc.body.innerHTML;
});

// Create an event listener for updating the in-progress markdown command execution callback
const eventListeners: EventListener[] = [];

function decode(htmlString: string): string {
  let textArea = document.createElement('textarea');
  textArea.innerHTML = htmlString;
  return textArea.value;
}

onMount(async () => {
  // We create a click listener in order to execute any internal micromark commands
  // We add the clickListener here since we're unable to add it in the directive typescript file.
  const clickListener = createListener(inProgressMarkdownCommandExecutionCallback);

  // Push the click listener to the eventListeners array so we can remove it on destroy
  eventListeners.push(clickListener);
  document.addEventListener('click', clickListener);
});

// Remove on destroy / make sure we do not listen anymore.
onDestroy(() => {
  eventListeners.forEach(listener => document.removeEventListener('click', listener));
});
</script>

<section class="markdown" aria-label="markdown-content">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html html}
</section>
