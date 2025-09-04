<script lang="ts">
interface Props {
  size?: string;
  class?: string;
  style?: string;
}

let { size = '9', class: className = '', style: styleName = '' }: Props = $props();
</script>

<svg width={size} height={size} class={className} style={styleName} viewBox="0 0 7 9" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M3.09226 7.99996V1.86998L0.735729 4.23398L0.154053 3.65976L3.50242 0.318848L6.84333 3.65976L6.27657 4.23398L3.91258 1.86998V7.99996H3.09226Z" fill="currentColor"/>
</svg>
