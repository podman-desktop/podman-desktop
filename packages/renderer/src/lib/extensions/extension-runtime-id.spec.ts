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

import type { WebviewInfo } from '@podman-desktop/core-api';
import { expect, test } from 'vitest';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import { resolveExtensionRuntimeId, toCatalogIdentities } from './extension-runtime-id';

const catalogIdentities = toCatalogIdentities([
  {
    id: 'redhat.ai-lab',
    displayName: 'Podman AI Lab',
    extensionName: 'ai-lab',
  },
]);

const aiLabInstalled: CombinedExtensionInfoUI = {
  id: 'redhat.ai-lab',
  name: 'ai-lab',
  displayName: 'AI Lab',
  description: '',
  publisher: 'redhat',
  version: '',
  state: 'started',
  removable: true,
  devMode: false,
  path: '/tmp/ai-lab',
  readme: '',
  type: 'pd',
};

const aiLabWebview: WebviewInfo = {
  id: 'webview-ai-lab',
  uuid: 'uuid-ai-lab',
  viewType: 'studio',
  sourcePath: '/tmp/ai-lab',
  icon: 'icon.png',
  name: 'AI Lab',
  html: '',
  extensionId: 'redhat.redhat-pack',
  state: undefined,
};

test('resolveExtensionRuntimeId returns direct id when runtime extension exists', () => {
  expect(
    resolveExtensionRuntimeId({ id: 'redhat.minikube', name: 'minikube', type: 'pd' }, [
      { id: 'redhat.minikube', name: 'minikube' },
    ]),
  ).toBe('redhat.minikube');
});

test('resolveExtensionRuntimeId maps catalog webview ids to their runtime extension id', () => {
  expect(
    resolveExtensionRuntimeId(
      aiLabInstalled,
      [{ id: 'redhat.redhat-pack', name: 'redhat-pack' }],
      [aiLabWebview],
      catalogIdentities,
    ),
  ).toBe('redhat.redhat-pack');
});

test('resolveExtensionRuntimeId matches runtime extensions by extension name', () => {
  expect(
    resolveExtensionRuntimeId({ id: 'publisher.ai-lab', name: 'ai-lab', type: 'pd' }, [
      { id: 'redhat.ai-lab', name: 'ai-lab' },
    ]),
  ).toBe('redhat.ai-lab');
});

test('resolveExtensionRuntimeId returns undefined when no runtime extension exists', () => {
  expect(resolveExtensionRuntimeId(aiLabInstalled, [], [aiLabWebview], catalogIdentities)).toBe('redhat.ai-lab');
});
