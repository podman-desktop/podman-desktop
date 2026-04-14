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

import { render, screen } from '@testing-library/svelte';
import { createRouteObject } from 'tinro/dist/tinro_lib';
import { beforeEach, expect, test, vi } from 'vitest';

import RouteSpec from '/@/RouteSpec.svelte';
import RouteWithRequestSpec from '/@/RouteWithRequestSpec.svelte';

vi.mock(import('tinro/dist/tinro_lib'));

beforeEach(() => {
  vi.resetAllMocks();
});

test('renders the route with request parser', async () => {
  vi.mocked(createRouteObject).mockImplementation(() => {
    return {
      update: vi.fn(),
    };
  });
  const myParser = (request: {
    query: Record<string, string>;
    params: Record<string, string>;
  }): { id: number; label: string } => {
    return {
      id: +request?.params?.id,
      label: request?.query?.label || '',
    };
  };
  render(RouteWithRequestSpec, {
    requestParser: myParser,
  });

  expect(createRouteObject).toHaveBeenCalled();
  const { onShow, onHide, onMeta } = createRouteObject.mock.calls[0][0];
  onMeta({
    query: { label: 'mylabel' },
    params: { id: '123' },
  });
  onShow();
  const expectedText = /{"id":123,"label":"mylabel"}/;
  await vi.waitFor(() => {
    screen.getByText(expectedText);
  });
  onHide();
  await vi.waitFor(() => {
    expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
  });
});

test('renders the route without request parser', async () => {
  vi.mocked(createRouteObject).mockImplementation(() => {
    return {
      update: vi.fn(),
    };
  });
  render(RouteSpec, {});

  expect(createRouteObject).toHaveBeenCalled();
  const { onShow, onHide, onMeta } = createRouteObject.mock.calls[0][0];
  onMeta({
    query: { label: 'mylabel' },
    params: { id: '123' },
  });
  onShow();
  const expectedText = /a content/;
  await vi.waitFor(() => {
    screen.getByText(expectedText);
  });
  onHide();
  await vi.waitFor(() => {
    expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
  });
});
