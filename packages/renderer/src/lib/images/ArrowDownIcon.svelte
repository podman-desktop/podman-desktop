<script lang="ts">
interface Props {
  size?: string;
  class?: string;
  style?: string;
}

let { size = '9', class: className = '', style: styleName = '' }: Props = $props();
</script>

<svg width={size} height={size} viewBox="0 0 7 9" class={className} style={styleName} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M3.91249 0.363636V6.49361L6.26902 4.12962L6.8507 4.70384L3.50233 8.04474L0.161421 4.70384L0.728183 4.12962L3.09217 6.49361V0.363636H3.91249Z" fill="currentColor"/>
</svg>
