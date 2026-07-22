<script context="module" lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
import { type Args, defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';

import MockStatusDotIcon from './helpers/MockStatusDotIcon.svelte';

/**
 * Stories for the `StatusDot` component from `packages/renderer`.
 *
 * A 12x12px SVG icon indicating container or pod status. Each status maps
 * to a distinct CSS variable color from the color registry. The SVG shapes
 * are circular placeholders - they will be replaced with Figma-designed
 * icons that provide shape-based differentiation (not just color).
 *
 * Used inside the Pods list table (both Podman and Kubernetes) via the
 * `Dots.svelte` wrapper.
 */
const { Story } = defineMeta({
  render: template,
  title: 'StatusDot',
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'running',
        'terminated',
        'waiting',
        'stopped',
        'paused',
        'exited',
        'dead',
        'created',
        'degraded',
        'unknown',
      ],
      description: 'Container status string',
    },
    name: {
      control: 'text',
      description: 'Container name (used in auto-generated tooltip)',
    },
    tooltip: {
      control: 'text',
      description: 'Custom tooltip text (overrides auto-generated)',
    },
    number: {
      control: { type: 'number', min: 0 },
      description: 'Count badge shown below the dot (0 = hidden)',
    },
    kind: {
      table: { disable: true },
    },
  },
});

type StatusEntry = {
  status: string;
  token: string;
};

const allStatuses: StatusEntry[] = [
  { status: 'running', token: '--pd-status-running' },
  { status: 'terminated', token: '--pd-status-terminated' },
  { status: 'waiting', token: '--pd-status-waiting' },
  { status: 'paused', token: '--pd-status-paused' },
  { status: 'degraded', token: '--pd-status-degraded' },
  { status: 'dead', token: '--pd-status-dead' },
  { status: 'unknown', token: '--pd-status-unknown' },
  { status: 'stopped', token: '--pd-status-stopped' },
  { status: 'exited', token: '--pd-status-exited' },
  { status: 'created', token: '--pd-status-created' },
];

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildTooltip(customTooltip: string, name: string, status: string): string {
  if (customTooltip !== '') return customTooltip;
  if (name && status) return `${name}: ${capitalize(status)}`;
  return '';
}

type MockContainer = { name: string; status: string };

function makeMockContainers(statuses: string[]): MockContainer[] {
  return statuses.map((status, i) => ({ name: `container-${i + 1}`, status }));
}

function organizeContainers(containers: MockContainer[]): Record<string, MockContainer[]> {
  const order = ['running', 'created', 'paused', 'waiting', 'degraded', 'exited', 'stopped', 'terminated', 'dead'];
  const organized: Record<string, MockContainer[]> = {};

  for (const s of order) {
    organized[s] = [];
  }

  for (const c of containers) {
    const key = c.status.toLowerCase();
    if (!organized[key]) {
      organized[key] = [];
    }
    organized[key].push(c);
  }

  return organized;
}

const fewContainerStatuses = ['running', 'running', 'running', 'stopped', 'paused', 'running', 'exited'];

const manyContainerStatuses = [
  ...Array.from({ length: 8 }, () => 'running'),
  ...Array.from({ length: 3 }, () => 'stopped'),
  ...Array.from({ length: 2 }, () => 'exited'),
  'paused',
  'degraded',
];

const stressTests = [
  { label: '1 container', statuses: ['running'] },
  {
    label: '10 containers (individual threshold)',
    statuses: Array.from({ length: 10 }, (_, i) => (i < 7 ? 'running' : i < 9 ? 'stopped' : 'exited')),
  },
  {
    label: '11 containers (grouped threshold)',
    statuses: [...Array.from({ length: 8 }, () => 'running'), 'stopped', 'stopped', 'exited'],
  },
  {
    label: '50 containers',
    statuses: [
      ...Array.from({ length: 30 }, () => 'running'),
      ...Array.from({ length: 10 }, () => 'stopped'),
      ...Array.from({ length: 5 }, () => 'exited'),
      ...Array.from({ length: 3 }, () => 'paused'),
      'degraded',
      'dead',
    ],
  },
  { label: 'All same status', statuses: Array.from({ length: 8 }, () => 'running') },
];
</script>

