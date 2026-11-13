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

import type { ProviderInfo } from '@desktop-framework/api';

export interface ConnectionOperationSummaryOptions {
  providerInfo: Pick<
    ProviderInfo,
    | 'containerProviderConnectionCreationDisplayName'
    | 'kubernetesProviderConnectionCreationDisplayName'
    | 'vmProviderConnectionCreationDisplayName'
  >;
  // scope of the properties of the operation (ex: 'ContainerProviderConnectionFactory' or 'ContainerConnection')
  propertyScope: string;
  // connection being edited, undefined when a connection is created
  connectionInfo?: { name: string };
  // values submitted by the user
  formData?: { [key: string]: unknown };
}

/**
 * Describes a finished create/edit operation of a provider connection: which connection it was about
 * and how to title it.
 */
export class ConnectionOperationSummary {
  constructor(private readonly options: ConnectionOperationSummaryOptions) {}

  /**
   * Name of the connection that has been created or edited, undefined if it can't be determined.
   */
  getConnectionName(): string | undefined {
    const { connectionInfo, formData } = this.options;
    if (connectionInfo) {
      return connectionInfo.name;
    }
    // on creation, the name is one of the submitted fields (ex: podman.factory.machine.name, kind.cluster.creation.name)
    const nameKey = Object.keys(formData ?? {}).find(key => key.endsWith('.name'));
    const name = nameKey ? formData?.[nameKey] : undefined;
    return typeof name === 'string' && name.trim() ? name : undefined;
  }

  /**
   * Display name of the kind of connection matching the scope (ex: 'Podman machine'), if the provider defines one.
   */
  getProviderDisplayName(): string | undefined {
    const { providerInfo, propertyScope } = this.options;
    switch (propertyScope) {
      case 'ContainerProviderConnectionFactory':
      case 'ContainerConnection':
        return providerInfo.containerProviderConnectionCreationDisplayName;
      case 'KubernetesProviderConnectionFactory':
      case 'KubernetesConnection':
        return providerInfo.kubernetesProviderConnectionCreationDisplayName;
      case 'VmProviderConnectionFactory':
        return providerInfo.vmProviderConnectionCreationDisplayName;
      default:
        return undefined;
    }
  }

  /**
   * Title of the success screen (ex: 'Podman machine created'). The name of the connection is not part of it.
   * @param operationLabel title to use when the name of the connection is unknown
   */
  getTitle(operationLabel: string): string {
    if (!this.getConnectionName()) {
      return operationLabel;
    }
    const action = this.options.connectionInfo ? 'Updated' : 'Created';
    const providerDisplayName = this.getProviderDisplayName();
    return providerDisplayName ? `${providerDisplayName} ${action.toLowerCase()}` : action;
  }
}
