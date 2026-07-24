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

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';

export interface CatalogTableCallbacks {
  oninstall: (extensionId: string) => void;
  onChangeVersion: (extension: CatalogExtensionInfoUI, preferredVersion?: string) => void;
}

export let catalogTableCallbacks: CatalogTableCallbacks = {
  oninstall: (): void => {},
  onChangeVersion: (): void => {},
};

export function setCatalogTableCallbacks(callbacks: CatalogTableCallbacks): void {
  catalogTableCallbacks = callbacks;
}
