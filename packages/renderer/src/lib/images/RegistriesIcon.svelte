<script lang="ts">
interface Props {
  size?: string | number;
  class?: string;
  style?: string;
}

let { size = '14', class: className = '', style: styleName = '' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  class={className}
  style={styleName}
  viewBox="0 0 10 12.7279"
  version="1.1"
  aria-label="Registries"
  xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg">
  <path d="M10 12H0V11H10V12ZM10 10H0V0H10V10ZM1 9H9V1H1V9ZM7.5 7.5H2.5V6.5H7.5V7.5ZM7.5 5.5H2.5V4.5H7.5V5.5ZM7.5 3.5H2.5V2.5H7.5V3.5Z" fill="currentColor"/>
</svg>

