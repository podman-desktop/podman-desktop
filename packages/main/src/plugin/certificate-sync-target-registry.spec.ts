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

import type { CertificateSyncTarget, CertificateSyncTargetProvider, Disposable } from '@podman-desktop/api';
import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest';

import {
  type CertificateSyncExtensionInfo,
  CertificateSyncTargetRegistry,
} from './certificate-sync-target-registry.js';
import type { Certificates } from './certificates.js';

// Mock provider factory
function createMockProvider(targets: CertificateSyncTarget[] = []): CertificateSyncTargetProvider {
  let listener: (() => void) | undefined;
  return {
    getTargets: vi.fn().mockResolvedValue(targets),
    synchronize: vi.fn().mockResolvedValue(undefined),
    onDidChangeTargets: vi.fn().mockImplementation((callback: () => void) => {
      listener = callback;
      return { dispose: vi.fn() } as Disposable;
    }),
    // Helper to fire the event in tests
    _fireChangeEvent: (): void => listener?.(),
  } as CertificateSyncTargetProvider & { _fireChangeEvent: () => void };
}

// Mock certificates service
function createMockCertificates(certs: string[] = []): Certificates {
  return {
    getAllCertificates: vi.fn().mockReturnValue(certs),
  } as unknown as Certificates;
}

// Extension info factories
function createTrustedExtension(id = 'trusted-ext', name = 'Trusted Extension'): CertificateSyncExtensionInfo {
  return { id, name, removable: false };
}

function createUntrustedExtension(id = 'untrusted-ext', name = 'Untrusted Extension'): CertificateSyncExtensionInfo {
  return { id, name, removable: true };
}

