/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import type { ExtensionDevelopmentFolderInfo } from '@podman-desktop/core-api';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

export type CustomLocalExtensionSource = 'folder' | 'custom';

export interface SelectableExtensionDevelopmentFolderInfoUI extends ExtensionDevelopmentFolderInfo {
  selected: boolean;
  name: string;
  /** Local tracked folder vs OCI custom install. */
  source?: CustomLocalExtensionSource;
  /** Suggestion-scope seeded example row (not a real track/install). */
  prototypeDefault?: boolean;
  extension?: {
    id: string;
    name: string;
    state?: string;
  };
  /** Full installed info when available (Status column + custom uninstall). */
  installedExtension?: CombinedExtensionInfoUI;
}
