/**********************************************************************
 * Copyright (C) 2024 - 2025 Red Hat, Inc.
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

import type { KubeConfig, KubernetesObject, ObjectCache } from '@kubernetes/client-node';

import type { ContextPermission } from '/@api/kubernetes-contexts-permissions.js';
import type { ContextGeneralState, ResourceName } from '/@api/kubernetes-contexts-states.js';
import type { ResourceCount } from '/@api/kubernetes-resource-count.js';
import type { KubernetesContextResources } from '/@api/kubernetes-resources.js';

import type { Event } from '../events/emitter.js';
import { Emitter } from '../events/emitter.js';
import { ConfigmapsResourceFactory } from './configmaps-resource-factory.js';
import type { ContextHealthState } from './context-health-checker.js';
import { ContextHealthChecker } from './context-health-checker.js';
import type { ContextPermissionResult } from './context-permissions-checker.js';
import { ContextPermissionsChecker } from './context-permissions-checker.js';
import { ContextResourceRegistry } from './context-resource-registry.js';
import type { DispatcherEvent } from './contexts-dispatcher.js';
import { ContextsDispatcher } from './contexts-dispatcher.js';
import { DeploymentsResourceFactory } from './deployments-resource-factory.js';
import { NodesResourceFactory } from './nodes-resource-factory.js';
import { IngressesResourceFactory } from './ingresses-resource-factory.js';
import { PodsResourceFactory } from './pods-resource-factory.js';
import { PVCsResourceFactory } from './pvcs-resource-factory.js';
import type { ResourceFactory } from './resource-factory.js';
import { ResourceFactoryHandler } from './resource-factory-handler.js';
import type { CacheUpdatedEvent, OfflineEvent, ResourceInformer } from './resource-informer.js';
import { RoutesResourceFactory } from './routes-resource-factory.js';
import { SecretsResourceFactory } from './secrets-resource-factory.js';
import { ServicesResourceFactory } from './services-resource-factory.js';

const HEALTH_CHECK_TIMEOUT_MS = 5_000;

/**
 * ContextsManagerExperimental receives new KubeConfig updates
 * and manages health checkers for each context of the KubeConfig.
 *
 * ContextsManagerExperimental fire events when a context is deleted, and to forward the states of the health checkers.
 *
 * ContextsManagerExperimental exposes the current state of the health checkers.
 */
export class ContextsManagerExperimental {
  #resourceFactoryHandler: ResourceFactoryHandler;
  #dispatcher: ContextsDispatcher;
  #healthCheckers: Map<string, ContextHealthChecker>;
  #permissionsCheckers: ContextPermissionsChecker[];
  #informers: ContextResourceRegistry<ResourceInformer<KubernetesObject>>;
  #objectCaches: ContextResourceRegistry<ObjectCache<KubernetesObject>>;

  #onContextHealthStateChange = new Emitter<ContextHealthState>();
  onContextHealthStateChange: Event<ContextHealthState> = this.#onContextHealthStateChange.event;

  #onContextPermissionResult = new Emitter<ContextPermissionResult>();
  onContextPermissionResult: Event<ContextPermissionResult> = this.#onContextPermissionResult.event;

  #onContextDelete = new Emitter<DispatcherEvent>();
  onContextDelete: Event<DispatcherEvent> = this.#onContextDelete.event;

  #onResourceUpdated = new Emitter<{ contextName: string; resourceName: string }>();
  onResourceUpdated: Event<{ contextName: string; resourceName: string }> = this.#onResourceUpdated.event;

  #onResourceCountUpdated = new Emitter<{ contextName: string; resourceName: string }>();
  onResourceCountUpdated: Event<{ contextName: string; resourceName: string }> = this.#onResourceCountUpdated.event;

