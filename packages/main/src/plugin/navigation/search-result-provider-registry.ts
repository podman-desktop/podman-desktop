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

import type { SearchResultProvider, SearchResultProviderMetadata } from '@podman-desktop/api';
import type { IDisposable, SearchResultItemInfo } from '@podman-desktop/core-api';
import { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import { inject, injectable } from 'inversify';

import { CancellationTokenSource } from '/@/plugin/cancellation-token.js';
import { Disposable } from '/@/plugin/types/disposable.js';

interface SearchResultProviderEntry {
  id: string;
  label: string;
  extensionIcon: string | { light: string; dark: string } | undefined;
  provider: SearchResultProvider;
}

@injectable()
export class SearchResultProviderRegistry {
  #providers = new Map<string, SearchResultProviderEntry>();
  #currentTokenSource: CancellationTokenSource | undefined;
  #nextId = 0;

  constructor(
    @inject(ApiSenderType)
    private apiSender: ApiSenderType,
  ) {}

  registerProvider(
    extensionId: string,
    extensionLabel: string,
    extensionIcon: string | { light: string; dark: string } | undefined,
    provider: SearchResultProvider,
    metadata?: SearchResultProviderMetadata,
  ): Disposable {
    const id = `${extensionId}-${this.#nextId++}`;
    const label = metadata?.label ?? extensionLabel;

    let changeDisposable: IDisposable | undefined;
    if (provider.onDidChangeItems) {
      changeDisposable = provider.onDidChangeItems(() => {
        this.apiSender.send('navigation-search-provider-items-changed');
      });
    }

    this.#providers.set(id, { id, label, extensionIcon, provider });

    return Disposable.create(() => {
      this.#providers.delete(id);
      changeDisposable?.dispose();
    });
  }

  async search(query: string, maxResults: number = 10): Promise<SearchResultItemInfo[]> {
    if (this.#currentTokenSource) {
      this.#currentTokenSource.cancel();
      this.#currentTokenSource.dispose();
    }
    this.#currentTokenSource = new CancellationTokenSource();
    const token = this.#currentTokenSource.token;

    const promises = Array.from(this.#providers.values()).map(async entry => {
      try {
        const items = await entry.provider.provideItems(query, { maxResults }, token);
        if (token.isCancellationRequested) return [];
        return (items ?? []).slice(0, maxResults).map(item => ({
          label: item.label,
          icon: item.icon ?? entry.extensionIcon,
          command: item.command,
          args: item.args,
          providerLabel: entry.label,
        }));
      } catch (err: unknown) {
        if (!token.isCancellationRequested) {
          console.error(`[search-result-provider] Error from provider ${entry.id}:`, err);
        }
        return [];
      }
    });

    const allResults = await Promise.all(promises);
    if (token.isCancellationRequested) {
      return [];
    }

    return allResults.flat();
  }
}
