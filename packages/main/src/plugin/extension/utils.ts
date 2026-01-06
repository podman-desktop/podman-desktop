/*********************************************************************
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
 ********************************************************************/
import { app } from 'electron';
import { valid } from 'semver';

import product from '/@product.json' with { type: 'json' };

/**
 * This function will return the apiVersion of the application.
 * By default, it returns the version from {@link import('electron').app#getVersion}.
 * @remarks the apiVersion can be overridden in the product.json file.
 * @returns the apiVersion of the application
 */
export function getApiVersion(): string {
  const version = app.getVersion();

  let apiVersion: string;
  if ('apiVersion' in product && typeof product['apiVersion'] === 'string' && !!valid(product['apiVersion'])) {
    apiVersion = product['apiVersion'];
  } else {
    apiVersion = version;
  }

  return apiVersion;
}
