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

import { expect, test, vi } from 'vitest';

import { Welcome } from '/@/plugin/welcome.js';
import productJSONFile from '/@product.json' with { type: 'json' };

vi.mock(import('/@product.json'));

test('should return welcome messages with default product name', () => {
  const welcome = new Welcome();
  const messages = welcome.getWelcomeMessages();

  expect(messages.getStartedMessage).toBe('Get started with Podman Desktop');
  expect(messages.welcomeMessage).toBe('Welcome to Podman Desktop');
});

test('should return welcome messages with custom product name', () => {
  vi.mocked(productJSONFile).name = 'Custom Product';
  const welcome = new Welcome();
  const messages = welcome.getWelcomeMessages();

  expect(messages.getStartedMessage).toBe('Get started with Custom Product');
  expect(messages.welcomeMessage).toBe('Welcome to Custom Product');
});
