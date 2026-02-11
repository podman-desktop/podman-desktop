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

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { Component } from 'svelte';

import type { ContainerInfo } from './container-info.js';
import type { ImageInfo } from './image-info.js';
import type { PodInfo } from './pod-info.js';
import type { VolumeInfo } from './volume-info.js';

export interface DocumentationBaseInfo {
  name: string;
  url: string;
}

export interface DocumentationInfo extends DocumentationBaseInfo {
  id: string;
  description: string;
  category: string;
}

export type GoToInfo =
  | (PodInfo & { type: 'Pod'; icon: GoToIcon })
  | (ContainerInfo & { type: 'Container'; icon: GoToIcon })
  | (ImageInfo & { type: 'Image'; icon: GoToIcon })
  | (VolumeInfo & { type: 'Volume'; icon: GoToIcon })
  | (NavigationInfo & { type: 'Navigation'; icon: GoToIcon })
  // For commands that are registered as navigation routes (e.g. navigating to extensionresources)
  | (NavigationCommandInfo & { type: 'NavigationCommand'; icon: GoToIcon });

export interface NavigationCommandInfo {
  name: string;
  command: string;
  id: string;
  hidden?: boolean;
}

export interface NavigationInfo {
  name: string;
  link: string;
}

export interface GoToIcon {
  iconImage?: string | { readonly light: string; readonly dark: string };
  iconComponent?: Component; // Component type
  faIcon?: IconDefinition; // IconDefinition type
}
