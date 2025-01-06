<script lang="ts">
import { faArrowUpRightFromSquare, faFlask } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@podman-desktop/ui-svelte';
import Fa from 'svelte-fa';

import { getInitialValue } from '/@/lib/preferences/Util';
import RefreshButton from '/@/lib/ui/RefreshButton.svelte';

import type { IConfigurationPropertyRecordedSchema } from '../../../../main/src/plugin/configuration-registry';
import Markdown from '../markdown/Markdown.svelte';
import PreferencesRenderingItemFormat from './PreferencesRenderingItemFormat.svelte';

interface Props {
  record: IConfigurationPropertyRecordedSchema;
}

const { record }: Props = $props();
let showResetButton = $state(false);
let resetToDefault = $state(false);

// add space from camel case and upper case on the first letter
function startCase(str: string): string {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, str => {
    return str.toUpperCase();
  });
}
const recordUI = $derived.by(() => {
  const id = record.id;
  // take string after the last dot
  const key = id?.substring(id?.lastIndexOf('.') + 1) ?? '';

  // define bread crumb as first part before the last dot
  const breadCrumb = id?.substring(0, id?.lastIndexOf('.')) ?? '';
  // and replace dot by > in breadcrumb
  const breadCrumbUI = breadCrumb.replace(/\./g, ' > ').concat(':');

  return {
    title: startCase(key),
    breadCrumb: breadCrumbUI,
    description: record.description,
    markdownDescription: record.markdownDescription,
    original: record,
    experimental: record.experimental,
  };
});

$effect(() => {
  showResetButton = false;
  resetToDefault = false;
});

function updateResetButtonVisibility(recordValue: unknown) {
  showResetButton =
    recordUI.original.default !== undefined && recordValue !== undefined && recordValue !== recordUI.original.default;
  // when the reset button is shown we reset the value of resetToDefault
  if (showResetButton) {
    resetToDefault = false;
  }
}

function doResetToDefault() {
  resetToDefault = true;
}

function openGitHubDiscussion(): void {
  if (!recordUI.experimental?.githubDiscussionLink) return;

  window.openExternal(recordUI.experimental.githubDiscussionLink).catch(console.error);
}
</script>

<div class="flex flex-col px-2 py-2 w-full text-[color:var(--pd-invert-content-card-text)] space-y-2">
  <div class="flex flex-row justify-between">
    <div
      class="flex flex-col {recordUI.original.type === 'string' &&
    (!recordUI.original.enum || recordUI.original.enum.length === 0)
      ? 'w-full'
      : ''}">
      <div class="flex flex-row text-[color:var(--pd-invert-content-card-text)]">
        <div class="flex flex-row space-x-1 items-center">
          <span>{recordUI.title}</span>
          {#if record.experimental?.githubDiscussionLink !== undefined}
            <Fa title="experimental" size="xs" icon={faFlask}/>
          {/if}
        </div>
        {#if showResetButton}
          <div class="ml-2">
            <RefreshButton label="Reset to default value" onclick={doResetToDefault} />
          </div>
        {/if}
      </div>
      {#if recordUI.markdownDescription}
        <div class="pt-1 text-[color:var(--pd-invert-content-card-text)] text-sm pr-2">
          <Markdown markdown={recordUI.markdownDescription} />
        </div>
      {:else}
        <div class="pt-1 text-[color:var(--pd-invert-content-card-text)] text-sm pr-2">{recordUI.description}</div>
      {/if}
      {#if recordUI.original.type === 'string' && (!recordUI.original.enum || recordUI.original.enum.length === 0)}
        <PreferencesRenderingItemFormat
          record={recordUI.original}
          updateResetButtonVisibility={updateResetButtonVisibility}
          resetToDefault={resetToDefault}
          enableAutoSave={true}
          initialValue={getInitialValue(recordUI.original)} />
      {/if}
    </div>
    {#if recordUI.original.type !== 'string' || (recordUI.original.enum && recordUI.original.enum.length > 0)}
      <PreferencesRenderingItemFormat
        record={recordUI.original}
        updateResetButtonVisibility={updateResetButtonVisibility}
        resetToDefault={resetToDefault}
        enableAutoSave={true}
        initialValue={getInitialValue(recordUI.original)} />
    {/if}
  </div>
  {#if record.experimental?.githubDiscussionLink !== undefined}
    <Link aria-label="GitHub discussion link" on:click={openGitHubDiscussion} class="flex flex-row space-x-1 w-min items-center">
      <span class="text-nowrap text-sm">
        Join discussion on GitHub
      </span>
      <Fa icon={faArrowUpRightFromSquare}/>
    </Link>
  {/if}
</div>
