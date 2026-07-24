<script lang="ts">
interface Props {
  object: string;
}

let { object }: Props = $props();
</script>

<div class="pr-6 text-[var(--pd-table-body-text)] max-w-full truncate" title={object}>
  {object}
</div>
