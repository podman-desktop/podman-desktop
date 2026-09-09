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
import { basename, delimiter, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const SPECS_DIR = resolve(REPO_ROOT, 'tests/playwright/src/specs');
const SPECIAL_SPECS_DIR = resolve(REPO_ROOT, 'tests/playwright/src/special-specs');
const BASE_DIR = resolve(REPO_ROOT, 'tests/playwright/src');

const toPosix = p => p.replace(/\\/g, '/');

function findSpecFiles(dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findSpecFiles(fullPath));
    } else if (entry.name.endsWith('.spec.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

function printAvailableSuites(specsFiles, specialSpecsFiles) {
  console.error('Available suites (specs/):');
  for (const name of specsFiles.map(f => basename(f).replace('.spec.ts', '')).sort()) {
    console.error(`  ${name}`);
  }
  if (specialSpecsFiles.length > 0) {
    console.error('\nAvailable suites (special-specs/):');
    const dirNames = new Set(specialSpecsFiles.map(f => relative(SPECIAL_SPECS_DIR, f).split(/[/\\]/)[0]));
    for (const name of [...dirNames].sort()) {
      console.error(`  ${name}`);
    }
  }
}

const specsFiles = findSpecFiles(SPECS_DIR);
const specialSpecsFiles = findSpecFiles(SPECIAL_SPECS_DIR);
const allSpecFiles = [...specsFiles, ...specialSpecsFiles];

const firstArg = process.argv[2];
const isAll = firstArg === '--all';
const suite = !isAll && firstArg ? firstArg : undefined;
const extraArgs = process.argv.slice(isAll || suite ? 3 : 2).filter(a => a !== '--');

let files;

if (isAll) {
  files = [toPosix(relative(REPO_ROOT, SPECS_DIR))];
} else if (suite) {
  const normalizedSuite = suite.toLowerCase();

  // Prefer exact directory-segment matches; fall back to filename substring
  const dirMatches = allSpecFiles.filter(f => {
    const relPath = relative(BASE_DIR, f).toLowerCase();
    const segments = relPath.split(/[/\\]/);
    segments.pop();
    return segments.some(s => s === normalizedSuite);
  });

  const matches =
    dirMatches.length > 0
      ? dirMatches
      : allSpecFiles.filter(f => {
          const fileName = basename(f).replace('.spec.ts', '').toLowerCase();
          return fileName.includes(normalizedSuite);
        });

  if (matches.length === 0) {
    console.error(`No spec file matching "${suite}" found.\n`);
    printAvailableSuites(specsFiles, specialSpecsFiles);
    process.exit(1);
  }

  files = matches.map(f => toPosix(relative(REPO_ROOT, f)));
} else {
  console.error('Usage: pnpm test:e2e:suite [--all | <suite-name>] [extra-playwright-args...]\n');
  console.error('Options:');
  console.error('  --all          Run all spec files from the specs/ directory');
  console.error('  <suite-name>   Run spec files matching the name (directory or filename match)\n');
  printAvailableSuites(specsFiles, specialSpecsFiles);
  process.exit(1);
}

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
  shell: process.platform === 'win32',
  env,
});

process.exit(result.status ?? 1);
