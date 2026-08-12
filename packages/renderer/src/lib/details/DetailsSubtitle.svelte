<script lang="ts">
interface Props {
  style?: string;
}

let { style = '' }: Props = $props();
</script>

<td class="pl-2 text-md font-semibold text-[var(--pd-table-body-text-sub-secondary)] {style}">
  <slot />
</td>
