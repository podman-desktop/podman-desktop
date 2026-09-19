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

import type { ExposedMainWorldApi } from './src/exposed-api.js';

/**
 * Augments the global Window interface with the typed methods from
 * ExposedMainWorldApi. TypeScript merges this with the generated
 * exposedInMainWorld.d.ts declarations for unmigrated methods.
 *
 * Using `extends Readonly<ExposedMainWorldApi>` preserves symbol identity,
 * so "Find References" on any property in ExposedMainWorldApi shows
 * usages across the preload, renderer, and this declaration.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends Readonly<ExposedMainWorldApi> {}
}
