<script lang="ts">
interface Props {
  object: string;
}
let { object }: Props = $props();
</script>

<div class="text-[var(--pd-table-body-text)] max-w-full text-wrap line-clamp-2">
  {object}
</div>
