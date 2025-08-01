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
const fs = require('node:fs');
const path = require('node:path');

function parseVersion(version) {
  const parts = version.split('.');
  if (parts.length >= 2) {
    const major = parseInt(parts[0], 10);
    const minor = parseInt(parts[1], 10);
    if (!isNaN(major) && !isNaN(minor)) {
      return [major, minor];
    }
  }
  throw new Error(`Invalid version: ${version}`);
}

function decreaseMinorVersion(packageJsonPath, shouldUpdate) {
  const resolvedPath = path.resolve(packageJsonPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Package.json not found: ${resolvedPath}`);
  }
  const fileContent = fs.readFileSync(resolvedPath, 'utf8');
  const packageJson = JSON.parse(fileContent);
  const originalVersion = packageJson.version;
  const versionParts = parseVersion(originalVersion);
  const [major, minor] = versionParts;
  const newMinor = minor - 1;
  let newVersion = `${major}.${newMinor}.0`;
  if (newMinor < 0) {
    console.log(`Minor cannot be less than 0, defaults to 1.20.0`);
    newVersion = '1.20.0';
  }
  console.log(`Original version: ${originalVersion}`);
  console.log(`Decremented version (x.y.z): ${newVersion}`);
  if (shouldUpdate) {
    packageJson.version = newVersion;
    fs.writeFileSync(resolvedPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    console.log(`Success: package.json updated with version ${newVersion}`);
  } else {
    console.log('Dry run: File not modified. Use --update flag to replace the version.');
  }

  return newVersion;
}

// Example usage: node tests/playwright/scripts/version-util.cjs ./package.json --update
const args = process.argv.slice(2);
const updateFlagIndex = args.indexOf('--update');
const shouldUpdate = updateFlagIndex !== -1;
const pathArg = args.filter(arg => arg !== '--update')[0];

if (!pathArg) {
  console.error('Error: A path to a package.json file must be provided as an argument.');
  process.exit(1);
}

decreaseMinorVersion(pathArg, shouldUpdate);
