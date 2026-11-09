<script lang="ts">
interface Props {
  title: string;
  id?: string;
}

let { title, id }: Props = $props();
</script>

<!-- Non-interactive title of a group of items -->
<div id={id} class="px-2.5 pt-2.5 pb-1 text-xs font-semibold whitespace-nowrap text-[var(--pd-dropdown-label-text)]">
  {title}
</div>
