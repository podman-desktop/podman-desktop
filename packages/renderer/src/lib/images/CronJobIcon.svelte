<script lang="ts">
interface Props {
  size: string;
  solid: boolean;
}

let { size = '40', solid }: Props = $props();

let style: string = solid ? 'fill:currentColor' : 'fill:none;stroke:currentColor;stroke-width:0.3;stroke-linecap:round';
</script>

<svg
  width={size}
  height={size}
  viewBox="1 1 6.4666665 6.4666666"
  version="1.1"
  xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <g transform="translate(0.04834174,-0.02716923)">
    <g transform="translate(-146.85099,-82.991737)">
      <path
        {style}
        d="m 150.60768,88.010474 c -0.0253,1.38e-4 -0.29197,0.0023 -0.40948,0.0035 -0.03,3.05e-4 -0.0996,0.06165 -0.0996,0.09407 v 0.844393 c 0,0.04636 0.0301,0.0856 0.0719,0.09924 0.0102,0.0033 0.10176,0.0051 0.11311,0.0051" />
      <g
        transform="matrix(1.0220162,0,0,1.0219963,146.66189,82.886364)"
        style="fill:none;stroke:currentColor;stroke-width:0.35">
        <circle cx="5.8129725" cy="5.8198314" r="1.3409275" />
        <path d="M 5.4880211,3.4972497 H 6.1379239" />
        <path d="M 5.8300189,5.1861051 V 5.6711072" />
      </g>
      <rect {style} width="1.0529765" height="1.0529071" x="148.15245" y="86.050011" ry="0.10417491" />
      <rect {style} width="1.0529765" height="1.0529071" x="148.15245" y="88.003777" ry="0.10417491" />
      <rect {style} width="1.0529765" height="1.0529071" x="150.09871" y="86.050011" ry="0.10417491" />
      <rect {style} width="1.0529765" height="1.0529071" x="152.06189" y="84.321266" ry="0.10417491" />
    </g>
  </g>
</svg>
