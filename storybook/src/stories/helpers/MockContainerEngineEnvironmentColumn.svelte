<script lang="ts">
/**
 * Storybook stand-in for `ContainerEngineEnvironmentColumn`.
 *
 * The real column resolves `engineId` against provider stores. Storybook cannot
 * load those stores, so this helper accepts the already-resolved display props
 * and recreates the same `Label` + `ProviderInfoCircle` markup used in production.
 *
 * Markup and color class strings are inlined (not imported from `packages/renderer`)
 * so Tailwind scans them — Storybook's content paths do not include the renderer package.
 */
import { Tooltip } from '@podman-desktop/ui-svelte';

/** Mirrors `providerColors` from `packages/renderer/src/lib/ui/ProviderInfoCircle.ts`. */
const providerColors: Record<string, string> = {
  podman: 'bg-(--pd-provider-podman)',
  docker: 'bg-(--pd-provider-docker)',
  kubernetes: 'bg-(--pd-provider-kubernetes)',
  unknown: 'bg-(--pd-provider-unknown)',
};

interface Props {
  /** Provider connection type driving the colored indicator. */
  type?: 'kubernetes' | 'podman' | 'docker';
  /** Label text (connection type, or displayName when multiple connections share a type). */
  name: string;
  /** Tooltip content — typically `connection.endpoint.socketPath`. */
  tip?: string;
}

let { type, name, tip = '' }: Props = $props();

let color = $derived(providerColors[type ?? 'unknown']);
</script>

<Tooltip {tip}>
  <div
    class="flex w-full items-center gap-x-1 rounded-md bg-[var(--pd-label-bg)] p-1 text-sm text-[var(--pd-label-text)]">
    <div aria-label="Provider info circle" class="min-h-2 min-w-2 shrink-0 rounded-full {color}"></div>
    <span class="min-w-0 flex-1 overflow-x-hidden text-ellipsis whitespace-nowrap">
      {name}
    </span>
  </div>
</Tooltip>
