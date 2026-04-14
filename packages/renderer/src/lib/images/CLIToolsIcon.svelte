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
  viewBox="0 0 12.7279 12.7279"
  version="1.1"
  aria-label="CLI Tools"
  xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg">
  <path xmlns="http://www.w3.org/2000/svg" d="M12 10H0V0H12V10ZM1 9H11V1H1V9ZM5.20703 4.5L2.85352 6.85352L2.14648 6.14648L3.79297 4.5L2.14648 2.85352L2.85352 2.14648L5.20703 4.5Z" fill="currentColor"/>
</svg>

