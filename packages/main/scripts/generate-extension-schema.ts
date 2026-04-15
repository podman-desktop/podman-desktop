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

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';

import minimist from 'minimist';

import { generateExtensionManifestJsonSchema } from '/@/plugin/extension/extension-manifest-json-schema.js';

const DEFAULT_OUTPUT = join('schemas', 'extension-schema.json');

export function parseArgs(args: string[]): { output: string } {
  const parsed = minimist(args);
  const rawOutput: unknown = parsed['output'];

  if (rawOutput === undefined || rawOutput === null || rawOutput === false) {
    return { output: resolve(process.cwd(), DEFAULT_OUTPUT) };
  }

  if (typeof rawOutput !== 'string' || rawOutput.trim() === '') {
    throw new Error('--output must be a non-empty string path');
  }

  const output = rawOutput;

  if (!isAbsolute(output)) {
    throw new Error('the output path should be absolute');
  }

  return { output };
}

export async function main(args: string[]): Promise<void> {
  const { output } = parseArgs(args);

  const schema = generateExtensionManifestJsonSchema();
  const content = `${JSON.stringify(schema, undefined, 2)}\n`;

  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, content, { encoding: 'utf-8' });

  console.log(`Extension schema written to ${output}`);
}

if (!process.env['VITEST']) {
  main(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
