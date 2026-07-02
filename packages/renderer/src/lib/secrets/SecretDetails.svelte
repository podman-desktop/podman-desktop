<script lang="ts">
import { NavigationPage } from '@podman-desktop/core-api';
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import SecretIcon from '/@/lib/images/SecretIcon.svelte';
import SecretActions from '/@/lib/secrets/components/SecretActions.svelte';
import SecretDetailsInspect from '/@/lib/secrets/components/SecretDetailsInspect.svelte';
import SecretDetailsSummary from '/@/lib/secrets/components/SecretDetailsSummary.svelte';
import type { SecretInfoUI } from '/@/lib/secrets/SecretInfoUI';
import DetailsPage from '/@/lib/ui/DetailsPage.svelte';
import { getTabUrl, isTabSelected } from '/@/lib/ui/Util';
import { handleNavigation } from '/@/navigation';
import Route from '/@/Route.svelte';
import { secretsInfo } from '/@/stores/secrets';

interface Props {
  secretId: string;
  engineId: string;
}

let { secretId, engineId }: Props = $props();

let secret: SecretInfoUI | undefined = $derived(
  $secretsInfo.find(secret => secret.Id === secretId && secret.engineId === engineId),
);

function close(): void {
  handleNavigation({
    page: NavigationPage.SECRETS,
  });
}

$effect(() => {
  /* If the secret is removed we redirect to secrets page */
  if (!secret) {
    close();
  }
});
</script>

{#if secret}
  <DetailsPage title={secret.Name} subtitle={secret.Id}>
    {#snippet iconSnippet()}
      <StatusIcon icon={SecretIcon} size={24} status="RUNNING" />
    {/snippet}
    {#snippet actionsSnippet()}
      <SecretActions object={secret} detailed={true} />
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
    {/snippet}
    {#snippet contentSnippet()}
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <SecretDetailsSummary secret={secret} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <SecretDetailsInspect secret={secret} />
      </Route>
    {/snippet}
  </DetailsPage>
{/if}
