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
  aria-label="Experimental"
  xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg">
  <path d="M7.00006 1H6.50006V4.5L9.70026 9.1875C10.4742 10.3827 9.65888 12 8.28326 12H1.71686C0.340359 11.9998 -0.474317 10.3826 0.299866 9.1875L3.50006 4.5V1H3.00006V0H7.00006V1ZM4.50006 4.5C4.50006 4.70103 4.4395 4.8974 4.32623 5.06348L1.13873 9.73047C0.747528 10.3341 1.21957 10.9997 1.71686 11H8.28326C8.77705 11 9.24688 10.3417 8.86627 9.74023L5.67389 5.06348C5.56064 4.89741 5.50006 4.70101 5.50006 4.5V1H4.50006V4.5ZM6.50006 7.5C6.7762 7.5 7.00006 7.72386 7.00006 8C7.00006 8.27614 6.7762 8.5 6.50006 8.5H3.50006C3.22397 8.49994 3.00006 8.27611 3.00006 8C3.00006 7.72389 3.22397 7.50006 3.50006 7.5H6.50006Z" fill="currentColor"/>
</svg>