  constructor() {
    this.#resourceFactoryHandler = new ResourceFactoryHandler();
    for (const resourceFactory of this.getResourceFactories()) {
      this.#resourceFactoryHandler.add(resourceFactory);
    }
    // Add more resources here
    this.#healthCheckers = new Map<string, ContextHealthChecker>();
    this.#permissionsCheckers = [];
    this.#informers = new ContextResourceRegistry<ResourceInformer<KubernetesObject>>();
    this.#objectCaches = new ContextResourceRegistry<ObjectCache<KubernetesObject>>();
    this.#dispatcher = new ContextsDispatcher();
    this.#dispatcher.onAdd(this.onAdd.bind(this));
    this.#dispatcher.onUpdate(this.onUpdate.bind(this));
    this.#dispatcher.onDelete(this.onDelete.bind(this));
    this.#dispatcher.onDelete((state: DispatcherEvent) => this.#onContextDelete.fire(state));
  }

  protected getResourceFactories(): ResourceFactory[] {
    return [
      new PodsResourceFactory(),
      new DeploymentsResourceFactory(),
      new ConfigmapsResourceFactory(),
      new SecretsResourceFactory(),
      new ServicesResourceFactory(),
      new PVCsResourceFactory(),
      new NodesResourceFactory(),
      new IngressesResourceFactory(),
      new RoutesResourceFactory(),
    ];
  }

  async update(kubeconfig: KubeConfig): Promise<void> {
    this.#dispatcher.update(kubeconfig);
  }

