#!/usr/bin/env node
/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

// run download script on demand using `pnpm --cwd extensions/kind/ run install:contour` from the root of the repo
// override the version with CONTOUR_VERSION environment variable or by passing as an additional parameter
// if needed (e.g. v1.30.2) for testing

import * as fs from 'node:fs';
import * as path from 'node:path';
import { Octokit } from '@octokit/rest';
import type { OctokitOptions } from '@octokit/core/dist-types/types'; // these are not mentioned in the openapi-schema but in its example

const CONTOUR_ORG = 'projectcontour';
const CONTOUR_REPO = 'contour';
const CONTOUR_DEPLOY_FILE = 'contour.yaml';
const CONTOUR_DEPLOY_PATH = 'examples/render';
const CONTOUR_VERSION = 'v1.30.2';

const octokitOptions: OctokitOptions = {};
if (process.env.GITHUB_TOKEN) {
  octokitOptions.auth = process.env.GITHUB_TOKEN;
}
const octokit = new Octokit(octokitOptions);

// to make this file a module
export {};

async function download(tagVersion: string, repoPath: string, fileName: string) {
  const destDir = path.resolve(__dirname, '..', 'src', 'resources');
  fs.mkdirSync(destDir, { recursive: true });
  const destFile = path.join(destDir, fileName);
  // single-phase raw fetch
  const { data: rawData } = await octokit.request<string>('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: CONTOUR_ORG,
    repo: CONTOUR_REPO,
    path: `${repoPath}/${fileName}`,
    ref: tagVersion,
    mediaType: { format: 'raw' },
    responseType: 'arraybuffer',
  });
  fs.writeFileSync(destFile, Buffer.from(rawData));
  console.log(`${fileName} available at ${destFile}`);
}

// grab the manifests from the given URL
// download the file from the given URL and store the content in destFile
// particular contour file should be manually added to the repo once downloaded
const version = process.argv[2] || process.env.CONTOUR_VERSION || CONTOUR_VERSION;
void download(version, CONTOUR_DEPLOY_PATH, CONTOUR_DEPLOY_FILE).catch(err => {
  console.error(`Failed to download ${CONTOUR_DEPLOY_FILE} for ${version}:`, err?.message ?? err);
  process.exit(1);
});
