<script lang="ts">
import { onMount } from 'svelte';

import Route from '/@/Route.svelte';
import { contributions } from '/@/stores/contribs';

interface Props {
  name: string;
}
let { name }: Props = $props();

let currentContrib = $derived($contributions.find(contrib => contrib.name === name));
let source: string | undefined = $derived(currentContrib?.uiUri);
let arch: string = $state('');
let hostname: string = $state('');
let platform: string = $state('');

let preloadPath: string = $state('');

let webviewId = $derived(name.replaceAll(' ', '-'));

onMount(async () => {
  // grab hostname, arch and platform
  arch = await window.getOsArch();
  hostname = await window.getOsHostname();
  platform = await window.getOsPlatform();
  preloadPath = await window.getDDPreloadPath();
});

window.events?.receive('dev-tools:open-extension', (extensionId: unknown) => {
  const extensionElement = document.getElementById(`dd-webview-${extensionId}`);

  // Check that the element contains "openDevTools" method, which is only available on Electron WebviewTag
  // we cannot use `instanceof` as Electron does not "contain" the WebviewTag class at run time.
  if (extensionElement && 'openDevTools' in extensionElement && typeof extensionElement.openDevTools === 'function') {
    extensionElement.openDevTools();
  } else {
    // Warn if unable
    console.warn(`Element with ID dd-webview-${extensionId} is not an Electron WebviewTag.`);
  }
});
</script>

{#if source && preloadPath}
  <Route path="/*" breadcrumb={name}>
    <webview
      id="dd-webview-{webviewId}"
      src="{source}?extensionName={currentContrib?.extensionId}&arch={arch}&hostname={hostname}&platform={platform}&vmServicePort={currentContrib?.vmServicePort}"
      preload={preloadPath}
      style="height: 100%; width: 100%"></webview>
  </Route>
{/if}
