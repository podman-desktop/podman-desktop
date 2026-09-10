/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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

import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import type { IconSize } from 'svelte-fa';

import type { ThemedIconImage } from '../icons/Icon';

export const isFontAwesomeIcon = (icon: unknown): icon is IconDefinition => {
  return (
    !!icon &&
    typeof icon === 'object' &&
    'prefix' in icon &&
    typeof icon.prefix === 'string' &&
    icon.prefix.startsWith('fa')
  );
};

export const isFontAwesomeSize = (size: unknown): size is IconSize => {
  const fontAwesomeSizes = ['xs', 'sm', 'lg'];
  const fontAwesomePattern = /^\d+(?:\.\d+)?x$/;
  return !!size && typeof size === 'string' && (fontAwesomePattern.test(size) || fontAwesomeSizes.includes(size));
};

export const isThemedIconImage = (icon: unknown): icon is ThemedIconImage => {
  return (
    !!icon &&
    typeof icon === 'object' &&
    'light' in icon &&
    typeof icon.light === 'string' &&
    'dark' in icon &&
    typeof icon.dark === 'string'
  );
};
