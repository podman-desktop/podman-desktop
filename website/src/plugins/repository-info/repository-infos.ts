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

import rootPackage from '../../../../package.json' with { type: 'json' };
import { RepositoryInfoParser } from './repository-info-parser.js';

export const REPOSITORY_URL = rootPackage.repository;
export const REPOSITORY_HOMEPAGE = rootPackage.homepage;

const parser = new RepositoryInfoParser(REPOSITORY_URL);

export const GITHUB_OWNER = parser.owner;
export const GITHUB_REPOSITORY = parser.repository;
