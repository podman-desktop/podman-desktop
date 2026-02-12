<!--
  Copyright (C) 2026 Red Hat, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  SPDX-License-Identifier: Apache-2.0
-->

<script context="module" lang="ts">
import {
  faCube,
  faFlask,
  faGlobe,
  faPlay,
  faRocket,
  faServer,
  faTerminal,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { SplitButton } from '@podman-desktop/ui-svelte';
import { defineMeta } from '@storybook/addon-svelte-csf';
import { fn } from 'storybook/test';
import type { ComponentProps } from 'svelte';

// #region Mock data

/**
 * Git merge strategy options — the canonical example from PR #16033.
 * Matches exactly what dgolovin's video demonstrates.
 */
const mergeOptions = [
  { id: 'merge', label: 'Merge', description: 'Merge all commits into the base branch' },
  { id: 'squash', label: 'Squash and merge', description: 'Combine all commits into one before merging' },
  { id: 'rebase', label: 'Rebase and merge', description: 'Rebase commits onto the base branch' },
];

/** Deploy target options — production is disabled (requires approval). */
const deployOptions = [
  { id: 'dev', label: 'Deploy to dev', description: 'Development environment', icon: faFlask },
  { id: 'staging', label: 'Deploy to staging', description: 'Staging environment', icon: faServer },
  {
    id: 'prod',
    label: 'Deploy to production',
    description: 'Requires approval from the ops team',
    icon: faGlobe,
    disabled: true,
  },
];

/** Container start modes — each with a distinct icon. */
const containerStartOptions = [
  { id: 'start', label: 'Start', description: 'Start container in the background', icon: faPlay },
  { id: 'interactive', label: 'Start interactive', description: 'Start with an attached terminal', icon: faTerminal },
  { id: 'fresh', label: 'Start fresh', description: 'Remove existing container and recreate it', icon: faCube },
];

/** Danger-type options for destructive image operations. */
const deleteOptions = [
  { id: 'delete', label: 'Delete image', description: 'Remove this image from local storage', icon: faTrash },
  {
    id: 'delete-containers',
    label: 'Delete image and containers',
    description: 'Remove image and all containers that use it',
    icon: faTrash,
  },
  {
    id: 'force',
    label: 'Force delete',
    description: 'Force removal even if used by running containers',
    icon: faRocket,
  },
];

/** All options disabled — exercises the noActionLabel mode. */
const allDisabledOptions = [
  { id: 'opt1', label: 'Option 1', description: 'Requires a running Podman machine', disabled: true },
  { id: 'opt2', label: 'Option 2', description: 'Not available in this context', disabled: true },
  { id: 'opt3', label: 'Option 3', description: 'Needs elevated permissions', disabled: true },
];

/** Only one option available. */
const singleOption = [
  { id: 'only', label: 'Only option', description: 'This is the only available action in the current state' },
];

/** Long option labels to test overflow and layout. */
const longLabelOptions = [
  {
    id: 'a',
    label: 'Run automated integration tests against staging environment',
    description: 'Takes approximately 15-20 minutes to complete',
  },
  {
    id: 'b',
    label: 'Deploy with zero-downtime rolling update strategy',
    description: 'Updates pods one by one without service interruption',
  },
  {
    id: 'c',
    label: 'Rollback to previous stable release',
    description: 'Restores the last known-good deployment configuration',
  },
];

// #endregion

// #region Scenario groups

// Scenario props always carry the two required SplitButton props; everything
// else is optional. Deriving from ComponentProps avoids duplicating the types.
type ScenarioProps = Pick<ComponentProps<typeof SplitButton>, 'options' | 'noSelectionLabel'> &
  Partial<
    Omit<ComponentProps<typeof SplitButton>, 'options' | 'noSelectionLabel' | 'onAction' | 'onSelect' | 'children'>
  >;

type Scenario = {
  name: string;
  props: ScenarioProps;
};

const typesScenarios: Scenario[] = [
  {
    name: 'Primary (default)',
    props: { options: mergeOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Choose strategy...' },
  },
  {
    name: 'Secondary',
    props: {
      type: 'secondary',
      options: mergeOptions,
      selectedOptionIds: ['squash'],
      noSelectionLabel: 'Choose strategy...',
    },
  },
  {
    name: 'Danger',
    props: {
      type: 'danger',
      options: deleteOptions,
      selectedOptionIds: ['delete'],
      noSelectionLabel: 'Choose action...',
    },
  },
];

const stateScenarios: Scenario[] = [
  {
    name: 'Ready (option selected)',
    props: { options: mergeOptions, selectedOptionIds: ['merge'], noSelectionLabel: 'Choose strategy...' },
  },
  {
    name: 'No selection (main button opens dropdown)',
    props: { options: mergeOptions, selectedOptionIds: [], noSelectionLabel: 'Choose strategy...' },
  },
  {
    name: 'In progress (spinner, both buttons disabled)',
    props: {
      options: mergeOptions,
      selectedOptionIds: ['merge'],
      noSelectionLabel: 'Choose strategy...',
      inProgress: true,
    },
  },
  {
    name: 'Disabled',
    props: {
      options: mergeOptions,
      selectedOptionIds: ['merge'],
      noSelectionLabel: 'Choose strategy...',
      disabled: true,
    },
  },
  {
    name: 'All options disabled (noActionLabel)',
    props: {
      options: allDisabledOptions,
      selectedOptionIds: [],
      noSelectionLabel: 'Choose...',
      noActionLabel: 'Show options...',
    },
  },
  {
    name: 'Empty options list (emptyLabel)',
    props: {
      options: [],
      selectedOptionIds: [],
      noSelectionLabel: 'Choose...',
      emptyLabel: 'No options available',
    },
  },
];

const iconScenarios: Scenario[] = [
  {
    name: 'Icons on options only',
    props: { options: deployOptions, selectedOptionIds: ['dev'], noSelectionLabel: 'Choose target...' },
  },
  {
    name: 'Icon on button + options',
    props: {
      options: containerStartOptions,
      selectedOptionIds: ['start'],
      noSelectionLabel: 'Choose start mode...',
      icon: faPlay,
    },
  },
  {
    name: 'Icon on button only (no option icons)',
    props: {
      options: mergeOptions,
      selectedOptionIds: ['merge'],
      noSelectionLabel: 'Choose strategy...',
      icon: faRocket,
    },
  },
];

const multiselectScenarios: Scenario[] = [
  {
    name: 'No selection',
    props: {
      options: mergeOptions,
      multipleSelection: true,
      selectedOptionIds: [],
      noSelectionLabel: 'Choose strategies...',
    },
  },
  {
    name: 'One selected',
    props: {
      options: mergeOptions,
      multipleSelection: true,
      selectedOptionIds: ['merge'],
      noSelectionLabel: 'Choose strategies...',
    },
  },
  {
    name: 'Two selected (checkmarks on both)',
    props: {
      options: mergeOptions,
      multipleSelection: true,
      selectedOptionIds: ['merge', 'squash'],
      noSelectionLabel: 'Choose strategies...',
    },
  },
  {
    name: 'Secondary, two selected',
    props: {
      type: 'secondary',
      options: mergeOptions,
      multipleSelection: true,
      selectedOptionIds: ['squash', 'rebase'],
      noSelectionLabel: 'Choose strategies...',
    },
  },
  {
    name: 'Danger, one selected',
    props: {
      type: 'danger',
      options: deleteOptions,
      multipleSelection: true,
      selectedOptionIds: ['delete'],
      noSelectionLabel: 'Choose actions...',
    },
  },
];

const edgeScenarios: Scenario[] = [
  {
    name: 'Single option',
    props: { options: singleOption, selectedOptionIds: ['only'], noSelectionLabel: 'Choose...' },
  },
  {
    name: 'Long option labels',
    props: { options: longLabelOptions, selectedOptionIds: [], noSelectionLabel: 'Choose an action...' },
  },
  {
    name: 'Custom emptyLabel',
    props: { options: [], noSelectionLabel: 'Choose...', emptyLabel: 'No Podman machine running' },
  },
  {
    name: 'Custom noActionLabel',
    props: {
      options: allDisabledOptions,
      selectedOptionIds: [],
      noSelectionLabel: 'Choose...',
      noActionLabel: 'Podman machine required',
    },
  },
  {
    name: 'With title tooltip',
    props: {
      options: mergeOptions,
      selectedOptionIds: ['merge'],
      noSelectionLabel: 'Choose strategy...',
      title: 'Select a merge strategy then click to apply',
    },
  },
  {
    name: 'Danger + in progress',
    props: {
      type: 'danger',
      options: deleteOptions,
      selectedOptionIds: ['delete'],
      noSelectionLabel: 'Choose action...',
      inProgress: true,
    },
  },
];

// #endregion

const groupKinds: Record<string, { label: string; description: string; scenarios: Scenario[] }> = {
  types: {
    label: 'Button Types',
    description: 'Primary, secondary, and danger visual styles',
    scenarios: typesScenarios,
  },
  states: {
    label: 'States',
    description: 'All button states: selected, no selection, in progress, disabled, all disabled, empty',
    scenarios: stateScenarios,
  },
  icons: {
    label: 'With Icons',
    description: 'FontAwesome icons on the main button and/or individual dropdown options',
    scenarios: iconScenarios,
  },
  multiselect: {
    label: 'Multi-select Mode',
    description: 'Multiple options can be selected simultaneously; dropdown stays open between selections',
    scenarios: multiselectScenarios,
  },
  edges: {
    label: 'Edge Cases',
    description: 'Boundary conditions, custom labels, and layout stress tests',
    scenarios: edgeScenarios,
  },
};

const onActionFn = fn().mockName('onAction');
const onSelectFn = fn().mockName('onSelect');

/**
 * `SplitButton` combines a main action button with a dropdown option selector.
 *
 * The user first picks an option from the dropdown, then executes it via the main
 * button. This avoids an always-visible list while still exposing the full set of
 * actions on demand.
 *
 * **Modes:**
 * - **Single-select** (default) — one option is active at a time; selecting a new one replaces the previous.
 * - **Multi-select** (`multipleSelection`) — the dropdown stays open; any number of options can be toggled.
 *
 * **Special states:**
 * - No selection — main button shows `noSelectionLabel`; clicking it opens the dropdown.
 * - All options disabled — main button shows `noActionLabel`; clicking still opens the dropdown so users can
 *   see why each option is unavailable.
 * - Empty options — both buttons are disabled and show `emptyLabel`.
 * - In progress — spinner replaces the icon; both buttons are disabled.
 *
 * Introduced in [PR #16033](https://github.com/podman-desktop/podman-desktop/pull/16033).
 */
// biome-ignore lint/correctness/noUnusedVariables: used in markup
const { Story } = defineMeta({
  component: SplitButton,
  render: template,
  title: 'Button/SplitButton',
  tags: ['autodocs'],
  argTypes: {
    kind: { table: { disable: true } },
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Visual style of the button',
    },
    multipleSelection: {
      control: 'boolean',
      description: 'Allow selecting multiple options simultaneously; dropdown stays open between selections',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all interaction on both the main button and the dropdown toggle',
    },
    inProgress: {
      control: 'boolean',
      description: 'Show a spinner and disable interaction while an async action is running',
    },
    noSelectionLabel: {
      control: 'text',
      description: 'Label on the main button when no option is selected; clicking opens the dropdown',
    },
    noActionLabel: {
      control: 'text',
      description: 'Label when all options are disabled; clicking still opens the dropdown',
    },
    emptyLabel: {
      control: 'text',
      description: 'Label when the options array is empty; both buttons are disabled',
    },
  },
  args: {
    onAction: onActionFn,
    onSelect: onSelectFn,
    options: mergeOptions,
    noSelectionLabel: 'Choose strategy...',
    selectedOptionIds: ['merge'],
  },
});
</script>

{#snippet template({ ...args })}
  {#if args.kind && groupKinds[args.kind as string]}
    {@const group = groupKinds[args.kind as string]}
    <div class="bg-(--pd-content-card-bg) p-6">
      <div class="flex flex-col gap-4">
        <div>
          <div class="text-sm font-semibold text-(--pd-content-header)">{group.label}</div>
          <div class="mt-1 text-xs text-(--pd-content-text)">{group.description}</div>
        </div>
        <!-- pb-48 reserves space so open dropdowns are not clipped -->
        <div class="grid grid-cols-1 gap-x-6 gap-y-10 pb-48 sm:grid-cols-2 lg:grid-cols-3">
          {#each group.scenarios as scenario (scenario.name)}
            <div class="flex flex-col gap-2">
              <div class="text-xs text-(--pd-content-text)">{scenario.name}</div>
              <SplitButton {...scenario.props} onAction={onActionFn} onSelect={onSelectFn} />
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <!-- Default rendering used by autodocs and the controls panel -->
    <div class="bg-(--pd-content-card-bg) p-6 pb-48">
      <SplitButton
        options={mergeOptions}
        noSelectionLabel="Choose strategy..."
        selectedOptionIds={['merge']}
        onAction={onActionFn}
        onSelect={onSelectFn} />
    </div>
  {/if}
{/snippet}

<!-- Grouped display stories -->
<Story name="Button Types" args={{ kind: 'types' }} />
<Story name="States" args={{ kind: 'states' }} />
<Story name="With Icons" args={{ kind: 'icons' }} />
<Story name="Multi-select" args={{ kind: 'multiselect' }} />
<Story name="Edge Cases" args={{ kind: 'edges' }} />

<!--
  Interactive real-world examples.
  The SplitButton manages its own internal selection state via $bindable.
  onAction and onSelect callbacks appear in the Storybook Actions panel.
-->

<Story name="Merge Strategy">
  <!--
    The canonical example from PR #16033.
    Select a strategy in the dropdown, then click the main button to execute.
    Starts with "Merge" pre-selected to match dgolovin's demo video.
  -->
  <div class="bg-(--pd-content-card-bg) flex flex-col gap-3 p-6 pb-48">
    <div class="text-sm font-semibold text-(--pd-content-header)">Merge Strategy</div>
    <div class="text-xs text-(--pd-content-text)">
      Select a strategy in the dropdown, then click the main button to execute. Check the Actions panel below
      to see onAction and onSelect calls.
    </div>
    <SplitButton
      options={mergeOptions}
      selectedOptionIds={['merge']}
      noSelectionLabel="Choose strategy..."
      title="Select a merge strategy"
      onAction={onActionFn}
      onSelect={onSelectFn} />
  </div>
</Story>

<Story name="Deploy Target">
  <!--
    Production is disabled (requires approval).
    Starts with no selection — clicking the main button opens the dropdown
    rather than triggering an action, illustrating the noSelection mode.
  -->
  <div class="bg-(--pd-content-card-bg) flex flex-col gap-3 p-6 pb-48">
    <div class="text-sm font-semibold text-(--pd-content-header)">Deploy Target</div>
    <div class="text-xs text-(--pd-content-text)">
      Production is disabled (requires approval). No initial selection — the main button opens the dropdown
      instead of executing an action until a target is chosen.
    </div>
    <SplitButton
      options={deployOptions}
      selectedOptionIds={[]}
      noSelectionLabel="Choose deploy target..."
      icon={faRocket}
      onAction={onActionFn}
      onSelect={onSelectFn} />
  </div>
</Story>

<Story name="Container Start Mode">
  <!--
    All options have icons; the main button also carries the faPlay icon.
    Starts with "Start" pre-selected as the sensible default.
  -->
  <div class="bg-(--pd-content-card-bg) flex flex-col gap-3 p-6 pb-48">
    <div class="text-sm font-semibold text-(--pd-content-header)">Container Start Mode</div>
    <div class="text-xs text-(--pd-content-text)">
      Pick a start mode from the dropdown, then click the main button to launch. Each option carries an icon
      and description.
    </div>
    <SplitButton
      options={containerStartOptions}
      selectedOptionIds={['start']}
      noSelectionLabel="Choose start mode..."
      icon={faPlay}
      onAction={onActionFn}
      onSelect={onSelectFn} />
  </div>
</Story>
