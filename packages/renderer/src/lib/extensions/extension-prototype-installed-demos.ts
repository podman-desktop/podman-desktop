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

import { arePrototypeUseCasesEnabled, setPrototypeUseCasesEnabled } from './extension-prototype-use-cases';

/** @deprecated Fake demo rows are no longer injected. Kept for test compatibility. */
export const PROTOTYPE_INSTALLED_DEMO_PREFIX = 'prototype-demo-';

/** @deprecated Use setPrototypeUseCasesEnabled */
export function setPrototypeInstalledDemosEnabled(enabled: boolean): void {
  setPrototypeUseCasesEnabled(enabled);
}

/** @deprecated Use arePrototypeUseCasesEnabled */
export function arePrototypeInstalledDemosEnabled(): boolean {
  return arePrototypeUseCasesEnabled();
}

/** @deprecated No fake demo extensions are injected. */
export function getPrototypeInstalledDemos(): CombinedExtensionInfoUI[] {
  return [];
}

/** @deprecated Legacy demo IDs are no longer used. */
export function isPrototypeInstalledDemo(_id: string): boolean {
  return false;
}
