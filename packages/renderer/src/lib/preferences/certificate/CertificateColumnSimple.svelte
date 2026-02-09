<script lang="ts">
interface Props {
  object: string;
}

let { object }: Props = $props();
</script>

<div class="mx-1 text-[var(--pd-table-body-text-highlight)] overflow-hidden text-ellipsis whitespace-nowrap">
  <span title={object}>{object}</span>
</div>