  private async onAdd(event: DispatcherEvent): Promise<void> {
    // register and start health checker
    const previousHealthChecker = this.#healthCheckers.get(event.contextName);
    previousHealthChecker?.dispose();
    const newHealthChecker = new ContextHealthChecker(event.config);
    this.#healthCheckers.set(event.contextName, newHealthChecker);
    newHealthChecker.onStateChange(this.onStateChange.bind(this));

    newHealthChecker.onReachable(async (state: ContextHealthState) => {
      // register and start permissions checker
      const previousPermissionsCheckers = this.#permissionsCheckers.filter(
        permissionChecker => permissionChecker.contextName === state.contextName,
      );
      for (const checker of previousPermissionsCheckers) {
        checker.dispose();
      }

      const namespace = state.kubeConfig.getNamespace();
      const permissionRequests = this.#resourceFactoryHandler.getPermissionsRequests(namespace);
      for (const permissionRequest of permissionRequests) {
        const newPermissionChecker = new ContextPermissionsChecker(
          state.kubeConfig,
          state.contextName,
          permissionRequest,
        );
        this.#permissionsCheckers.push(newPermissionChecker);
        newPermissionChecker.onPermissionResult(this.onPermissionResult.bind(this));

        newPermissionChecker.onPermissionResult((event: ContextPermissionResult) => {
          if (!event.permitted) {
            // if the user does not have watch permission, do not try to start informers on these resources
            return;
          }
          for (const resource of event.resources) {
            const contextName = event.kubeConfig.getKubeConfig().currentContext;
            const factory = this.#resourceFactoryHandler.getResourceFactoryByResourceName(resource);
            if (!factory) {
              throw new Error(
                `a permission for resource ${resource} has been received but no factory is handling it, this should not happen`,
              );
            }
            if (!factory.informer) {
              // no informer for this factory, skipping
              // (we may want to check permissions on some resource, without having to start an informer)
              continue;
            }
            const informer = factory.informer.createInformer(event.kubeConfig);
            this.#informers.set(contextName, resource, informer);
            informer.onCacheUpdated((e: CacheUpdatedEvent) => {
              this.#onResourceUpdated.fire({
                contextName: e.kubeconfig.getKubeConfig().currentContext,
                resourceName: e.resourceName,
              });
              if (e.countChanged) {
                this.#onResourceCountUpdated.fire({
                  contextName: e.kubeconfig.getKubeConfig().currentContext,
                  resourceName: e.resourceName,
                });
              }
            });
            informer.onOffline((_e: OfflineEvent) => {
              /* send event to dispatcher */
            });
            const cache = informer.start();
            this.#objectCaches.set(contextName, resource, cache);
          }
        });
        await newPermissionChecker.start();
      }
    });

    await newHealthChecker.start({ timeout: HEALTH_CHECK_TIMEOUT_MS });
  }

  private async onUpdate(event: DispatcherEvent): Promise<void> {
    // we don't try to update the checkers, we recreate them
    return this.onAdd(event);
  }

  private onDelete(state: DispatcherEvent): void {
    const healthChecker = this.#healthCheckers.get(state.contextName);
    healthChecker?.dispose();
    this.#healthCheckers.delete(state.contextName);
    const permissionsCheckers = this.#permissionsCheckers.filter(
      permissionChecker => permissionChecker.contextName === state.contextName,
    );
    for (const checker of permissionsCheckers) {
      checker.dispose();
    }
    this.#permissionsCheckers = this.#permissionsCheckers.filter(
      permissionChecker => permissionChecker.contextName !== state.contextName,
    );
  }

  private onStateChange(state: ContextHealthState): void {
    this.#onContextHealthStateChange.fire(state);
  }

  private onPermissionResult(event: ContextPermissionResult): void {
    this.#onContextPermissionResult.fire(event);
  }

  /* getHealthCheckersStates returns the current state of the health checkers */
  getHealthCheckersStates(): Map<string, ContextHealthState> {
    const result = new Map<string, ContextHealthState>();
    for (const [contextName, hc] of this.#healthCheckers.entries()) {
      result.set(contextName, hc.getState());
    }
    return result;
  }

  /* getPermissions returns the current permissions */
  getPermissions(): ContextPermission[] {
    return this.#permissionsCheckers.flatMap(permissionsChecker => permissionsChecker.getPermissions());
  }

  getResourcesCount(): ResourceCount[] {
    return this.#objectCaches.getAll().map(informer => ({
      contextName: informer.contextName,
      resourceName: informer.resourceName,
      count: informer.value.list().length,
    }));
  }

  getResources(contextNames: string[], resourceName: string): KubernetesContextResources[] {
    return this.#objectCaches.getForContextsAndResource(contextNames, resourceName).map(({ contextName, value }) => {
      return {
        contextName,
        items: value.list(),
      };
    });
  }

  getContextsGeneralState(): Map<string, ContextGeneralState> {
    return new Map<string, ContextGeneralState>();
  }

  getCurrentContextGeneralState(): ContextGeneralState {
    return {
      reachable: false,
      resources: {
        pods: 0,
        deployments: 0,
      },
    };
  }

  registerGetCurrentContextResources(_resourceName: ResourceName): KubernetesObject[] {
    return [];
  }

  unregisterGetCurrentContextResources(_resourceName: ResourceName): KubernetesObject[] {
    return [];
  }

  /* dispose all disposable resources created by the instance */
  dispose(): void {
    this.disposeAllHealthChecks();
    this.disposeAllPermissionsCheckers();
    this.disposeAllInformers();
    this.#onContextHealthStateChange.dispose();
    this.#onContextDelete.dispose();
  }

  async refreshContextState(_contextName: string): Promise<void> {}

  // disposeAllHealthChecks disposes all health checks and removes them from registry
  private disposeAllHealthChecks(): void {
    for (const [contextName, healthChecker] of this.#healthCheckers.entries()) {
      healthChecker.dispose();
      this.#healthCheckers.delete(contextName);
    }
  }

  // disposeAllPermissionsCheckers disposes all permissions checkers and removes them from registry
  private disposeAllPermissionsCheckers(): void {
    for (const permissionChecker of this.#permissionsCheckers) {
      permissionChecker.dispose();
    }
    this.#permissionsCheckers = [];
  }

  // disposeAllInformers disposes all informers and removes them from registry
  private disposeAllInformers(): void {
    for (const informer of this.#informers.getAll()) {
      informer.value.dispose();
    }
  }
}
