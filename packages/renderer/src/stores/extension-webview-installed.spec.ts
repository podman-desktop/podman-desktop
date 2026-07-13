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

import type { CombinedExtensionInfoUI } from './all-installed-extensions';
import {
  type CatalogExtensionIdentity,
  mergeWebviewInstalledExtensions,
  resolveInstalledExtensionIdFromWebview,
  synthesizeInstalledExtensionFromWebview,
} from './extension-webview-installed';

const catalogIdentities: CatalogExtensionIdentity[] = [
  {
    id: 'redhat.ai-lab',
    displayName: 'Podman AI Lab',
    extensionName: 'ai-lab',
  },
  {
    id: 'redhat.minikube',
    displayName: 'Minikube',
    extensionName: 'minikube',
  },
];

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

const minikubeWebview: WebviewInfo = {
  id: 'webview-minikube',
  uuid: 'uuid-minikube',
  viewType: 'kubernetes',
  sourcePath: '/tmp/minikube',
  icon: 'icon.png',
  name: 'Minikube',
  html: '',
  extensionId: 'redhat.minikube',
  state: undefined,
};

test('resolveInstalledExtensionIdFromWebview maps sidebar labels to catalog ids', () => {
  expect(resolveInstalledExtensionIdFromWebview(aiLabWebview, catalogIdentities)).toBe('redhat.ai-lab');
  expect(resolveInstalledExtensionIdFromWebview(minikubeWebview, catalogIdentities)).toBe('redhat.minikube');
});

test('mergeWebviewInstalledExtensions adds catalog-matched webviews missing from extensionInfos', () => {
  const merged = mergeWebviewInstalledExtensions([], [aiLabWebview], catalogIdentities);

  expect(merged).toHaveLength(1);
  expect(merged[0].id).toBe('redhat.ai-lab');
  expect(merged[0].displayName).toBe('AI Lab');
  expect(merged[0].state).toBe('started');
});

test('mergeWebviewInstalledExtensions does not duplicate extensions already in the store', () => {
  const existing: CombinedExtensionInfoUI = {
    id: 'redhat.ai-lab',
    name: 'ai-lab',
    displayName: 'Podman AI Lab',
    description: '',
    publisher: 'redhat',
    version: '1.9.3',
    state: 'started',
    removable: true,
    devMode: false,
    path: '/plugins/ai-lab',
    readme: '',
    type: 'pd',
  };

  const merged = mergeWebviewInstalledExtensions([existing], [aiLabWebview], catalogIdentities);

  expect(merged).toHaveLength(1);
  expect(merged[0].displayName).toBe('Podman AI Lab');
});

test('synthesizeInstalledExtensionFromWebview builds a pd extension row', () => {
  const extension = synthesizeInstalledExtensionFromWebview(aiLabWebview, 'redhat.ai-lab');

  expect(extension.id).toBe('redhat.ai-lab');
  expect(extension.name).toBe('ai-lab');
  expect(extension.publisher).toBe('redhat');
  expect(extension.type).toBe('pd');
});
