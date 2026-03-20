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
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(0, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.4" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(45, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.08" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(90, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.16" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(135, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.24" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(180, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.32" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(225, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.36" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(270, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.4" />
      <line x1="32" y1="4" x2="32" y2="16" transform="rotate(315, 32, 32)" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.4" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        calcMode="discrete"
        values="0 32 32;45 32 32;90 32 32;135 32 32;180 32 32;225 32 32;270 32 32;315 32 32"
        keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875"
        dur="720ms"
        repeatCount="indefinite" />
    </g>
  </svg>
</i>
