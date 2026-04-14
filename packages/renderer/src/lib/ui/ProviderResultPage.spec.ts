/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { createRawSnippet, type Snippet } from 'svelte';
import { describe, expect, test } from 'vitest';

import type { CheckUI, ProviderUI } from './ProviderResultPage';
import ProviderResultPage from './ProviderResultPage.svelte';

function findTargetRow(text: string): HTMLElement | undefined {
  const rows = screen.getAllByRole('row');
  // use the textContent to find the row
  const targetRow = rows.find(row => row.textContent?.replace(/\s+/g, ' ').trim() === text);
  return targetRow;
}

function checkResultDisplayed(result: CheckUI): void {
  const targetRow = findTargetRow(result.check.name + ' Reported by ' + result.provider.label);
  expect(targetRow).toBeDefined();
}

function checkResultNotDisplayed(result: CheckUI): void {
  const targetRow = findTargetRow(result.check.name + ' Reported by ' + result.provider.label);

  expect(targetRow).toBeUndefined();
}

describe('test ProviderResultPage', async () => {
  const providers: ProviderUI[] = [
    {
      info: {
        id: 'provider1',
        label: 'Provider 1',
      },
      state: 'running',
    },
    {
      info: {
        id: 'provider2',
        label: 'Provider 2',
      },
      state: 'running',
    },
  ];

  const results: CheckUI[] = [
    {
      provider: providers[0].info,
      check: {
        name: 'Check A1',
        status: 'failed',
        severity: 'critical',
      },
    },
    {
      provider: providers[0].info,
      check: {
        name: 'Check A2',
        status: 'failed',
        severity: 'high',
      },
    },
    {
      provider: providers[0].info,
      check: {
        name: 'Check A3',
        status: 'failed',
        severity: 'medium',
      },
    },
    {
      provider: providers[0].info,
      check: {
        name: 'Check A4',
        status: 'failed',
        severity: 'low',
      },
    },
    {
      provider: providers[0].info,
      check: {
        name: 'Check A5',
        status: 'success',
      },
    },
    {
      provider: providers[1].info,
      check: {
        name: 'Check B1',
        status: 'success',
      },
    },
    {
      provider: providers[1].info,
      check: {
        name: 'Check B2',
        status: 'failed',
        severity: 'critical',
      },
    },
  ];

  const HEADER_INFO_SNIPPET_TEXT = 'Header Info Snippet';

  const snippet: Snippet<[]> = createRawSnippet(() => {
    return {
      render: () => `
			<h1>${HEADER_INFO_SNIPPET_TEXT}</h1>
		`,
    };
  });

  test('all providers are displayed as running', async () => {
    const checkProviderRunning = (text: string): void => {
      const providerEntry = screen.getByRole('row', { name: text });
      expect(providerEntry).toBeInTheDocument();
      const cb = within(providerEntry).queryByRole('checkbox');
      expect(cb).not.toBeInTheDocument();
      const spinner = within(providerEntry).queryByRole('status', { name: 'Loading' });
      expect(spinner).toBeInTheDocument();
    };

    providers[0].state = 'running';
    providers[1].state = 'running';
    render(ProviderResultPage, {
      providers: JSON.parse(JSON.stringify(providers)),
      headerInfo: snippet,
    });

    checkProviderRunning('Provider 1');
    checkProviderRunning('Provider 2');

    // expect to see the snippet
    const snippetElement = screen.getByRole('heading', { name: HEADER_INFO_SNIPPET_TEXT });
    expect(snippetElement).toBeInTheDocument();
  });

  test('all providers are displayed as successful', () => {
    const checkProviderSuccess = (text: string): void => {
      const providerEntry = screen.getByRole('row', { name: text });
      expect(providerEntry).toBeInTheDocument();
      const cb = within(providerEntry).queryByRole('checkbox');
      expect(cb).toBeInTheDocument();
      const spinner = within(providerEntry).queryByRole('img');
      expect(spinner).not.toBeInTheDocument();
    };

    providers[0].state = 'success';
    providers[1].state = 'success';
    render(ProviderResultPage, {
      providers: JSON.parse(JSON.stringify(providers)),
      headerInfo: snippet,
    });

    checkProviderSuccess('Provider 1');
    checkProviderSuccess('Provider 2');

    // expect to see the snippet
    const snippetElement = screen.getByRole('heading', { name: HEADER_INFO_SNIPPET_TEXT });
    expect(snippetElement).toBeInTheDocument();
  });

  test('all results are displayed', () => {
    providers[0].state = 'success';
    providers[1].state = 'success';
    render(ProviderResultPage, {
      providers: JSON.parse(JSON.stringify(providers)),
      results: JSON.parse(JSON.stringify(results)),
      headerInfo: snippet,
    });
    results.forEach(result => checkResultDisplayed(result));
  });

  test('results from selected providers -2nd- only are displayed', async () => {
    providers[0].state = 'success';
    providers[1].state = 'success';
    render(ProviderResultPage, {
      providers: JSON.parse(JSON.stringify(providers)),
      results: JSON.parse(JSON.stringify(results)),
      headerInfo: snippet,
    });

    const providerEntry = screen.getByRole('row', { name: 'Provider 1' });
    const cb = within(providerEntry).getByRole('checkbox');
    await fireEvent.click(cb);
    results.filter(r => r.provider.id === 'provider1').forEach(result => checkResultNotDisplayed(result));
    results.filter(r => r.provider.id === 'provider2').forEach(result => checkResultDisplayed(result));

    // expect to see the snippet
    const snippetElement = screen.getByRole('heading', { name: HEADER_INFO_SNIPPET_TEXT });
    expect(snippetElement).toBeInTheDocument();
  });

  test('results from selected providers -1st- only are displayed', async () => {
    providers[0].state = 'success';
    providers[1].state = 'success';
    render(ProviderResultPage, {
      providers: JSON.parse(JSON.stringify(providers)),
      results: JSON.parse(JSON.stringify(results)),
      headerInfo: snippet,
    });

    const providerEntry = screen.getByRole('row', { name: 'Provider 2' });
    const cb = within(providerEntry).getByRole('checkbox');
    await fireEvent.click(cb);

    results.filter(r => r.provider.id === 'provider1').forEach(result => checkResultDisplayed(result));
    results.filter(r => r.provider.id === 'provider2').forEach(result => checkResultNotDisplayed(result));
  });

  test('results from selected severities only are displayed', async () => {
    providers[0].state = 'success';
    providers[1].state = 'success';
    render(ProviderResultPage, {
      providers: JSON.parse(JSON.stringify(providers)),
      results: JSON.parse(JSON.stringify(results)),
      headerInfo: snippet,
    });

    const criticalButton = screen.getByRole('button', { name: 'Critical (2)' });
    await fireEvent.click(criticalButton);
    results.filter(r => r.check.severity === 'critical').forEach(result => checkResultNotDisplayed(result));
    results.filter(r => r.check.severity !== 'critical').forEach(result => checkResultDisplayed(result));
  });
});
