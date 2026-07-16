<script lang="ts">
interface Props {
  /** 0–100 */
  percent: number;
  size?: number;
  /** Ring thickness in px */
  strokeWidth?: number;
  class?: string;
}

let { percent, size = 16, strokeWidth = 2.5, class: className = '' }: Props = $props();

const clamped = $derived(Math.max(0, Math.min(100, percent)));
const radius = $derived((size - strokeWidth) / 2);
const circumference = $derived(2 * Math.PI * radius);
const dashOffset = $derived(circumference * (1 - clamped / 100));
</script>

<svg
  width={size}
  height={size}
  viewBox={`0 0 ${size} ${size}`}
  class="shrink-0 -rotate-90 {className}"
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={Math.round(clamped)}
  aria-label="Install progress {Math.round(clamped)}%">
  <!-- Track -->
  <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    fill="none"
    stroke="color-mix(in srgb, var(--pd-action-button-spinner) 25%, transparent)"
    stroke-width={strokeWidth} />
  <!-- Progress arc -->
  <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    fill="none"
    stroke="var(--pd-action-button-spinner)"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-dasharray={circumference}
    stroke-dashoffset={dashOffset} />
</svg>
