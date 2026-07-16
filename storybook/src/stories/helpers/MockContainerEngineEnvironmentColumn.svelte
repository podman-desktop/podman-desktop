<script lang="ts">
/**
 * Storybook stand-in for `ContainerEngineEnvironmentColumn`.
 *
 * The real column resolves `engineId` against provider stores. Storybook cannot
 * load those stores, so this helper accepts already-resolved display props and
 * recreates the same `Label` + `ProviderInfoIcon` markup used in production.
 *
 * Status→glyph mapping mirrors `connectionStatusToDotStatus` in
 * `packages/renderer/src/lib/ui/ProviderInfoIcon.svelte` (cannot import renderer from Storybook).
 */
import { Tooltip } from '@podman-desktop/ui-svelte';

import MockStatusDotIcon from './MockStatusDotIcon.svelte';

/** Matches `ProviderConnectionStatus` from `@podman-desktop/api`. */
type ConnectionStatus = 'started' | 'stopped' | 'starting' | 'stopping' | 'unknown';

/** Keep in sync with `connectionStatusToDotStatus` in ProviderInfoIcon.svelte */
const CONNECTION_STATUS_TO_STATUS_DOT: Record<ConnectionStatus, string> = {
  started: 'running',
  stopped: 'stopped',
  starting: 'waiting',
  stopping: 'stopped',
  unknown: 'unknown',
};

interface Props {
  /** Connection lifecycle status (required — use `unknown` when unresolved). */
  status: ConnectionStatus;
  /** Label text (connection type, or displayName when multiple connections share a type). */
  name: string;
  /** Tooltip content — typically `connection.endpoint.socketPath`. */
  tip?: string;
}

let { status, name, tip = '' }: Props = $props();

let dotStatus = $derived(CONNECTION_STATUS_TO_STATUS_DOT[status]);
</script>

<Tooltip {tip}>
  <div
    class="flex w-full items-center gap-x-1 rounded-full bg-[var(--pd-label-bg)] py-1 px-[calc(0.25rem+2pt)] text-sm text-[var(--pd-label-text)] select-none">
    <span class="shrink-0">
      <MockStatusDotIcon status={dotStatus} />
    </span>
    <span class="min-w-0 flex-1 overflow-x-hidden text-ellipsis whitespace-nowrap">
      {name}
    </span>
  </div>
</Tooltip>
