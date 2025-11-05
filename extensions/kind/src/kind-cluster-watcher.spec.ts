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

import { KubeConfig } from '@kubernetes/client-node';
import * as k8s from '@kubernetes/client-node';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { KindClusterWatcher } from './kind-cluster-watcher';

vi.mock('@kubernetes/client-node');

describe('KindClusterWatcher', () => {
  let mockKubeConfig: KubeConfig;
  let mockErrorHandler: (error: unknown, context: string) => void;
  let watcher: KindClusterWatcher;

  beforeEach(() => {
    vi.clearAllMocks();

    mockKubeConfig = new KubeConfig();
    mockErrorHandler = vi.fn();
    vi.mocked(k8s.makeInformer).mockReturnValue({
      on: vi.fn(),
      start: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn().mockResolvedValue(undefined),
      list: vi.fn().mockReturnValue([]),
      get: vi.fn(),
      off: vi.fn(),
    });

    vi.mocked(mockKubeConfig.makeApiClient).mockReturnValue({
      listNode: vi.fn().mockResolvedValue({ items: [] }),
      listNamespacedPod: vi.fn().mockResolvedValue({ items: [] }),
    });

    watcher = new KindClusterWatcher(mockKubeConfig, mockErrorHandler);
  });

  test('should create API client when waiting for nodes', async () => {
    watcher.waitForNodesReady().catch(() => {});
    expect(mockKubeConfig.makeApiClient).toHaveBeenCalled();
  });

  test('should call makeInformer when waiting for nodes', () => {
    watcher.waitForNodesReady().catch(() => {});
    expect(k8s.makeInformer).toHaveBeenCalledWith(mockKubeConfig, '/api/v1/nodes', expect.any(Function));
  });

  test('should call makeInformer when waiting for pods', () => {
    watcher.waitForSystemPodsReady('k8s-app=kube-dns').catch(() => {});

    expect(k8s.makeInformer).toHaveBeenCalledWith(
      mockKubeConfig,
      expect.stringContaining('kube-system/pods'),
      expect.any(Function),
    );
  });

  test('should timeout when resources are not ready within timeout period', async () => {
    vi.mocked(k8s.makeInformer).mockReturnValue({
      on: vi.fn(),
      start: vi.fn().mockRejectedValue(new Error('Timeout waiting for resources at /test/path')),
      stop: vi.fn().mockResolvedValue(undefined),
      list: vi.fn().mockReturnValue([]),
      get: vi.fn(),
      off: vi.fn(),
    });

    await expect(watcher.waitForNodesReady()).rejects.toThrow('Timeout waiting for resources');
  });

  test('should call error handler when informer emits error', async () => {
    const mockError = new Error('Connection failed');

    const mockInformer = {
      on: vi.fn((event, callback) => {
        if (event === 'error') {
          callback(mockError);
        }
      }),
      start: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn().mockResolvedValue(undefined),
      list: vi.fn().mockReturnValue([]),
      get: vi.fn(),
      off: vi.fn(),
    };

    vi.mocked(k8s.makeInformer).mockReturnValue(mockInformer);

    watcher.waitForNodesReady().catch(() => {});

    expect(mockErrorHandler).toHaveBeenCalledWith(mockError, expect.stringContaining('watching'));
  });

  test('should stop all informers when cleanup is called', async () => {
    watcher.waitForNodesReady().catch(() => {});
    watcher.waitForSystemPodsReady('k8s-app=kube-dns').catch(() => {});

    watcher.dispose();

    expect(k8s.makeInformer).toHaveBeenCalledTimes(2);
  });
});
