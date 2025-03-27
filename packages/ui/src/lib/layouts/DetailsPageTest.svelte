<script>
import DetailsPage from './DetailsPage.svelte';
</script>
<DetailsPage 
  title="my-title"
  titleDetail="my-details"
  subtitle="my-subtitle"
  breadcrumbLeftPart="bcLeft"
  breadcrumbRightPart="bcRight"
  breadcrumbTitle="bcTitle">

  <svelte:fragment slot="content">My content slot</svelte:fragment>
  <svelte:fragment slot="tabs">My tabs slot</svelte:fragment>
  <svelte:fragment slot="icon">My icon slot</svelte:fragment>
  <svelte:fragment slot="subtitle">My subtitle slot</svelte:fragment>
  <svelte:fragment slot="actions">My actions slot</svelte:fragment>
  <svelte:fragment slot="detail">My detail slot</svelte:fragment>
</DetailsPage>
