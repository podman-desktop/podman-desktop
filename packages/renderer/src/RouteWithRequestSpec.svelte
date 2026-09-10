<script lang="ts">
import Route from './Route.svelte';

interface Props {
  requestParser: (request: { query: Record<string, string>; params: Record<string, string> }) => unknown;
}

let { requestParser }: Props = $props();
</script>
<Route requestParser={requestParser} let:request={request}>{JSON.stringify(request)}</Route>
