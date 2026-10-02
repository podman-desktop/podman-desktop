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

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

/**
 * True when the given installed extension is bundled with Podman Desktop — i.e. shipped inside the
 * app and not user-removable. This mirrors the "bundled" badge shown in the installed list
 * (see ExtensionBadge.svelte): a non-removable extension that is neither a Docker Desktop extension
 * nor running in development mode.
 *
 * Bundled extensions are always installed, so a catalog entry can be identified as bundled by
 * matching it (by id) against the installed extensions and checking this flag.
 */
export function isBundledExtension(
  installed?: Pick<CombinedExtensionInfoUI, 'type' | 'devMode' | 'removable'>,
): boolean {
  if (!installed || installed.devMode || installed.type === 'dd') {
    return false;
  }
  return !installed.removable;
}
