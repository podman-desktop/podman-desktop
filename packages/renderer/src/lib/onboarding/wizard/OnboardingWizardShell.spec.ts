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

import { render, screen } from '@testing-library/svelte';
import { createRawSnippet, type Snippet } from 'svelte';
import { describe, expect, test } from 'vitest';

import OnboardingWizardShell from './OnboardingWizardShell.svelte';

function textSnippet(text: string, role: string): Snippet<[]> {
  return createRawSnippet(() => ({
    render: () => `<div role="${role}">${text}</div>`,
  }));
}

describe('OnboardingWizardShell', () => {
  test('renders default shell title', async () => {
    const { findByText, getByRole } = render(OnboardingWizardShell);

    expect(await findByText('Get started')).toBeInTheDocument();
    expect(getByRole('region', { name: 'Content' })).toBeInTheDocument();
  });

  test('renders all snippet areas when provided', async () => {
    render(OnboardingWizardShell, {
      leftSidebar: textSnippet('left content', 'region'),
      leftSidebarFooter: textSnippet('footer content', 'note'),
      rightContent: textSnippet('right content', 'main'),
      footer: textSnippet('actions', 'group'),
      sidebarTitle: 'Custom title',
    });

    expect(await screen.findByText('Custom title')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '' })).toHaveTextContent('left content');
    expect(screen.getByRole('note')).toHaveTextContent('footer content');
    expect(screen.getByRole('main')).toHaveTextContent('right content');
    expect(screen.getByRole('group')).toHaveTextContent('actions');
  });
});
