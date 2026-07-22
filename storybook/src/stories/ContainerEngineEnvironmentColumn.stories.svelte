<script context="module" lang="ts">
import { type Args, defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';

import MockContainerEngineEnvironmentColumn from './helpers/MockContainerEngineEnvironmentColumn.svelte';

/**
 * Stories for the `ContainerEngineEnvironmentColumn` component from `packages/renderer`.
 *
 * Engine/provider indicator column used in Containers, Images, Volumes, Networks,
 * and Pods list tables. Renders a `Label` with a colored `ProviderInfoCircle` and
 * an optional tooltip showing the connection socket path.
 *
 * The real column resolves `object.engineId` against `providerInfos` /
 * `containerConnectionCount` stores. These stories use a presentation helper that
 * accepts the resolved props (`type`, `name`, `tip`) so current visuals can be
 * documented without store wiring.
 *
 * **Theming**: Uses CSS custom properties `--pd-provider-podman`,
 * `--pd-provider-docker`, `--pd-provider-kubernetes`, `--pd-provider-unknown`,
 * `--pd-label-bg`, and `--pd-label-text` from the color registry.
 *
 * **Planned modernization** (#18120): Replace the plain colored circle with an
 * icon-based provider indicator consistent with the design system (e.g. StatusDot
 * / StatusDotIcon pattern).
 */
const { Story } = defineMeta({
  render: template,
  title: 'ContainerEngineEnvironmentColumn',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['podman', 'docker', 'kubernetes', undefined],
      description: 'Provider connection type (colored circle)',
    },
    name: {
      control: 'text',
      description: 'Display label (type when single connection; displayName when multiple)',
    },
    tip: {
      control: 'text',
      description: 'Tooltip text (connection endpoint socket path)',
    },
    kind: {
      table: { disable: true },
    },
  },
});

type ProviderType = 'podman' | 'docker' | 'kubernetes' | undefined;

type ProviderVariant = {
  label: string;
  type: ProviderType;
  name: string;
  tip: string;
  token: string;
  note?: string;
};

const providerVariants: ProviderVariant[] = [
  {
    label: 'Podman',
    type: 'podman',
    name: 'podman',
    tip: '/var/run/podman-machine.sock',
    token: '--pd-provider-podman',
  },
  {
    label: 'Docker',
    type: 'docker',
    name: 'docker',
    tip: '/var/run/docker.sock',
    token: '--pd-provider-docker',
  },
  {
    label: 'Kubernetes',
    type: 'kubernetes',
    name: 'kubernetes',
    tip: '',
    token: '--pd-provider-kubernetes',
    note: 'Rare in this column; circle supports kubernetes type',
  },
  {
    label: 'Unknown / unresolved',
    type: undefined,
    name: 'podman.missing-connection',
    tip: '',
    token: '--pd-provider-unknown',
    note: 'Falls back to engineId as label when connection is missing',
  },
];

type DisplayNameCase = {
  label: string;
  type: ProviderType;
  name: string;
  tip: string;
  note: string;
};

const displayNameCases: DisplayNameCase[] = [
  {
    label: 'Single docker connection',
    type: 'docker',
    name: 'docker',
    tip: '/var/run/docker.sock',
    note: 'containerConnectionCount[docker] === 1 → show connection.type',
  },
  {
    label: 'Multiple podman — default machine',
    type: 'podman',
    name: 'Podman Machine Default',
    tip: '/var/run/podman-machine.sock',
    note: 'containerConnectionCount[podman] > 1 → show connection.displayName',
  },
  {
    label: 'Multiple podman — remote',
    type: 'podman',
    name: 'Podman Remote',
    tip: '/var/run/podman-remote.sock',
    note: 'containerConnectionCount[podman] > 1 → show connection.displayName',
  },
  {
    label: 'Unresolved engineId',
    type: undefined,
    name: 'podman.unknown-machine',
    tip: '',
    note: 'No matching connection → show raw object.engineId',
  },
];

type TableContextRow = {
  resource: string;
  list: string;
  type: ProviderType;
  name: string;
  tip: string;
};

const tableContextRows: TableContextRow[] = [
  {
    resource: 'nginx',
    list: 'Containers',
    type: 'podman',
    name: 'Podman Machine Default',
    tip: '/var/run/podman-machine.sock',
  },
  {
    resource: 'docker.io/library/alpine:latest',
    list: 'Images',
    type: 'docker',
    name: 'docker',
    tip: '/var/run/docker.sock',
  },
  {
    resource: 'my-volume',
    list: 'Volumes',
    type: 'podman',
    name: 'Podman Remote',
    tip: '/var/run/podman-remote.sock',
  },
  {
    resource: 'bridge',
    list: 'Networks',
    type: 'podman',
    name: 'podman',
    tip: '/run/podman/podman.sock',
  },
  {
    resource: 'my-web-app-pod',
    list: 'Pods',
    type: 'podman',
    name: 'Podman Machine Default',
    tip: '/var/run/podman-machine.sock',
  },
];
</script>

