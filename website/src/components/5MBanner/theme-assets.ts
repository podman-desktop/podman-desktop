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

export const ATLAS_LIGHT_SRC = '/img/banner/5m/atlas-light.svg';
export const ATLAS_DARK_SRC = '/img/banner/5m/atlas-dark.svg';
export const TITLE_LIGHT_SRC = '/img/banner/5m/title-light.svg';
export const TITLE_DARK_SRC = '/img/banner/5m/title-dark.svg';

/** Resolves the particle atlas URL for the active Docusaurus color mode. */
export function atlasSrcForColorMode(colorMode: 'light' | 'dark'): string {
  return colorMode === 'dark' ? ATLAS_DARK_SRC : ATLAS_LIGHT_SRC;
}
