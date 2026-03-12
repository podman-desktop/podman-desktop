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

import { assert, describe, expect, test } from 'vitest';
import { z } from 'zod';

import { ExtensionManifestSchema } from './extension-manifest-schema.js';

const minimalValidManifest = {
  name: 'my-extension',
  displayName: 'My Extension',
  version: '1.0.0',
  publisher: 'test-publisher',
  description: 'A test extension',
};

describe('ExtensionManifestSchema', () => {
  test('accepts a minimal valid manifest', () => {
    const result = ExtensionManifestSchema.safeParse(minimalValidManifest);
    expect(result.success).toBe(true);
  });

  test('accepts a manifest with optional main field', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      main: 'dist/extension.js',
    });
    expect(result.success).toBe(true);
    assert(result.data);
    expect(result.data.main).toBe('dist/extension.js');
  });

  test('accepts icon as a string', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      icon: 'icon.png',
    });
    expect(result.success).toBe(true);
    assert(result.data);
    expect(result.data.icon).toBe('icon.png');
  });

  test('accepts icon as a light/dark object', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      icon: { light: 'icon-light.png', dark: 'icon-dark.png' },
    });
    expect(result.success).toBe(true);
    assert(result.data);
    expect(result.data.icon).toEqual({ light: 'icon-light.png', dark: 'icon-dark.png' });
  });

  test('accepts engines with podman-desktop version', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      engines: { 'podman-desktop': '>=1.0.0' },
    });
    expect(result.success).toBe(true);
    assert(result.data);
    expect(result.data.engines?.['podman-desktop']).toBe('>=1.0.0');
  });

  test('accepts extensionDependencies and extensionPack', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      extensionDependencies: ['publisher.dep1', 'publisher.dep2'],
      extensionPack: ['publisher.pack1'],
    });
    expect(result.success).toBe(true);
    assert(result.data);
    expect(result.data.extensionDependencies).toEqual(['publisher.dep1', 'publisher.dep2']);
    expect(result.data.extensionPack).toEqual(['publisher.pack1']);
  });

  test('accepts contributes with features', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      contributes: {
        features: ['kubernetes-contexts-manager'],
      },
    });
    expect(result.success).toBe(true);
    assert(result.data);
    expect(result.data.contributes?.features).toEqual(['kubernetes-contexts-manager']);
  });

  test('accepts contributes with commands', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      contributes: {
        commands: [{ command: 'my.command', title: 'My Command' }],
      },
    });
    expect(result.success).toBe(true);
    assert(result.data);
    expect(result.data.contributes?.commands).toHaveLength(1);
  });

  test('accepts contributes with menus', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      contributes: {
        menus: {
          'dashboard/image': [{ command: 'my.command', title: 'Run' }],
        },
      },
    });
    expect(result.success).toBe(true);
  });

  test('allows unknown top-level fields due to .loose()', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      scripts: { build: 'tsc' },
      devDependencies: { typescript: '^5.0.0' },
    });
    expect(result.success).toBe(true);
  });

  test.each([
    'name',
    'displayName',
    'version',
    'publisher',
    'description',
  ] as const)('rejects manifest missing required %s field', field => {
    const incomplete = { ...minimalValidManifest };
    delete (incomplete as Record<string, unknown>)[field];
    const result = ExtensionManifestSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
    assert(result.error);
    expect(z.prettifyError(result.error)).toBe(`✖ Invalid input: expected string, received undefined\n  → at ${field}`);
  });

  test('rejects manifest with wrong type for name', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      name: 123,
    });
    expect(result.success).toBe(false);
    assert(result.error);
    expect(z.prettifyError(result.error)).toBe('✖ Invalid input: expected string, received number\n  → at name');
  });

  test('rejects manifest with invalid icon type', () => {
    const result = ExtensionManifestSchema.safeParse({
      ...minimalValidManifest,
      icon: 42,
    });
    expect(result.success).toBe(false);
    assert(result.error);
    expect(z.prettifyError(result.error)).toBe('✖ Invalid input\n  → at icon');
  });
});
