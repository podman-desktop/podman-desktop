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

import type { Configuration } from '@podman-desktop/api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { ConfigurationRegistry, UserDefaultRegistry, UserDefaultRegistryMirror } from './default-registry-loader';
import { DefaultRegistryLoader } from './default-registry-loader';
import type { RegistryConfigurationEntry } from './registry-configuration';

const originalConsoleWarn = console.warn;
const getMock = vi.fn();
let defaultRegistryLoader: DefaultRegistryLoader;
let mockConfigurationRegistry: ConfigurationRegistry;

beforeEach(() => {
  // Double check that we reset ALL mocks before each test so we do not have any leakage between tests.
  vi.resetAllMocks();

  // Mock console.warn globally
  console.warn = vi.fn();

  // Default to returning an empty array
  getMock.mockReturnValue([]);

  mockConfigurationRegistry = {
    getConfiguration: vi.fn().mockReturnValue({
      get: getMock,
    } as unknown as Configuration),
  };

  defaultRegistryLoader = new DefaultRegistryLoader(mockConfigurationRegistry);
});

afterEach(() => {
  console.warn = originalConsoleWarn;
});

describe('loadFromConfiguration', () => {
  test('easy test that returns an empty array when no registries configured, to confirm it just loads', () => {
    const result = defaultRegistryLoader.loadFromConfiguration();
    expect(result).toEqual([]);
  });

  test('loads registries from configuration', () => {
    // Test registries!
    const userRegistry1: UserDefaultRegistry = {
      registry: {
        prefix: 'registry1',
        location: '/registry1/foo',
        blocked: true,
      },
    };
    const userRegistry2: UserDefaultRegistry = {
      registry: {
        prefix: 'registry2',
        location: '/registry2/foo',
      },
    };

    getMock.mockReturnValue([userRegistry1, userRegistry2]);

    // Make sure that both registries end up existing in the result
    const result = defaultRegistryLoader.loadFromConfiguration();
    expect(result).toEqual([
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        blocked: true,
      },
      {
        prefix: 'registry2',
        location: '/registry2/foo',
      },
    ]);
  });

  test('loads registries with mirrors from configuration', () => {
    // Test registries with mirrors
    // configured immediately after
    const userRegistry1: UserDefaultRegistry = {
      registry: {
        prefix: 'registry1',
        location: '/registry1/foo',
        blocked: true,
      },
    };
    const userRegistryMirror1: UserDefaultRegistryMirror = {
      'registry.mirror': {
        location: 'mirror1/foo',
      },
    };
    const userRegistry2: UserDefaultRegistry = {
      registry: {
        prefix: 'registry2',
        location: '/registry2/foo',
      },
    };
    const userRegistryMirror2: UserDefaultRegistryMirror = {
      'registry.mirror': {
        location: 'mirror2/bar',
        insecure: true,
      },
    };

    getMock.mockReturnValue([userRegistry1, userRegistryMirror1, userRegistry2, userRegistryMirror2]);

    // Make sure that both registries and their mirrors end up existing in the result
    const result = defaultRegistryLoader.loadFromConfiguration();
    expect(result).toEqual([
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        blocked: true,
        mirror: [
          {
            location: 'mirror1/foo',
          },
        ],
      },
      {
        prefix: 'registry2',
        location: '/registry2/foo',
        mirror: [
          {
            location: 'mirror2/bar',
            insecure: true,
          },
        ],
      },
    ]);
  });

  test('ignores mirror if no registry precedes it', () => {
    const userRegistryMirror: UserDefaultRegistryMirror = {
      'registry.mirror': {
        location: 'mirror1/foo',
      },
    };

    getMock.mockReturnValue([userRegistryMirror]);

    // Ignore any mirrors that don't have the registry before them...
    // this should equal blank (since registry.mirror without a preceding registry is ignored)
    const result = defaultRegistryLoader.loadFromConfiguration();
    expect(result).toEqual([]);
  });
});

describe('resolveConflicts', () => {
  test('adds new registries to existing list', () => {
    const defaultRegistries: RegistryConfigurationEntry[] = [
      {
        prefix: 'registry2',
        location: '/registry2/foo',
      },
    ];
    const existingRegistries: RegistryConfigurationEntry[] = [
      {
        prefix: 'registry1',
        location: '/registry1/foo',
      },
    ];

    // Should result in the same as just appending the new registry
    const result = defaultRegistryLoader.resolveConflicts(defaultRegistries, existingRegistries);
    expect(result).toEqual([
      {
        prefix: 'registry1',
        location: '/registry1/foo',
      },
      {
        prefix: 'registry2',
        location: '/registry2/foo',
      },
    ]);
  });

  test('merges mirrors when registry exists and properties match', () => {
    const defaultRegistries: RegistryConfigurationEntry[] = [
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        blocked: true,
        mirror: [
          {
            location: 'mirror1/bar',
          },
        ],
      },
    ];

    const existingRegistries: RegistryConfigurationEntry[] = [
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        blocked: true,
        mirror: [
          {
            location: 'mirror1/foo',
          },
        ],
      },
    ];

    // Make sure that the mirror is merged correctly / added to the existing registry
    const result = defaultRegistryLoader.resolveConflicts(defaultRegistries, existingRegistries);
    expect(result).toEqual([
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        blocked: true,
        mirror: [
          {
            location: 'mirror1/foo',
          },
          {
            location: 'mirror1/bar',
          },
        ],
      },
    ]);
  });

  test('does not duplicate existing mirrors', () => {
    const defaultRegistries: RegistryConfigurationEntry[] = [
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        mirror: [
          {
            location: 'mirror1/foo',
          },
        ],
      },
    ];

    const existingRegistries: RegistryConfigurationEntry[] = [
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        mirror: [
          {
            location: 'mirror1/foo',
          },
        ],
      },
    ];

    // Check that the mirror isn't duplicated when loaded
    const result = defaultRegistryLoader.resolveConflicts(defaultRegistries, existingRegistries);
    expect(result).toEqual([
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        mirror: [
          {
            location: 'mirror1/foo',
          },
        ],
      },
    ]);
  });

  test('warns and does not merge when properties differ', () => {
    const defaultRegistries: RegistryConfigurationEntry[] = [
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        blocked: false,
        insecure: true,
      },
    ];

    const existingRegistries: RegistryConfigurationEntry[] = [
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        blocked: true,
        insecure: false,
      },
    ];

    const result = defaultRegistryLoader.resolveConflicts(defaultRegistries, existingRegistries);

    // We want to check that we get the correct warning about differing properties
    expect(console.warn).toHaveBeenCalledWith(
      'Default user registry registry1 already exists in registries.conf, but properties differ: blocked, insecure. User settings take precedence.',
    );

    // Existing registry remains unchanged
    expect(result).toEqual([
      {
        prefix: 'registry1',
        location: '/registry1/foo',
        blocked: true,
        insecure: false,
      },
    ]);
  });
});
