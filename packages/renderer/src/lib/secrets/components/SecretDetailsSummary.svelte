<script lang="ts">
import DetailsCell from '/@/lib/details/DetailsCell.svelte';
import DetailsTable from '/@/lib/details/DetailsTable.svelte';
import DetailsTitle from '/@/lib/details/DetailsTitle.svelte';
import type { SecretInfoUI } from '/@/lib/secrets/SecretInfoUI';

interface Props {
  secret: SecretInfoUI;
}

let { secret }: Props = $props();
</script>

<DetailsTable>
  <tr>
    <DetailsTitle>Details</DetailsTitle>
  </tr>
  <tr>
    <DetailsCell>Name</DetailsCell>
    <DetailsCell>{secret.Name}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>Id</DetailsCell>
    <DetailsCell>{secret.Id}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>Engine ID</DetailsCell>
    <DetailsCell>{secret.engineId}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>Engine Name</DetailsCell>
    <DetailsCell>{secret.engineName}</DetailsCell>
  </tr>
</DetailsTable>
