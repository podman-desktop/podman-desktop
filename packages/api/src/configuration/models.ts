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

import type {
  Configuration,
  ConfigurationChangeEvent,
  ConfigurationScope as PodmanDesktopApiConfigurationScope,
} from '@podman-desktop/api';

import type { IDisposable } from '/@/disposable.js';
import type { Event } from '/@/event.js';

interface IExperimentalConfiguration {
  // href to the discussion
  githubDiscussionLink?: string;
  // path to image or gif
  image?: string;
}

type IConfigurationPropertySchemaType =
  | 'markdown'
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'null'
  | 'array'
  | 'object';

export interface IConfigurationChangeEvent {
  key: string;
  value: unknown;
  scope: PodmanDesktopApiConfigurationScope;
}

export interface IConfigurationPropertyRecordedSchema extends IConfigurationPropertySchema {
  title: string;
  parentId: string;
  extension?: IConfigurationExtensionInfo;
  // indicates if this configuration value is locked by system management (managed-by profile)
  locked?: boolean;
}

export interface IConfigurationPropertySchema {
  id?: string;
  type?: IConfigurationPropertySchemaType | IConfigurationPropertySchemaType[];
  default?: unknown;
  group?: string;
  description?: string;
  placeholder?: string;
  markdownDescription?: string;
  minimum?: number;
  maximum?: number | string;
  format?: string;
  step?: number;
  scope?: ConfigurationScope | ConfigurationScope[];
  readonly?: boolean;
  // if hidden is true, the property is not shown in the preferences page. It may still appear in other locations if it uses other scope (like onboarding)
  hidden?: boolean;
  enum?: string[];
  when?: string;
  experimental?: IExperimentalConfiguration;
}

export type ConfigurationScope =
  | 'DEFAULT'
  | 'ContainerConnection'
  | 'KubernetesConnection'
  | 'VmConnection'
  | 'ContainerProviderConnectionFactory'
  | 'KubernetesProviderConnectionFactory'
  | 'VmProviderConnectionFactory'
  | 'DockerCompatibility'
  | 'Onboarding';

export interface IConfigurationExtensionInfo {
  id: string;
}

export interface IConfigurationNode {
  id: string;
  type?: string | string[];
  title: string;
  description?: string;
  properties?: Record<string, IConfigurationPropertySchema>;
  scope?: ConfigurationScope;
  extension?: IConfigurationExtensionInfo;
}

export const IConfigurationRegistry = Symbol.for('IConfigurationRegistry');
export interface IConfigurationRegistry {
  registerConfigurations(configurations: IConfigurationNode[]): IDisposable;
  deregisterConfigurations(configurations: IConfigurationNode[]): void;
  updateConfigurations(configurations: { add: IConfigurationNode[]; remove: IConfigurationNode[] }): void;
  readonly onDidUpdateConfiguration: Event<{ properties: string[] }>;
  readonly onDidChangeConfiguration: Event<IConfigurationChangeEvent>;
  readonly onDidChangeConfigurationAPI: Event<ConfigurationChangeEvent>;
  getConfigurationProperties(): Record<string, IConfigurationPropertyRecordedSchema>;
  getConfiguration(section?: string, scope?: PodmanDesktopApiConfigurationScope): Configuration;
  updateConfigurationValue(
    key: string,
    value: unknown,
    scope?: PodmanDesktopApiConfigurationScope | PodmanDesktopApiConfigurationScope[],
  ): Promise<void>;
}
