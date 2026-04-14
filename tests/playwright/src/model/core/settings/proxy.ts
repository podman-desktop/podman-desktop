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

enum ProxyLabels {
  PROXY_CONFIGURATION = 'Proxy configuration',
  HTTP = 'Web Proxy (HTTP)',
  HTTPS = 'Secure Web Proxy (HTTPS)',
  NO_PROXY = 'Bypass proxy settings for these hosts and domains',
  MANAGED = 'Managed by your organization',
}

export class Proxy {
  static readonly Labels = ProxyLabels;

  // Element IDs matching PreferencesProxiesRendering.svelte
  static readonly TOGGLE_PROXY_ID = 'toggle-proxy';
  static readonly HTTP_PROXY_ID = 'httpProxy';
  static readonly HTTPS_PROXY_ID = 'httpsProxy';
  static readonly NO_PROXY_ID = 'noProxy';
}
