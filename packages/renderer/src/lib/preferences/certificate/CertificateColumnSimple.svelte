<script lang="ts">
interface Props {
  object: string;
}

let { object }: Props = $props();
</script>

<div title={object} class="text-(--pd-table-body-text-highlight) overflow-hidden text-ellipsis">
  {object}
</div>

