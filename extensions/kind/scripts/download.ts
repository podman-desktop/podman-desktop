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

import * as fs from 'node:fs';
import * as path from 'node:path';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import type { OctokitResponse } from '@octokit/types';
import type { OctokitOptions } from '@octokit/core/dist-types/types';
type ReposGetContentResponseData = RestEndpointMethodTypes['repos']['getContent']['response']['data'] & {
  encoding?: string;
  content?: string;
}; // these are not mentioned in the openapi-schema but in its example

const CONTOUR_ORG = 'projectcontour';
const CONTOUR_REPO = 'contour';
const CONTOUR_DEPLOY_FILE = 'contour.yaml';
const CONTOUR_DEPLOY_PATH = 'examples/render';
const CONTOUR_VERSION = 'v1.32.1';

const octokitOptions: OctokitOptions = {};
if (process.env.GITHUB_TOKEN) {
  octokitOptions.auth = process.env.GITHUB_TOKEN;
}
const octokit = new Octokit(octokitOptions);

// to make this file a module
export {};

async function download(tagVersion: string, repoPath: string, fileName: string): Promise<void> {
  const destDir = path.resolve(__dirname, '..', 'src', 'resources');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }
  const destFile = path.resolve(destDir, fileName);
  console.log(
    `Downloading Contour manifests from https://github.com/${CONTOUR_ORG}/${CONTOUR_REPO}/${CONTOUR_DEPLOY_PATH}/${CONTOUR_DEPLOY_FILE} version ${tagVersion}`,
  );
  const manifests: OctokitResponse<ReposGetContentResponseData> = await octokit.rest.repos.getContent({
    owner: CONTOUR_ORG,
    repo: CONTOUR_REPO,
    path: repoPath + '/' + fileName,
    ref: tagVersion,
    headers: {
      accept: 'application/json',
    },
  });
  let buffer;

  if (!manifests.data.content) {
    throw new Error('No content in manifests data');
  }

  if (manifests.data.encoding && manifests.data.encoding === 'base64') {
    buffer = Buffer.from(manifests.data.content, 'base64');
  } else {
    buffer = Buffer.from(manifests.data.content);
  }

  fs.writeFileSync(destFile, buffer);
  console.log(`Contour.yaml available at ${destFile}`);
}

// grab the manifests from the given URL
// download the file from the given URL and store the content in destFile
// particular contour file should be manually added to the repo once downloaded
// run download script on demand using `pnpm --cwd extensions/kind/ run install:contour`
download(CONTOUR_VERSION, CONTOUR_DEPLOY_PATH, CONTOUR_DEPLOY_FILE);
