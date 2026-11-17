/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import { initTranslations } from '/@/lib/i18n/translations.svelte';
import { authenticationProviders } from '/@/stores/authenticationProviders';

import AuthActions from './AuthActions.svelte';

beforeEach(async () => {
  vi.resetAllMocks();
  Object.defineProperties(window, {
    i18nGetActiveTranslations: { value: vi.fn().mockResolvedValue({}), configurable: true },
    requestAuthenticationProviderSignIn: { value: vi.fn(), configurable: true },
    requestAuthenticationProviderSignOut: { value: vi.fn(), configurable: true },
  });
  await initTranslations();
  authenticationProviders.set([
    {
      id: 'provider-id',
      displayName: 'Provider {account}',
      accounts: [{ id: 'account-id', label: 'User' }],
      sessionRequests: [
        {
          id: 'request-id',
          providerId: 'provider-id',
          scopes: [],
          extensionId: 'extension-id',
          extensionLabel: 'Extension',
        },
      ],
    },
  ]);
});

test('preserves English labels when translations are unavailable', async () => {
  const { component } = render(AuthActions, { outsideWindow: document.createElement('div') });
  component.onButtonClick(new MouseEvent('click'));

  await screen.findByText('Manage authentication');
  screen.getByText('Sign out of Provider {account} (User)');
  screen.getByText('Sign in with Provider {account} to use Extension');
});

test('Japanese authentication actions preserve provider, account and request IDs', async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'management.auth.manage': '認証を管理',
    'management.auth.signOut': '{provider}（{account}）からサインアウト',
    'management.auth.signIn': '{extension} を使用するために {provider} でサインイン',
  });
  await initTranslations();
  const { component } = render(AuthActions, { outsideWindow: document.createElement('div') });
  component.onButtonClick(new MouseEvent('click'));

  await screen.findByText('認証を管理');
  await fireEvent.click(screen.getByText('Provider {account}（User）からサインアウト'));
  expect(window.requestAuthenticationProviderSignOut).toHaveBeenCalledWith('provider-id', 'account-id');

  component.onButtonClick(new MouseEvent('click'));
  await fireEvent.click(await screen.findByText('Extension を使用するために Provider {account} でサインイン'));
  expect(window.requestAuthenticationProviderSignIn).toHaveBeenCalledWith('request-id');
});
