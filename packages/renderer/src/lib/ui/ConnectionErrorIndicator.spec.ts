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
import { expect, test } from 'vitest';

import ConnectionErrorIndicator from './ConnectionErrorIndicator.svelte';

test('should render nothing when error is undefined', () => {
  render(ConnectionErrorIndicator, { error: undefined });

  const button = screen.queryByRole('button');
  expect(button).not.toBeInTheDocument();
});

test('should render error icon with tooltip when error is defined', () => {
  const errorMessage = 'Connection refused';
  render(ConnectionErrorIndicator, { error: errorMessage });

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
});

test('should render nothing when error is empty string', () => {
  render(ConnectionErrorIndicator, { error: '' });

  const button = screen.queryByRole('button');
  expect(button).not.toBeInTheDocument();
});
