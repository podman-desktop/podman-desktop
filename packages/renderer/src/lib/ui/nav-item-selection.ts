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

/**
 * Whether a navigation entry pointing at `href` is the selected one for `routeUrl`.
 *
 * Shared by `NavItem`, which draws the highlight, and the navigation registry, which tells main
 * what must not be hidden. One rule for both is what stops the open page being hidden.
 */
export function isNavItemSelected(routeUrl: string, href: string): boolean {
  const uri = encodeURI(href);
  // tinro may append a query string; selection is decided by the path alone
  const path = routeUrl.split('?')[0] ?? routeUrl;
  return path === uri || (uri !== '/' && path.startsWith(uri));
}
