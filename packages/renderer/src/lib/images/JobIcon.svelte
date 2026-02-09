<script lang="ts">
interface Props {
  size?: string;
  solid?: boolean;
  class?: string;
}

let { size = '40', solid = false, class: className = '' }: Props = $props();

let baseStyle: string = 'stroke:currentColor;stroke-width:0.3;stroke-linecap:round;';
let style: string = baseStyle + (solid ? 'fill:currentColor' : 'fill:none');
</script>

<svg
  width={size}
  height={size}
  class={className}
  viewBox="1 1 6.4666665 6.4666666"
  version="1.1"
  aria-label="Job"
  xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <g transform="matrix(1.251156,0,0,1.2507349,-1.1316456,-1.0930813)">
    <rect {style} width="0.98944372" height="0.98944372" x="5.6247559" y="3.7518394" ry="0.097895831" />
    <rect {style} width="0.98944372" height="0.98944372" x="3.7906644" y="5.6341958" ry="0.097895831" />
    <rect {style} width="0.98944372" height="0.98944372" x="1.9618356" y="3.7518394" ry="0.097895831" />
    <rect {style} width="0.98944372" height="0.98944372" x="1.9618356" y="5.6341958" ry="0.097895831" />
    <rect {style} width="0.98944372" height="0.98944372" x="3.7906644" y="3.7518394" ry="0.097895831" />
    <rect {style} width="0.98944372" height="0.98944372" x="5.6247559" y="1.8936164" ry="0.097895831" />
    <rect {style} width="0.98944372" height="0.98944372" x="5.6247559" y="5.6341958" ry="0.097895831" />
  </g>
</svg>
