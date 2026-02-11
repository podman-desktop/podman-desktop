/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import { fromUrl } from 'hosted-git-info';

export class RepositoryInfoParser {
  public readonly owner: string;
  public readonly repository: string;

  constructor(private readonly url: string) {
    const infos = fromUrl(this.url);

    if (!infos) {
      throw new Error(`Could not parse repository information from URL: ${this.url}`);
    }

    if (infos.type !== 'github') {
      throw new Error(`Repository type is not GitHub. Detected type: ${infos.type}. URL: ${this.url}`);
    }

    this.owner = infos.user;
    this.repository = infos.project;
  }
}
