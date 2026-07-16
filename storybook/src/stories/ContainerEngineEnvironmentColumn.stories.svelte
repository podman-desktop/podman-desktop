<script context="module" lang="ts">
import { type Args, defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';

import MockContainerEngineEnvironmentColumn from './helpers/MockContainerEngineEnvironmentColumn.svelte';

/**
 * Stories for `ContainerEngineEnvironmentColumn` (`packages/renderer`).
 *
 * Environment column in Containers, Images, Volumes, Networks, and Pods tables.
 * Renders a pill `Label` with `ProviderInfoIcon` (StatusDot glyph for connection
 * lifecycle) and an optional socket-path tooltip.
 *
 * Stories use a presentation helper with resolved props (`status`, `name`, `tip`)
 * because Storybook cannot wire provider stores.
 *
 * **Tokens**: `--pd-status-*` for the icon; `--pd-label-bg` / `--pd-label-text` for the pill.
 * Deprecated `--pd-provider-*` tokens appear only in the Before/After story.
 *
 * **#18120**: Replaced color-only provider dots with connection status icons.
 */
const { Story } = defineMeta({
  render: template,
  title: 'ContainerEngineEnvironmentColumn',
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['started', 'stopped', 'starting', 'stopping', 'unknown'],
      description: 'Provider connection lifecycle status',
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

/** Matches `ProviderConnectionStatus` from `@podman-desktop/api`. */
type ConnectionStatus = 'started' | 'stopped' | 'starting' | 'stopping' | 'unknown';

type StatusVariant = {
  label: string;
  status: ConnectionStatus;
  name: string;
  tip: string;
  mapped: string;
  note?: string;
};

const statusVariants: StatusVariant[] = [
  {
    label: 'Started',
    status: 'started',
    name: 'Podman Machine Default',
    tip: '/var/run/podman-machine.sock',
    mapped: 'started → running',
  },
  {
    label: 'Stopped',
    status: 'stopped',
    name: 'Podman Machine Default',
    tip: '/var/run/podman-machine.sock',
    mapped: 'stopped → stopped',
  },
  {
    label: 'Starting',
    status: 'starting',
    name: 'podman',
    tip: '/run/podman/podman.sock',
    mapped: 'starting → waiting',
  },
  {
    label: 'Stopping',
    status: 'stopping',
    name: 'docker',
    tip: '/var/run/docker.sock',
    mapped: 'stopping → stopped',
  },
  {
    label: 'Unknown / unresolved',
    status: 'unknown',
    name: 'podman.missing-connection',
    tip: '',
    mapped: 'unknown → unknown',
    note: 'No matching connection → engineId as label + unknown status',
  },
];

type DisplayNameCase = {
  label: string;
  status: ConnectionStatus;
  name: string;
  tip: string;
  note: string;
};

const displayNameCases: DisplayNameCase[] = [
  {
    label: 'Single docker connection',
    status: 'started',
    name: 'docker',
    tip: '/var/run/docker.sock',
    note: 'containerConnectionCount[docker] === 1 → show connection.type',
  },
  {
    label: 'Multiple podman — default machine',
    status: 'started',
    name: 'Podman Machine Default',
    tip: '/var/run/podman-machine.sock',
    note: 'containerConnectionCount[podman] > 1 → show connection.displayName',
  },
  {
    label: 'Multiple podman — remote (stopped)',
    status: 'stopped',
    name: 'Podman Remote',
    tip: '/var/run/podman-remote.sock',
    note: 'Status icon reflects connection.status independently of label',
  },
  {
    label: 'Unresolved engineId',
    status: 'unknown',
    name: 'podman.unknown-machine',
    tip: '',
    note: 'No matching connection → show raw object.engineId + unknown icon',
  },
];

type TableContextRow = {
  resource: string;
  list: string;
  status: ConnectionStatus;
  name: string;
  tip: string;
};

const tableContextRows: TableContextRow[] = [
  {
    resource: 'nginx',
    list: 'Containers',
    status: 'started',
    name: 'Podman Machine Default',
    tip: '/var/run/podman-machine.sock',
  },
  {
    resource: 'docker.io/library/alpine:latest',
    list: 'Images',
    status: 'started',
    name: 'docker',
    tip: '/var/run/docker.sock',
  },
  {
    resource: 'my-volume',
    list: 'Volumes',
    status: 'stopped',
    name: 'Podman Remote',
    tip: '/var/run/podman-remote.sock',
  },
  {
    resource: 'bridge',
    list: 'Networks',
    status: 'started',
    name: 'podman',
    tip: '/run/podman/podman.sock',
  },
  {
    resource: 'my-web-app-pod',
    list: 'Pods',
    status: 'starting',
    name: 'Podman Machine Default',
    tip: '/var/run/podman-machine.sock',
  },
];
</script>

{#snippet template({ _children, ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  {#if args.kind === 'statuses'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Connection lifecycle status drives the StatusDot glyph via
        <code>ProviderInfoIcon</code> → <code>StatusDotIcon</code>.
        Shape and <code>--pd-status-*</code> fill encode
        status — not provider brand.
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {#each statusVariants as variant (variant.label)}
          <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
            <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

            <div class="max-w-xs py-2">
              <MockContainerEngineEnvironmentColumn
                status={variant.status}
                name={variant.name}
                tip={variant.tip} />
            </div>

            <code class="text-[10px] text-(--pd-content-text) break-all">{variant.mapped}</code>
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
        Display name from <code>ContainerEngineEnvironmentColumn</code>: when more than one
        connection shares a type, show <code>connection.displayName</code>; otherwise
        <code>connection.type</code>. Unresolved connection → <code>object.engineId</code>.
        Icon always uses an explicit connection status.
      </div>

      <div class="flex flex-col gap-3">
        {#each displayNameCases as variant (variant.label)}
          <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6">
            <div class="w-full max-w-xs shrink-0">
              <MockContainerEngineEnvironmentColumn
                status={variant.status}
                name={variant.name}
                tip={variant.tip} />
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
        Tooltip content is the connection socket path when a connection is resolved.
        Hover each label to verify tip behavior.
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div>
          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn
              status="started"
              name="Podman Machine Default"
              tip="/var/run/podman-machine.sock" />
          </div>
          <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div>
          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn status="started" name="docker" tip="" />
          </div>
          <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div>
          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn status="started" name="docker" tip="/var/run/docker.sock" />
          </div>
          <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div>
          <div class="max-w-[10rem] py-2">
            <MockContainerEngineEnvironmentColumn
              status="stopped"
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
              <MockContainerEngineEnvironmentColumn status={row.status} name={row.name} tip={row.tip} />
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else if args.kind === 'accessibility'}
    <div class="flex flex-col gap-6">
      <div class="text-sm text-(--pd-content-text)">
        Status icon is an SVG with <code>role="img"</code> and a capitalized
        <code>aria-label</code> for the mapped StatusDot status. Shape and color both
        communicate connection lifecycle.
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">ARIA on status icon</div>
          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn
              status="started"
              name="Podman Machine Default"
              tip="/var/run/podman-machine.sock" />
          </div>
          <code class="text-[10px] text-(--pd-content-text)">role="img" aria-label="Running"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div>
          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn status="started" name="docker" tip="/var/run/docker.sock" />
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
          <div class="flex max-w-xs flex-col gap-2 py-2">
            <MockContainerEngineEnvironmentColumn status="started" name="podman" tip="/run/podman/podman.sock" />
            <MockContainerEngineEnvironmentColumn status="stopped" name="docker" tip="/var/run/docker.sock" />
            <MockContainerEngineEnvironmentColumn status="unknown" name="unknown.engine" />
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify --pd-status-* tokens</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">A11y (#18120)</div>
          <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)">
            <li>Shape + color encode connection status (same as StatusDot)</li>
            <li>12×12 SVG with <code>role="img"</code> and status <code>aria-label</code></li>
            <li>Fill via <code>var(--pd-status-*)</code> with HC theme support</li>
          </ul>
        </div>
      </div>
    </div>
  {:else if args.kind === 'comparison'}
    <div class="flex flex-col gap-4">
      <div class="text-sm text-(--pd-content-text)">
        Before: color-only 8×8 provider-type dots (<code>--pd-provider-*</code>, deprecated).
        After: StatusDot glyphs for connection lifecycle (<code>--pd-status-*</code>).
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Before — provider color dots</div>
          <div class="flex items-center gap-3 py-2">
            <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div>
            <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div>
            <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div>
            <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">8×8px — color only, no status (deprecated tokens)</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">After — connection status icons</div>
          <div class="flex max-w-xs flex-col gap-2 py-2">
            <MockContainerEngineEnvironmentColumn status="started" name="started" tip="" />
            <MockContainerEngineEnvironmentColumn status="stopped" name="stopped" tip="" />
            <MockContainerEngineEnvironmentColumn status="starting" name="starting" tip="" />
            <MockContainerEngineEnvironmentColumn status="unknown" name="unknown" tip="" />
          </div>
          <code class="text-[10px] text-(--pd-content-text)">StatusDot glyphs + --pd-status-* fills</code>
        </div>
      </div>
    </div>
  {:else}
    <div class="max-w-xs">
      <MockContainerEngineEnvironmentColumn status={args.status} name={args.name} tip={args.tip} />
    </div>
  {/if}
{/snippet}

<Story
  name="Basic"
  args={{
    status: 'started',
    name: 'Podman Machine Default',
    tip: '/var/run/podman-machine.sock',
  }} />

<Story
  name="Connection Statuses"
  args={{ kind: 'statuses' }} />

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
  name="Before After"
  args={{ kind: 'comparison' }} />
