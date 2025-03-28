<script>
import DetailsPage from './DetailsPage.svelte';
</script>
  <DetailsPage 
    title="my-title"
    titleDetail="my-details"
    subtitle="my-subtitle">
  
    {#snippet contentSnippet()}My content slot{/snippet}
    {#snippet tabsSnippet()}My tabs slot{/snippet}
    {#snippet iconSnippet()}My icon slot{/snippet}
    {#snippet subtitleSnippet()}My subtitle slot{/snippet}
    {#snippet actionsSnippet()}My actions slot{/snippet}
    {#snippet detailSnippet()}My detail slot{/snippet}
</DetailsPage>