{#snippet template({ _children, ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  {#if args.kind === 'allStatuses'}
    <div class="flex flex-col gap-6">
      <div class="text-sm text-(--pd-content-text)">
        All statuses now render as 12x12px filled SVG circles. The SVG shapes are placeholders
        that will be replaced with distinct Figma-designed icons per status.
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each allStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <MockStatusDotIcon status={entry.status} />
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else if args.kind === 'numberBadges'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        When a pod has more than 10 containers, dots are grouped by status with a count badge below.
      </div>

      <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4">
        {#each [{ status: 'running', count: 5 }, { status: 'stopped', count: 3 }, { status: 'exited', count: 2 }, { status: 'paused', count: 1 }] as badge (badge.status)}
          <Tooltip top tip="{capitalize(badge.status)}: {badge.count}">
            <div class="flex flex-col items-center">
              <div class="mr-0.5 mt-3" title="{capitalize(badge.status)}: {badge.count}">
                <MockStatusDotIcon status={badge.status} />
              </div>
              <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{badge.count}</div>
            </div>
          </Tooltip>
        {/each}
      </div>
    </div>

  {:else if args.kind === 'podRowIndividual'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Pod with {fewContainerStatuses.length} containers (at or below 10 threshold).
        Each container gets its own dot. This is the <code>Dots.svelte</code> layout for small pods.
      </div>

      <div class="rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div>
        <div class="flex items-center flex-wrap gap-0.5">
          {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
            {#each containers as container, i (i)}
              <Tooltip top tip="{container.name}: {capitalize(status)}">
                <MockStatusDotIcon {status} />
              </Tooltip>
            {/each}
          {/each}
        </div>
      </div>
    </div>

  {:else if args.kind === 'podRowGrouped'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Pod with {manyContainerStatuses.length} containers (above 10 threshold).
        Containers are grouped by status with count badges.
      </div>

      <div class="rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div>
        <div class="flex items-start gap-1">
          {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
            {#if containers.length > 0}
              <Tooltip top tip="{capitalize(status)}: {containers.length}">
                <div class="flex flex-col items-center">
                  <div class="mt-3" title="{capitalize(status)}: {containers.length}">
                    <MockStatusDotIcon {status} />
                  </div>
                  <div class="text-sm font-bold text-(--pd-content-text)">{containers.length}</div>
                </div>
              </Tooltip>
            {/if}
          {/each}
        </div>
      </div>
    </div>

  {:else if args.kind === 'tableCell'}
    <div class="flex flex-col gap-6">
      <div class="text-sm text-(--pd-content-text)">
        StatusDots appear inside the Containers column of the Pods list table. The dots are now
        12x12px SVG circles (up from 8x8px divs). Compare row height and column width impact.
      </div>

      <div class="flex flex-col gap-4">
        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div>
        <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
          <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
            <input type="checkbox" class="w-3.5 h-3.5" />
          </div>
          <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div>
            <div class="text-xs text-(--pd-content-text)">podman</div>
          </div>
          <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
            <span class="text-xs text-(--pd-content-text)">Running</span>
          </div>
          <div class="w-40 px-3 py-2 border-r border-(--pd-content-divider)">
            <button class="cursor-pointer flex items-center flex-wrap gap-0.5">
              {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
                {#each containers as container, i (i)}
                  <Tooltip top tip="{container.name}: {capitalize(status)}">
                    <MockStatusDotIcon {status} />
                  </Tooltip>
                {/each}
              {/each}
            </button>
          </div>
          <div class="w-16 px-3 py-2 text-right">
            <span class="text-xs text-(--pd-content-text)">3m ago</span>
          </div>
        </div>

        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div>
        <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
          <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
            <input type="checkbox" class="w-3.5 h-3.5" />
          </div>
          <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div>
            <div class="text-xs text-(--pd-content-text)">podman</div>
          </div>
          <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
            <span class="text-xs text-(--pd-content-text)">Degraded</span>
          </div>
          <div class="w-40 px-3 py-2 border-r border-(--pd-content-divider)">
            <button class="cursor-pointer flex items-start flex-wrap gap-1">
              {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
                {#if containers.length > 0}
                  <Tooltip top tip="{capitalize(status)}: {containers.length}">
                    <div class="flex flex-col items-center">
                      <div class="mt-3" title="{capitalize(status)}: {containers.length}">
                        <MockStatusDotIcon {status} />
                      </div>
                      <div class="text-sm font-bold text-(--pd-content-text)">{containers.length}</div>
                    </div>
                  </Tooltip>
                {/if}
              {/each}
            </button>
          </div>
          <div class="w-16 px-3 py-2 text-right">
            <span class="text-xs text-(--pd-content-text)">1h ago</span>
          </div>
        </div>

        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div>
        <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
          <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
            <input type="checkbox" class="w-3.5 h-3.5" />
          </div>
          <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div>
            <div class="text-xs text-(--pd-content-text)">kubernetes</div>
          </div>
          <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
            <span class="text-xs text-(--pd-content-text)">Running</span>
          </div>
          <div class="w-40 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="flex items-center flex-wrap gap-0.5">
              {#each ['running', 'running', 'waiting'] as status, i (i)}
                <Tooltip top tip="container-{i + 1}: {capitalize(status)}">
                  <MockStatusDotIcon {status} />
                </Tooltip>
              {/each}
            </div>
          </div>
          <div class="w-16 px-3 py-2 text-right">
            <span class="text-xs text-(--pd-content-text)">12m ago</span>
          </div>
        </div>
      </div>
    </div>

  {:else if args.kind === 'stressTest'}
    <div class="flex flex-col gap-6">
      <div class="text-sm text-(--pd-content-text)">
        Edge cases for density and layout. The 10-container threshold switches from individual dots
        to grouped counts. Dots are now 12x12px SVG circles (up from 8x8px divs).
      </div>

      {#each stressTests as test (test.label)}
        {@const containers = makeMockContainers(test.statuses)}
        {@const grouped = containers.length > 10}
        {@const organized = organizeContainers(containers)}

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
          <div class="flex items-center gap-2">
            <div class="text-xs font-semibold text-(--pd-content-header)">{test.label}</div>
            <code class="text-[10px] text-(--pd-content-text)">({containers.length} total, {grouped ? 'grouped' : 'individual'})</code>
          </div>

          <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2">
            <div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div>
            <div class="flex items-start flex-wrap gap-0.5">
              {#if grouped}
                {#each Object.entries(organized) as [status, statusContainers] (status)}
                  {#if statusContainers.length > 0}
                    <Tooltip top tip="{capitalize(status)}: {statusContainers.length}">
                      <div class="flex flex-col items-center">
                        <div class="mt-3" title="{capitalize(status)}: {statusContainers.length}">
                          <MockStatusDotIcon {status} />
                        </div>
                        <div class="text-sm font-bold text-(--pd-content-text)">{statusContainers.length}</div>
                      </div>
                    </Tooltip>
                  {/if}
                {/each}
              {:else}
                {#each Object.entries(organized) as [status, statusContainers] (status)}
                  {#each statusContainers as container, i (i)}
                    <Tooltip top tip="{container.name}: {capitalize(status)}">
                      <MockStatusDotIcon {status} />
                    </Tooltip>
                  {/each}
                {/each}
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

  {:else if args.kind === 'accessibility'}
    <div class="flex flex-col gap-6">
      <div class="text-sm text-(--pd-content-text)">
        Accessibility improvements in the modernized StatusDot.
      </div>

      <div class="flex flex-col gap-4">
        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current implementation</div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
            <div class="text-xs font-semibold text-(--pd-content-header)">SVG with role="img" and aria-label</div>
            <div class="flex items-center gap-2 py-2">
              <Tooltip top tip="my-container: Running">
                <MockStatusDotIcon status="running" />
              </Tooltip>
              <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span>
            </div>
            <code class="text-[10px] text-(--pd-content-text)">role="img" aria-label="Running"</code>
          </div>

          <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
            <div class="text-xs font-semibold text-(--pd-content-header)">All statuses filled</div>
            <div class="flex items-center gap-2 py-2">
              {#each ['running', 'stopped', 'dead', 'paused'] as status (status)}
                <Tooltip top tip={capitalize(status)}>
                  <MockStatusDotIcon {status} />
                </Tooltip>
              {/each}
            </div>
            <code class="text-[10px] text-(--pd-content-text)">No more outline mode - all filled circles</code>
          </div>

          <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
            <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
            <div class="flex items-center gap-2 py-2">
              {#each ['running', 'stopped', 'dead', 'created'] as status (status)}
                <Tooltip top tip={capitalize(status)}>
                  <MockStatusDotIcon {status} />
                </Tooltip>
              {/each}
            </div>
            <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code>
          </div>

          <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
            <div class="text-xs font-semibold text-(--pd-content-header)">12x12px SVG (up from 8x8px)</div>
            <div class="flex items-center gap-3 py-2">
              <div class="flex items-center gap-1.5">
                <MockStatusDotIcon status="running" size="8" />
                <span class="text-xs text-(--pd-content-text)">Old (8px)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <MockStatusDotIcon status="running" />
                <span class="text-xs text-(--pd-content-text)">New (12px)</span>
              </div>
            </div>
            <code class="text-[10px] text-(--pd-content-text)">Larger target, still below 24px WCAG minimum</code>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Remaining gaps</div>
        <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1">
          <li>SVG shapes are currently identical circles - Figma icons will add shape differentiation</li>
          <li>12x12px is still below the 24x24px WCAG touch target minimum</li>
          <li>Color remains the primary differentiator until distinct icon shapes are added</li>
        </ul>
      </div>
    </div>

  {:else}
    {@const status = args.status ?? 'running'}
    {@const name = args.name ?? ''}
    {@const customTooltip = args.tooltip ?? ''}
    {@const number = args.number ?? 0}
    {@const tip = buildTooltip(customTooltip, name, status)}

    <Tooltip top {tip}>
      <div
        class="mr-0.5 {number ? 'mt-3' : ''}"
        title={tip}>
        <MockStatusDotIcon {status} />
      </div>
      {#if number}
        <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{number}</div>
      {/if}
    </Tooltip>
  {/if}
{/snippet}

<Story
  name="Basic"
  args={{
    status: 'running',
    name: 'my-container',
    tooltip: '',
    number: 0,
  }} />

<Story
  name="All Statuses"
  args={{ kind: 'allStatuses' }} />

<Story
  name="Number Badges"
  args={{ kind: 'numberBadges' }} />

<Story
  name="Pod Container Row (Individual)"
  args={{ kind: 'podRowIndividual' }} />

<Story
  name="Pod Container Row (Grouped)"
  args={{ kind: 'podRowGrouped' }} />

<Story
  name="Table Cell Context"
  args={{ kind: 'tableCell' }} />

<Story
  name="Density Stress Test"
  args={{ kind: 'stressTest' }} />

<Story
  name="Accessibility"
  args={{ kind: 'accessibility' }} />
