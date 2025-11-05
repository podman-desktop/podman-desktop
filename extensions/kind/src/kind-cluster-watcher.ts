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

import type { KubeConfig, KubernetesObject, ListPromise, V1Node, V1Pod } from '@kubernetes/client-node';
import { CoreV1Api, makeInformer } from '@kubernetes/client-node';
import type { Disposable } from '@podman-desktop/api';

/**
 * Utility class to manage informer lifecycle for Kind cluster readiness checks
 */
export class KindClusterWatcher implements Disposable {
  private informers: Map<string, { stop?: () => void }> = new Map();
  private kubeConfig: KubeConfig;
  private errorHandler?: (error: unknown, context: string) => void;

  constructor(kubeConfig: KubeConfig, errorHandler?: (error: unknown, context: string) => void) {
    this.kubeConfig = kubeConfig;
    this.errorHandler = errorHandler;
  }

  /**
   * Wait for Kubernetes resources using Watch API
   */
  private async waitForResources<T extends KubernetesObject>(
    path: string,
    listFn: ListPromise<T>,
    isReady: (items: T[]) => boolean,
    onError?: (error: unknown, context: string) => void,
    labelSelector?: string,
    timeoutMs = 30000,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const informer = makeInformer(this.kubeConfig, path, listFn);
      let isCompleted = false;
      // Set timeout
      const timeoutHandle = setTimeout(() => {
        complete(false, new Error(`Timeout waiting for resources at ${path}`));
      }, timeoutMs);
      const complete = (success: boolean, error?: unknown): void => {
        if (isCompleted) return;
        isCompleted = true;
        clearTimeout(timeoutHandle);

        this.informers.delete(path);
        // Stop the informer asynchronously without waiting
        informer.stop().catch((err: unknown) => {
          console.debug(`Error stopping informer for ${path}: ${err}`);
        });

        if (success) {
          resolve();
        } else {
          reject(error ?? new Error(`Timeout waiting for resources at ${path}`));
        }
      };

      const checkReadiness = (): void => {
        if (isCompleted) return;

        try {
          const items = informer.list() as T[];
          if (isReady(items)) {
            complete(true);
          }
        } catch (error) {
          console.debug(`Ignoring list() error during readiness check for ${path}: ${String(error)}`);
        }
      };

      // Event handlers
      informer.on('add', checkReadiness);
      informer.on('update', checkReadiness);
      informer.on('delete', checkReadiness);

      informer.on('error', (error: unknown) => {
        if (onError) {
          onError(error, `watching ${path}`);
        } else {
          console.warn(`Error while watching ${path}: ${String(error)}`);
        }
      });

      // Store informer reference for cleanup
      const uniqueKey = labelSelector ? `${path}?${labelSelector}` : path;
      this.informers.set(uniqueKey, {
        stop: () => {
          informer.stop().catch((err: unknown) => {
            console.debug(`Error stopping informer for ${path}: ${err}`);
          });
        },
      });

      // Start the informer
      informer.start().catch((error: unknown) => {
        complete(false, error);
      });
    });
  }
  /**
   * Check if all nodes are ready
   */
  private areNodesReady(nodes: V1Node[]): boolean {
    if (nodes.length === 0) return false;

    return nodes.every(node =>
      node.status?.conditions?.some(condition => condition.type === 'Ready' && condition.status === 'True'),
    );
  }

  /**
   * Check if all pods are ready
   */
  private arePodsReady(pods: V1Pod[]): boolean {
    if (pods.length === 0) return false;

    return pods.every(pod =>
      pod.status?.conditions?.some(condition => condition.type === 'Ready' && condition.status === 'True'),
    );
  }

  /**
   * Wait for nodes to be ready using Watch API
   */
  async waitForNodesReady(): Promise<void> {
    const k8sApi = this.kubeConfig.makeApiClient(CoreV1Api);
    const listFn = (): Promise<{ items: V1Node[] }> => k8sApi.listNode();
    const path = '/api/v1/nodes';

    await this.waitForResources(path, listFn, this.areNodesReady.bind(this), this.errorHandler);
  }

  /**
   * Wait for system pods to be ready using Watch API
   */
  async waitForSystemPodsReady(labelSelector: string): Promise<void> {
    const k8sApi = this.kubeConfig.makeApiClient(CoreV1Api);
    const listFn = (): Promise<{ items: V1Pod[] }> =>
      k8sApi.listNamespacedPod({
        namespace: 'kube-system',
        labelSelector: labelSelector,
      });
    const path = `/api/v1/namespaces/kube-system/pods?labelSelector=${encodeURIComponent(labelSelector)}`;

    await this.waitForResources(path, listFn, this.arePodsReady.bind(this), this.errorHandler, labelSelector);
  }

  /**
   * Cleanup all active informers
   */
  dispose(): void {
    // Create a copy of the current informers and clear the original map
    const informersToStop = new Map(this.informers);
    this.informers.clear();

    for (const [id, informerEntry] of informersToStop) {
      try {
        if (informerEntry.stop) {
          informerEntry.stop();
        }
      } catch (error) {
        console.warn(`Error stopping informer ${id}:`, error);
      }
    }
  }
}
