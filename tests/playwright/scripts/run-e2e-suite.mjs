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

import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { delimiter, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const SPECS_DIR = resolve(REPO_ROOT, 'tests/playwright/src/specs');
const SPECS_DIR_RELATIVE = 'tests/playwright/src/specs';

const allSpecs = readdirSync(SPECS_DIR).filter(f => f.endsWith('.spec.ts'));

const suite = process.argv[2];
if (!suite) {
  console.error('Usage: pnpm test:e2e:suite <suite-name>\n');
  console.error('Available suites (substring match):');
  for (const s of allSpecs.map(f => f.replace('.spec.ts', ''))) {
    console.error(`  ${s}`);
  }
  process.exit(1);
}

const normalizedSuite = suite.toLowerCase();
const matches = allSpecs.filter(f => f.toLowerCase().includes(normalizedSuite));

if (matches.length === 0) {
  console.error(`No spec file matching "${suite}" found in ${SPECS_DIR_RELATIVE}/`);
  process.exit(1);
}

const files = matches.map(f => `${SPECS_DIR_RELATIVE}/${f}`);
const extraArgs = process.argv.slice(3);

const xvfbArgs = ['--auto-servernum', '--server-args=-screen 0 1280x960x24', '--'];
const playwrightArgs = ['playwright', 'test', ...files, ...extraArgs];

const binDir = resolve(REPO_ROOT, 'node_modules/.bin');
const env = { ...process.env };

const pathKey = Object.keys(env).find(k => k.toUpperCase() === 'PATH') ?? 'PATH';
if (!env[pathKey]?.includes(binDir)) {
  env[pathKey] = `${binDir}${delimiter}${env[pathKey] ?? ''}`;
}

console.log(`Running: npx ${playwrightArgs.join(' ')}\n`);
const result = spawnSync('xvfb-maybe', [...xvfbArgs, 'npx', ...playwrightArgs], {
  stdio: 'inherit',
  shell: true,
  env,
});

process.exit(result.status ?? 1);
