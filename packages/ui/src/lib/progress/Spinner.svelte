<script lang="ts">
interface Props {
  size?: string;
  class?: string;
  style?: string;
  label?: string;
}
let { size = '2em', class: className, style, label = 'Loading' }: Props = $props();
</script>

<i
  role="status"
  aria-label={label}
  aria-live="polite"
  class="flex justify-center items-center {className}"
  style={style}>
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <g>
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(0, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.8" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(45, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.16" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(90, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.32" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(135, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.48" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(180, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.64" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(225, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.72" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(270, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.8" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(315, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.8" />
    </g>
  </svg>
</i>

<style>
  g {
    animation: spinner-rotate 720ms steps(8) infinite;
    transform-origin: 32px 32px;
  }

  @keyframes spinner-rotate {
    to {
      transform: rotate(1turn);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    g {
      animation: none;
    }
  }
</style>
