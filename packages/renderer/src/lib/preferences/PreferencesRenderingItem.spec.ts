/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { fireEvent, render } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import PreferencesRenderingItem from '/@/lib/preferences/PreferencesRenderingItem.svelte';
import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models';

const EXPERIMENTAL_RECORD: IConfigurationPropertyRecordedSchema = {
  id: 'hello.world.fooBar',
  title: 'Hello',
  parentId: 'parent.record',
  description: 'record-description',
  type: 'integer',
  minimum: 1,
  maximum: 15,
  experimental: {
    githubDiscussionLink: 'https://github.com/podman-desktop',
  },
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.openExternal).mockResolvedValue(undefined);
});

test('experimental record should have clickable GitHub link', async () => {
  const { getByRole } = render(PreferencesRenderingItem, {
    record: EXPERIMENTAL_RECORD,
  });

  const link: HTMLElement = await vi.waitFor(() => {
    const element = getByRole('button', { name: 'Share feedback' });
    expect(element).toBeInTheDocument();
    return element;
  });

  await fireEvent.click(link);

  await vi.waitFor(() => {
    expect(window.openExternal).toHaveBeenCalledWith(EXPERIMENTAL_RECORD.experimental?.githubDiscussionLink);
  });
});

test('experimental record should have flask icon', async () => {
  const { queryAllByRole } = render(PreferencesRenderingItem, {
    record: EXPERIMENTAL_RECORD,
  });

  await vi.waitFor(() => {
    const elements = queryAllByRole('img', { hidden: true });
    expect(elements.length).toBeGreaterThan(0);
    expect(elements.find(element => element.textContent === 'experimental')).toBeDefined();
  });
});

test('record should have short title by default', async () => {
  const { getByText } = render(PreferencesRenderingItem, {
    record: EXPERIMENTAL_RECORD,
  });

  await vi.waitFor(() => {
    const element = getByText('Foo Bar');
    expect(element).toBeDefined();
    expect(element).toHaveClass('font-semibold');
  });
});

test('props title full should use full record id', async () => {
  const { getByText } = render(PreferencesRenderingItem, {
    record: EXPERIMENTAL_RECORD,
    title: 'full',
  });

  await vi.waitFor(() => {
    const element = getByText('Hello world foo Bar');
    expect(element).toBeDefined();
    expect(element).toHaveClass('font-semibold');
  });
});
