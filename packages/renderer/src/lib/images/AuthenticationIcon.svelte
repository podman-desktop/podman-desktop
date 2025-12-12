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
  aria-label="Authentication"
  xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg">
  <path xmlns="http://www.w3.org/2000/svg" d="M8.35352 0C10.2865 0 11.8535 1.567 11.8535 3.5C11.8535 5.433 10.2865 7 8.35352 7C7.56708 7 6.84123 6.74061 6.25684 6.30273L4.30957 8.24902L5.70703 9.64648L5 10.3535L3.60254 8.95605L2.80957 9.74902L4.20703 11.1465L3.5 11.8535L2.10254 10.4561L0.707031 11.8535L0 11.1465L5.5498 5.5957C5.11242 5.0115 4.85352 4.28595 4.85352 3.5C4.85352 1.567 6.42052 6.44256e-08 8.35352 0ZM8.35352 1C6.9728 1 5.85352 2.11929 5.85352 3.5C5.85352 4.88071 6.9728 6 8.35352 6C9.73423 6 10.8535 4.88071 10.8535 3.5C10.8535 2.11929 9.73423 1 8.35352 1Z" fill="currentColor"/>
</svg>

