/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import type { ContextHealth } from '/@api/kubernetes-contexts-healths.js';
import type { ContextPermission } from '/@api/kubernetes-contexts-permissions.js';
import type { ResourceCount } from '/@api/kubernetes-resource-count.js';
import type { KubernetesContextResources } from '/@api/kubernetes-resources.js';
import type { KubernetesTroubleshootingInformation } from '/@api/kubernetes-troubleshooting.js';

import type { ApiSenderType } from '../api.js';
import type { ContextHealthState } from './context-health-checker.js';
import type { ContextPermissionResult } from './context-permissions-checker.js';
import type { DispatcherEvent } from './contexts-dispatcher.js';
import type { ContextsManagerExperimental } from './contexts-manager-experimental.js';

export class ContextsStatesDispatcher {
  constructor(
    private manager: ContextsManagerExperimental,
    private apiSender: ApiSenderType,
  ) {}

  init(): void {
    this.manager.onContextHealthStateChange((_state: ContextHealthState) => this.updateHealthStates());
    this.manager.onOfflineChange(() => {
      this.updateHealthStates();
      this.updateResourcesCount();
      this.updateActiveResourcesCount();
    });
    this.manager.onContextPermissionResult((_permissions: ContextPermissionResult) => this.updatePermissions());
    this.manager.onContextDelete((_state: DispatcherEvent) => {
      this.updateHealthStates();
      this.updatePermissions();
    });
    this.manager.onResourceCountUpdated(() => this.updateResourcesCount());
    this.manager.onResourceUpdated(event => {
      this.updateResource(event.resourceName);
      this.updateActiveResourcesCount();
    });
  }

  updateHealthStates(): void {
    this.apiSender.send('kubernetes-contexts-healths');
  }

  getContextsHealths(): ContextHealth[] {
    const value: ContextHealth[] = [];
    for (const [contextName, health] of this.manager.getHealthCheckersStates()) {
      value.push({
        contextName,
        checking: health.checking,
        reachable: health.reachable,
        offline: this.manager.isContextOffline(contextName),
        errorMessage: health.errorMessage,
      });
    }
    return value;
  }

  updatePermissions(): void {
    this.apiSender.send('kubernetes-contexts-permissions');
  }

  getContextsPermissions(): ContextPermission[] {
    return this.manager.getPermissions();
  }

  updateResourcesCount(): void {
    this.apiSender.send(`kubernetes-resources-count`);
  }

  updateActiveResourcesCount(): void {
    this.apiSender.send(`kubernetes-active-resources-count`);
  }

  getResourcesCount(): ResourceCount[] {
    return this.manager.getResourcesCount();
  }

  getActiveResourcesCount(): ResourceCount[] {
    return this.manager.getActiveResourcesCount();
  }

  updateResource(resourceName: string): void {
    this.apiSender.send(`kubernetes-update-${resourceName}`);
  }

  getResources(contextNames: string[], resourceName: string): KubernetesContextResources[] {
    return this.manager.getResources(contextNames, resourceName);
  }

  getTroubleshootingInformation(): KubernetesTroubleshootingInformation {
    return this.manager.getTroubleshootingInformation();
  }
}