{#snippet template({ _children, ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  {#if args.kind === 'providers'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Provider type drives the colored circle via <code>ProviderInfoCircle</code> and
        <code>providerColors</code>. Colors come from the color registry tokens below.
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {#each providerVariants as variant (variant.label)}
          <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
            <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

            <div class="max-w-xs py-2">
              <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
            </div>

            <code class="text-[10px] text-(--pd-content-text) break-all">{variant.token}</code>
            {#if variant.note}
              <div class="text-[10px] text-(--pd-content-text)">{variant.note}</div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {:else if args.kind === 'displayNames'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
        connection shares a type, show <code>connection.displayName</code>; otherwise show
        <code>connection.type</code>. If no connection matches, fall back to
        <code>object.engineId</code>.
      </div>

      <div class="flex flex-col gap-3">
        {#each displayNameCases as variant (variant.label)}
          <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6">
            <div class="w-full max-w-xs shrink-0">
              <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
            </div>
            <div class="flex flex-col gap-1">
              <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>
              <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if args.kind === 'tooltips'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
        tip behavior is preserved.
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div>
          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn
              type="podman"
              name="Podman Machine Default"
              tip="/var/run/podman-machine.sock" />
          </div>
          <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div>
          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="" />
          </div>
          <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div>
          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
          </div>
          <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div>
          <div class="max-w-[10rem] py-2">
            <MockContainerEngineEnvironmentColumn
              type="podman"
              name="Very Long Podman Machine Display Name"
              tip="/Users/example/.local/share/containers/podman/machine/qemu/podman.sock" />
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code>
        </div>
      </div>
    </div>
  {:else if args.kind === 'tableContexts'}
    <div class="flex flex-col gap-6">
      <div class="text-sm text-(--pd-content-text)">
        The Environment column appears in five list tables. Each row below mocks a typical table
        cell layout with the Environment column on the right.
      </div>

      {#each tableContextRows as row (row.list)}
        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">
            {row.list} list
          </div>
          <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
            <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
              <input type="checkbox" class="w-3.5 h-3.5" disabled />
            </div>
            <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
              <div class="truncate text-sm text-(--pd-content-header)">{row.resource}</div>
              <div class="text-xs text-(--pd-content-text)">{row.list.slice(0, -1)}</div>
            </div>
            <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)">
              <span class="text-xs text-(--pd-content-text)">Running</span>
            </div>
            <div class="w-48 shrink-0 px-3 py-2">
              <MockContainerEngineEnvironmentColumn type={row.type} name={row.name} tip={row.tip} />
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else if args.kind === 'accessibility'}
    <div class="flex flex-col gap-6">
      <div class="text-sm text-(--pd-content-text)">
        Current accessibility surface before modernization. The circle is a plain
        <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
        differentiator by provider type.
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div>
          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn
              type="podman"
              name="Podman Machine Default"
              tip="/var/run/podman-machine.sock" />
          </div>
          <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div>
          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
          <div class="flex max-w-xs flex-col gap-2 py-2">
            <MockContainerEngineEnvironmentColumn type="podman" name="podman" tip="/run/podman/podman.sock" />
            <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
            <MockContainerEngineEnvironmentColumn name="unknown.engine" />
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div>
          <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)">
            <li>Color-only differentiation — no icon shape per provider</li>
            <li>Circle is a raw <code>div</code>, not an SVG icon</li>
            <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li>
          </ul>
        </div>
      </div>
    </div>
  {:else if args.kind === 'comparison'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
        modernized status indicators (reference for #18120).
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div>
          <div class="flex items-center gap-3 py-2">
            <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div>
            <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div>
            <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div>
            <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div>
          <div class="text-sm text-(--pd-content-text) py-2">
            Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with
            <code>role="img"</code>, larger visible indicator, and shape + color differentiation.
          </div>
          <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code>
        </div>
      </div>

      <div class="max-w-xs">
        <div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div>
        <MockContainerEngineEnvironmentColumn
          type="podman"
          name="Podman Machine Default"
          tip="/var/run/podman-machine.sock" />
      </div>
    </div>
  {:else}
    <div class="max-w-xs">
      <MockContainerEngineEnvironmentColumn type={args.type} name={args.name ?? 'podman'} tip={args.tip ?? ''} />
    </div>
  {/if}
{/snippet}

<Story
  name="Basic"
  args={{
    type: 'podman',
    name: 'Podman Machine Default',
    tip: '/var/run/podman-machine.sock',
  }} />

<Story
  name="Provider Types"
  args={{ kind: 'providers' }} />

<Story
  name="Display Names"
  args={{ kind: 'displayNames' }} />

<Story
  name="Tooltips"
  args={{ kind: 'tooltips' }} />

<Story
  name="Table Cell Contexts"
  args={{ kind: 'tableContexts' }} />

<Story
  name="Accessibility"
  args={{ kind: 'accessibility' }} />

<Story
  name="Comparison"
  args={{ kind: 'comparison' }} />
