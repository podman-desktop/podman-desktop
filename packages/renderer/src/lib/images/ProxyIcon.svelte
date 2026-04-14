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
  aria-label="Proxy"
  xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg">
  <path d="M6.5 12H5.5V0H6.5V12ZM4.70703 6L2.35352 8.35352L1.64648 7.64648L2.79297 6.5H0V5.5H2.79297L1.64648 4.35352L2.35352 3.64648L4.70703 6ZM12.207 6L9.85352 8.35352L9.14648 7.64648L10.293 6.5H7.5V5.5H10.293L9.14648 4.35352L9.85352 3.64648L12.207 6Z" fill="currentColor"/>
</svg>

