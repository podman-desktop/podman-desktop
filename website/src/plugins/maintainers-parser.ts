/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
 * Parses MAINTAINERS.md to extract GitHub usernames.
 * Expected format: | Name | @username | Employer |
 */

export function parseMaintainersFromMarkdown(content: string): Set<string> {
  const maintainers = new Set<string>();

  // Match GitHub usernames in format @username
  const usernamePattern = /@([a-zA-Z0-9_-]+)/g;
  const matches = content.matchAll(usernamePattern);

  for (const match of matches) {
    maintainers.add(match[1].toLowerCase());
  }

  return maintainers;
}
