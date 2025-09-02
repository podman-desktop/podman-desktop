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
// to debug raw content download set DEBUG_RAW_CONTENT environment variable to any value

import * as fs from 'node:fs';
import * as path from 'node:path';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import type { OctokitResponse } from '@octokit/types';
import type { OctokitOptions } from '@octokit/core/dist-types/types';
type ReposGetContentResponseData = RestEndpointMethodTypes['repos']['getContent']['response']['data'] & {
  encoding?: string; // actually BufferEncoding
  content?: string;
  download_url?: string | null;
}; // these are not mentioned in the openapi-schema but in its example

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

async function download(tagVersion: string, repoPath: string, fileName: string): Promise<void> {
  const destDir = path.resolve(__dirname, '..', 'src', 'resources');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const destFile = path.resolve(destDir, fileName);
  const manifestUrl = `https://github.com/${CONTOUR_ORG}/${CONTOUR_REPO}/blob/${tagVersion}/${repoPath}/${fileName}`;
  console.log(`Downloading Contour manifests from ${manifestUrl}`);
  const { data } = await octokit.rest.repos.getContent({
    owner: CONTOUR_ORG,
    repo: CONTOUR_REPO,
    path: repoPath + '/' + fileName,
    ref: tagVersion,
    headers: {
      accept: 'application/json',
    },
  }) as OctokitResponse<ReposGetContentResponseData>;

  if (process.env.DEBUG_RAW_CONTENT) {
    data.content = undefined;
  }

  if (!data.content && !data.download_url) {
    throw new Error(
      `No content or download_url for ${CONTOUR_ORG}/${CONTOUR_REPO}@${tagVersion}:${repoPath}/${fileName}`
    );
  }

  const buffer = await getBuffer(data);

  fs.writeFileSync(destFile, buffer);
  console.log(`Contour.yaml available at ${destFile}`);
}

async function getBuffer(
  data: ReposGetContentResponseData
): Promise<Buffer> {
  if (data.content) {
    const enc = data.encoding === 'base64' ? 'base64' : undefined;
    return Buffer.from(data.content, enc);
  }
  console.log(`Downloading raw content from ${data.download_url}`);
  const { data: raw } = await octokit.request('GET {url}', {
    url: data.download_url!,
    headers: { accept: 'application/vnd.github.raw' },
  });
  return Buffer.isBuffer(raw) ? raw : Buffer.from(raw as string);
}

// grab the manifests from the given URL
// download the file from the given URL and store the content in destFile
// particular contour file should be manually added to the repo once downloaded
const version = process.argv[2] || process.env.CONTOUR_VERSION || CONTOUR_VERSION;
void download(version, CONTOUR_DEPLOY_PATH, CONTOUR_DEPLOY_FILE).catch(err => {
  console.error(`Failed to download ${CONTOUR_DEPLOY_FILE} for ${version}:`, err?.message ?? err);
  process.exit(1);
});
