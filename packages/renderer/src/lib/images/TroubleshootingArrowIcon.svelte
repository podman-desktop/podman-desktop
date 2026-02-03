<script lang="ts">
interface Props {
  size?: string | number;
  class?: string;
  style?: string;
}

let { size = '8', class: className = '', style = '' }: Props = $props();
</script>
        
<svg
  width={size}
  height={size}
  class={className}
  style={style}
  viewBox="0 0 8 6"
  version="1.1"
  aria-label="Troubleshooting Arrow"
  xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg">
  <path d="M8 0L8 6H7.03516L7.03516 1.81641C6.2203 3.10453 5.19074 4.11144 3.94531 4.83594C2.71301 5.55331 1.39731 5.91398 0 5.92188L0 4.93555C1.31825 4.93038 2.55182 4.58506 3.69922 3.89453C4.85497 3.1989 5.79339 2.23 6.51367 0.988281L3 0.988281V0L8 0Z" fill="currentColor"/>
</svg>