describe('CertificateSyncTargetRegistry', () => {
  let registry: CertificateSyncTargetRegistry;
  let mockCertificates: Certificates;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCertificates = createMockCertificates(['cert1', 'cert2']);
    registry = new CertificateSyncTargetRegistry(mockCertificates);
  });

  describe('registerProvider', () => {
    test('should register a provider successfully', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension();

      const disposable = registry.registerProvider(extensionInfo, 'provider1', provider);

      expect(disposable).toBeDefined();
      expect(provider.getTargets).toHaveBeenCalled();
    });

    test('should throw error when registering duplicate provider', () => {
      const provider1 = createMockProvider();
      const provider2 = createMockProvider();
      const extensionInfo = createTrustedExtension();

      registry.registerProvider(extensionInfo, 'provider1', provider1);

      expect(() => registry.registerProvider(extensionInfo, 'provider1', provider2)).toThrow(
        `Certificate sync target provider 'provider1' is already registered by trusted-ext`,
      );
    });

    test('should allow same providerId from different extensions', () => {
      const provider1 = createMockProvider();
      const provider2 = createMockProvider();
      const ext1 = createTrustedExtension('ext1', 'Extension 1');
      const ext2 = createTrustedExtension('ext2', 'Extension 2');

      expect(() => {
        registry.registerProvider(ext1, 'provider', provider1);
        registry.registerProvider(ext2, 'provider', provider2);
      }).not.toThrow();
    });

    test('should subscribe to provider onDidChangeTargets', () => {
      const provider = createMockProvider();
      const extensionInfo = createTrustedExtension();

      registry.registerProvider(extensionInfo, 'provider1', provider);

      expect(provider.onDidChangeTargets).toHaveBeenCalled();
    });

    test('should fetch targets on registration', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension();

      registry.registerProvider(extensionInfo, 'provider1', provider);

      // Wait for async operations
      await vi.waitFor(() => {
        expect(provider.getTargets).toHaveBeenCalled();
      });
    });

    test('should fire onDidChangeTargets event after initial fetch', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension();
      const eventHandler = vi.fn();

      registry.onDidChangeTargets(eventHandler);
      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(eventHandler).toHaveBeenCalledWith({
          provider: { id: 'provider1', label: 'Trusted Extension' },
        });
      });
    });
  });

  describe('trust model', () => {
    test('should include targets from trusted extensions (removable === false)', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension();

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        const targets = registry.getTargets();
        expect(targets).toHaveLength(1);
        expect(targets[0]?.name).toBe('Target 1');
      });
    });

    test('should exclude targets from untrusted extensions (removable === true)', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createUntrustedExtension();

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(provider.getTargets).not.toHaveBeenCalled();
      });

      const targets = registry.getTargets();
      expect(targets).toHaveLength(0);
    });
  });

  describe('getTargets', () => {
    test('should return empty array when no providers registered', () => {
      const targets = registry.getTargets();
      expect(targets).toEqual([]);
    });

    test('should return targets with composite ID as id', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension('my-ext');

      registry.registerProvider(extensionInfo, 'my-provider', provider);

      await vi.waitFor(() => {
        const targets = registry.getTargets();
        expect(targets).toHaveLength(1);
        expect(targets[0]?.id).toBe('my-ext:my-provider:target1');
      });
    });

    test('should include extension info in targets', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension('ext-id', 'Extension Name');

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        const targets = registry.getTargets();
        expect(targets[0]).toMatchObject({
          providerId: 'provider1',
          extensionId: 'ext-id',
          extensionName: 'Extension Name',
        });
      });
    });

    test('should aggregate targets from multiple providers', async () => {
      const provider1 = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const provider2 = createMockProvider([{ id: 'target2', name: 'Target 2' }]);
      const ext1 = createTrustedExtension('ext1');
      const ext2 = createTrustedExtension('ext2');

      registry.registerProvider(ext1, 'provider1', provider1);
      registry.registerProvider(ext2, 'provider2', provider2);

      await vi.waitFor(() => {
        const targets = registry.getTargets();
        expect(targets).toHaveLength(2);
      });
    });
  });

  describe('synchronize', () => {
    test('should synchronize to target successfully', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension('ext1');

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(1);
      });

      await registry.synchronize('ext1:provider1:target1');

      expect(provider.synchronize).toHaveBeenCalledWith('target1', ['cert1', 'cert2']);
    });

    test('should throw error for non-existent target', async () => {
      await expect(registry.synchronize('non-existent')).rejects.toThrow(`Target 'non-existent' not found`);
    });

    test('should pass certificates from Certificates service', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension('ext1');

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(1);
      });

      await registry.synchronize('ext1:provider1:target1');

      expect(mockCertificates.getAllCertificates).toHaveBeenCalled();
      expect(provider.synchronize).toHaveBeenCalledWith('target1', ['cert1', 'cert2']);
    });

    test('should use original targetId when calling provider', async () => {
      const provider = createMockProvider([{ id: 'my-original-id', name: 'Target' }]);
      const extensionInfo = createTrustedExtension('ext1');

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(1);
      });

      await registry.synchronize('ext1:provider1:my-original-id');

      // Should call with original ID, not composite ID
      expect(provider.synchronize).toHaveBeenCalledWith('my-original-id', expect.any(Array));
    });
  });

  describe('synchronizeToTargets', () => {
    test('should sync to multiple targets in parallel', async () => {
      const provider = createMockProvider([
        { id: 'target1', name: 'Target 1' },
        { id: 'target2', name: 'Target 2' },
      ]);
      const extensionInfo = createTrustedExtension('ext1');

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(2);
      });

      const result = await registry.synchronizeToTargets(['ext1:provider1:target1', 'ext1:provider1:target2']);

      expect(result.errors).toHaveLength(0);
      expect(provider.synchronize).toHaveBeenCalledTimes(2);
    });

    test('should return empty errors array on success', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension('ext1');

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(1);
      });

      const result = await registry.synchronizeToTargets(['ext1:provider1:target1']);

      expect(result.errors).toEqual([]);
    });

    test('should collect errors from failed targets', async () => {
      const provider = createMockProvider([
        { id: 'target1', name: 'Target 1' },
        { id: 'target2', name: 'Target 2' },
      ]);
      (provider.synchronize as Mock).mockImplementation((targetId: string) => {
        if (targetId === 'target2') {
          return Promise.reject(new Error('Sync failed'));
        }
        return Promise.resolve();
      });
      const extensionInfo = createTrustedExtension('ext1');

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(2);
      });

      const result = await registry.synchronizeToTargets(['ext1:provider1:target1', 'ext1:provider1:target2']);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        targetId: 'ext1:provider1:target2',
        error: 'Sync failed',
      });
    });

    test('should continue syncing other targets when one fails', async () => {
      const provider = createMockProvider([
        { id: 'target1', name: 'Target 1' },
        { id: 'target2', name: 'Target 2' },
        { id: 'target3', name: 'Target 3' },
      ]);
      (provider.synchronize as Mock).mockImplementation((targetId: string) => {
        if (targetId === 'target2') {
          return Promise.reject(new Error('Sync failed'));
        }
        return Promise.resolve();
      });
      const extensionInfo = createTrustedExtension('ext1');

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(3);
      });

      await registry.synchronizeToTargets([
        'ext1:provider1:target1',
        'ext1:provider1:target2',
        'ext1:provider1:target3',
      ]);

      // All three should have been attempted
      expect(provider.synchronize).toHaveBeenCalledTimes(3);
    });
  });

  describe('dispose behavior', () => {
    test('should remove provider on dispose', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension('ext1');

      const disposable = registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(1);
      });

      disposable.dispose();

      const targets = registry.getTargets();
      expect(targets).toHaveLength(0);
    });

    test('should clear cached targets on dispose', async () => {
      const provider = createMockProvider([
        { id: 'target1', name: 'Target 1' },
        { id: 'target2', name: 'Target 2' },
      ]);
      const extensionInfo = createTrustedExtension('ext1');

      const disposable = registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(2);
      });

      disposable.dispose();

      expect(registry.getTargets()).toHaveLength(0);
    });

    test('should fire onDidChangeTargets on dispose', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]);
      const extensionInfo = createTrustedExtension();
      const eventHandler = vi.fn();

      const disposable = registry.registerProvider(extensionInfo, 'provider1', provider);
      registry.onDidChangeTargets(eventHandler);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(1);
      });

      eventHandler.mockClear();
      disposable.dispose();

      expect(eventHandler).toHaveBeenCalledWith({
        provider: { id: 'provider1', label: 'Trusted Extension' },
      });
    });

    test('should unsubscribe from provider event on dispose', async () => {
      const disposeEventSub = vi.fn();
      const provider: CertificateSyncTargetProvider = {
        getTargets: vi.fn().mockResolvedValue([]),
        synchronize: vi.fn(),
        onDidChangeTargets: vi.fn().mockReturnValue({ dispose: disposeEventSub }),
      };
      const extensionInfo = createTrustedExtension();

      const disposable = registry.registerProvider(extensionInfo, 'provider1', provider);
      disposable.dispose();

      expect(disposeEventSub).toHaveBeenCalled();
    });
  });

  describe('provider onDidChangeTargets refresh', () => {
    test('should refresh targets when provider fires onDidChangeTargets', async () => {
      const provider = createMockProvider([{ id: 'target1', name: 'Target 1' }]) as CertificateSyncTargetProvider & {
        _fireChangeEvent: () => void;
      };
      const extensionInfo = createTrustedExtension('ext1');

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(1);
      });

      // Update mock to return new targets
      (provider.getTargets as Mock).mockResolvedValue([
        { id: 'target1', name: 'Target 1' },
        { id: 'target2', name: 'Target 2' },
      ]);

      // Fire the change event
      provider._fireChangeEvent();

      await vi.waitFor(() => {
        expect(registry.getTargets()).toHaveLength(2);
      });
    });
  });

  describe('error handling', () => {
    test('should handle provider.getTargets() error gracefully', async () => {
      const provider = createMockProvider();
      (provider.getTargets as Mock).mockRejectedValue(new Error('Failed to get targets'));
      const extensionInfo = createTrustedExtension();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      // Should not crash and should return empty targets
      const targets = registry.getTargets();
      expect(targets).toHaveLength(0);

      consoleSpy.mockRestore();
    });
  });

  describe('composite key handling', () => {
    test('should build correct composite key format', async () => {
      const provider = createMockProvider([{ id: 'my-target', name: 'Target' }]);
      const extensionInfo = createTrustedExtension('my-extension');

      registry.registerProvider(extensionInfo, 'my-provider', provider);

      await vi.waitFor(() => {
        const targets = registry.getTargets();
        expect(targets[0]?.id).toBe('my-extension:my-provider:my-target');
      });
    });

    test('should handle targets with colons in their IDs', async () => {
      const provider = createMockProvider([{ id: 'target:with:colons', name: 'Target' }]);
      const extensionInfo = createTrustedExtension('ext1');

      registry.registerProvider(extensionInfo, 'provider1', provider);

      await vi.waitFor(() => {
        const targets = registry.getTargets();
        expect(targets[0]?.id).toBe('ext1:provider1:target:with:colons');
      });

      // Should still be able to sync
      await registry.synchronize('ext1:provider1:target:with:colons');
      expect(provider.synchronize).toHaveBeenCalledWith('target:with:colons', expect.any(Array));
    });
  });
});
