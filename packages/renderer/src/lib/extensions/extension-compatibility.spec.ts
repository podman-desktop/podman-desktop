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

import { beforeEach, expect, test } from 'vitest';

import {
  resolveExtensionCompatibilityIssues,
  setPrototypeCompatibilityWarningsEnabled,
} from './extension-compatibility';
import { USE_CASE_EXTENSION_IDS } from './extension-prototype-use-cases';

beforeEach(() => {
  setPrototypeCompatibilityWarningsEnabled(true);
});

test('reports incompatible Podman Desktop version on Podman Docker Context', () => {
  const issues = resolveExtensionCompatibilityIssues(
    {
      id: USE_CASE_EXTENSION_IDS.incompatibleVersion,
      displayName: 'Podman Docker Context',
      isInstalled: true,
    },
    [],
    '1.15.0',
  );

  expect(issues).toHaveLength(1);
  expect(issues[0]?.type).toBe('incompatible-version');
  expect(issues[0]?.fix).toBe('Upgrade Podman Desktop to v99.0.0 or later.');
});

test('reports missing dependency on Kind when minikube is not installed', () => {
  const issues = resolveExtensionCompatibilityIssues(
    {
      id: USE_CASE_EXTENSION_IDS.missingDependency,
      displayName: 'Kind',
      isInstalled: true,
    },
    [],
    '1.15.0',
  );

  expect(issues).toHaveLength(1);
  expect(issues[0]?.type).toBe('missing-dependency');
  expect(issues[0]?.detail).toContain('minikube');
  expect(issues[0]?.fix).toBe('Install the minikube extension from the catalog.');
});

test('prototype demo always reports missing dependency on Kind even when minikube is installed', () => {
  const issues = resolveExtensionCompatibilityIssues(
    {
      id: USE_CASE_EXTENSION_IDS.missingDependency,
      displayName: 'Kind',
      isInstalled: true,
    },
    [
      {
        id: 'podman-desktop.minikube',
        displayName: 'minikube',
        type: 'pd',
        state: 'started',
      } as never,
    ],
    '1.15.0',
  );

  expect(issues).toHaveLength(1);
  expect(issues[0]?.type).toBe('missing-dependency');
});

test('returns no issues for extensions without compatibility metadata', () => {
  const issues = resolveExtensionCompatibilityIssues(
    {
      id: USE_CASE_EXTENSION_IDS.builtIn,
      displayName: 'Compose',
      isInstalled: true,
    },
    [],
    '1.20.0',
  );

  expect(issues).toHaveLength(0);
});
