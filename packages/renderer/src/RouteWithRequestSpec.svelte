<script lang="ts">
import Route from './Route.svelte';

export let requestParser: (request: { query: Record<string, string>; params: Record<string, string> }) => unknown;
</script>
<Route requestParser={requestParser} let:request>{JSON.stringify(request)}</Route>
