<script lang="ts">
import { NavigationPage } from '@desktop-framework/api';
import { faKey, faSignIn, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';
import { handleNavigation } from '/@/navigation';
import { authenticationProviders } from '/@/stores/authenticationProviders';

interface Props {
  onBeforeToggle?: () => void;
  outsideWindow: HTMLDivElement;
}

let { onBeforeToggle = (): void => {}, outsideWindow }: Props = $props();

let showMenu = $state(false);
let clientY = $state(0);
let clientX = $state(0);

function toggleMenu(): void {
  onBeforeToggle();
  showMenu = !showMenu;
}

function handleEscape({ key }: KeyboardEvent): void {
  if (key === 'Escape') {
    showMenu = false;
  }
}

function onWindowClick(e: Event): void {
  showMenu = e.target instanceof Node && outsideWindow.contains(e.target);
}

export function onButtonClick(e: MouseEvent): void {
  // keep track of the cursor position
  clientY = e.clientY;
  clientX = e.clientX;
  toggleMenu();
}
</script>

<svelte:window onkeyup={handleEscape} onclick={onWindowClick} />

{#if showMenu}
  <DropdownMenu.Items clientY={clientY} clientX={clientX}>
    <DropdownMenu.Item
      title={t('management.auth.manage') ?? 'Manage authentication'}
      icon={faKey}
      onClick={(): void => handleNavigation({ page: NavigationPage.AUTHENTICATION })} />

    {#each $authenticationProviders as provider (provider.id)}
      {@const sessionRequests = provider.sessionRequests ?? []}
      {#if provider?.accounts?.length > 0}
        {#each provider.accounts as account (account.id)}
          <DropdownMenu.Item
            title={t('management.auth.signOut', { provider: provider.displayName, account: account.label }) ?? `Sign out of ${provider.displayName} (${account.label})`}
            onClick={(): Promise<void> => window.requestAuthenticationProviderSignOut(provider.id, account.id)}
            icon={faSignOut} />
        {/each}
      {/if}

      {#each sessionRequests as request (request.id)}
        <DropdownMenu.Item
          title={t('management.auth.signIn', { provider: provider.displayName, extension: request.extensionLabel }) ?? `Sign in with ${provider.displayName} to use ${request.extensionLabel}`}
          onClick={(): Promise<void> => window.requestAuthenticationProviderSignIn(request.id)}
          icon={faSignIn} />
      {/each}
    {/each}
  </DropdownMenu.Items>
{/if}
