#!/usr/bin/env node
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

import { access, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { applyEdits, modify, parse } from 'jsonc-parser';
import minimist from 'minimist';

const jsonFormattingOptions = {
  insertSpaces: true,
  tabSize: 2,
  eol: '\n',
};

export interface SyncArgs {
  incomingFile: string;
  schemaDir: string;
  catalogFile: string;
  schemaValidationFile: string;
  schemaFileName: string;
  versionedSchemaFileName: string;
  schemaMinorVersion: string;
}

export function buildSchemaOutputs(
  incomingText: string,
  stableFileName: string,
  versionedFileName: string,
): { stableSchemaText: string; versionedSchemaText: string } {
  const stableId = `https://json.schemastore.org/${stableFileName}`;
  const versionedId = `https://json.schemastore.org/${versionedFileName}`;

  const stableSchema = JSON.parse(incomingText);
  stableSchema.$id = stableId;
  const versionedSchema = structuredClone(stableSchema);
  versionedSchema.$id = versionedId;

  return {
    stableSchemaText: `${JSON.stringify(stableSchema, null, 2)}\n`,
    versionedSchemaText: `${JSON.stringify(versionedSchema, null, 2)}\n`,
  };
}

export function updateCatalogText(
  catalogText: string,
  stableFileName: string,
  versionedFileName: string,
  schemaMinorVersion: string,
): string {
  const catalog = JSON.parse(catalogText);
  if (!Array.isArray(catalog.schemas)) {
    throw new Error('Invalid SchemaStore catalog format: missing schemas array.');
  }

  const podmanEntryIndex = catalog.schemas.findIndex(schema => schema?.name === 'Podman Desktop Extension');
  if (podmanEntryIndex === -1) {
    throw new Error('Podman Desktop catalog entry is missing in SchemaStore.');
  }

  const stableUrl = `https://www.schemastore.org/${stableFileName}`;
  const versionedUrl = `https://www.schemastore.org/${versionedFileName}`;

  let updatedCatalogText = catalogText;
  const applyCatalogEdit = (targetPath: (string | number)[], value: unknown): void => {
    const edits = modify(updatedCatalogText, targetPath, value, { formattingOptions: jsonFormattingOptions });
    updatedCatalogText = applyEdits(updatedCatalogText, edits);
  };

  applyCatalogEdit(['schemas', podmanEntryIndex, 'url'], stableUrl);

  const currentVersions = catalog.schemas[podmanEntryIndex]?.versions;
  if (!currentVersions || typeof currentVersions !== 'object') {
    applyCatalogEdit(['schemas', podmanEntryIndex, 'versions'], {});
  }
  applyCatalogEdit(['schemas', podmanEntryIndex, 'versions', schemaMinorVersion], versionedUrl);

  return updatedCatalogText;
}

function parseSchemaValidationText(text: string): Record<string, unknown> {
  const errors = [];
  const parsed = parse(text, errors, {
    allowTrailingComma: true,
    disallowComments: false,
  });
  if (errors.length > 0) {
    throw new Error(`Could not parse schema-validation.jsonc (errors: ${errors.length})`);
  }
  return parsed as Record<string, unknown>;
}

export function updateSchemaValidationText(schemaValidationText: string, schemaTargets: string[]): string {
  let updatedText = schemaValidationText;

  const applyJsoncEdit = (targetPath: (string | number)[], value: unknown): void => {
    const edits = modify(updatedText, targetPath, value, { formattingOptions: jsonFormattingOptions });
    updatedText = applyEdits(updatedText, edits);
  };

  for (const target of schemaTargets) {
    const parsed = parseSchemaValidationText(updatedText);
    const options = parsed.options as Record<string, unknown> | undefined;
    const ajvNotStrictMode = parsed.ajvNotStrictMode as string[] | undefined;

    if (!options || typeof options !== 'object') {
      throw new Error('Could not find options object in schema-validation.jsonc');
    }
    if (!Array.isArray(ajvNotStrictMode)) {
      throw new Error('Could not find ajvNotStrictMode array in schema-validation.jsonc');
    }

    if (!options[target]) {
      const podmanOptionKeys = Object.keys(options).filter(
        key => /^podman-desktop-extension(?:-[0-9]+\.[0-9]+)?\.json$/.test(key) && key !== target,
      );
      const sourceFilename = podmanOptionKeys[podmanOptionKeys.length - 1] ?? 'package.json';
      const sourceOption = options[sourceFilename];
      if (!sourceOption) {
        throw new Error(`Could not find ${sourceFilename} options in schema-validation.jsonc`);
      }
      applyJsoncEdit(['options', target], structuredClone(sourceOption));
    }

    if (!ajvNotStrictMode.includes(target)) {
      applyJsoncEdit(['ajvNotStrictMode', ajvNotStrictMode.length], target);
    }
  }

  return updatedText;
}

export async function applySchemaUpdates(args: SyncArgs): Promise<void> {
  try {
    await access(args.incomingFile);
  } catch {
    throw new Error(`Missing source schema at ${args.incomingFile}`);
  }

  const incomingText = await readFile(args.incomingFile, 'utf8');
  const { stableSchemaText, versionedSchemaText } = buildSchemaOutputs(
    incomingText,
    args.schemaFileName,
    args.versionedSchemaFileName,
  );

  await writeFile(join(args.schemaDir, args.schemaFileName), stableSchemaText, 'utf8');
  await writeFile(join(args.schemaDir, args.versionedSchemaFileName), versionedSchemaText, 'utf8');

  const catalogText = await readFile(args.catalogFile, 'utf8');
  const updatedCatalogText = updateCatalogText(
    catalogText,
    args.schemaFileName,
    args.versionedSchemaFileName,
    args.schemaMinorVersion,
  );
  await writeFile(args.catalogFile, updatedCatalogText, 'utf8');

  const schemaValidationText = await readFile(args.schemaValidationFile, 'utf8');
  const updatedSchemaValidationText = updateSchemaValidationText(schemaValidationText, [
    args.schemaFileName,
    args.versionedSchemaFileName,
  ]);
  await writeFile(args.schemaValidationFile, updatedSchemaValidationText, 'utf8');
}

export function parseArgs(argv: string[]): SyncArgs {
  const parsed = minimist(argv);

  const required = [
    'incoming-file',
    'schema-dir',
    'catalog-file',
    'schema-validation-file',
    'schema-file-name',
    'versioned-schema-file-name',
    'schema-minor-version',
  ];

  for (const key of required) {
    const value = parsed[key];
    if (value === undefined || value === null || value === '') {
      throw new Error(`Missing required argument --${key}`);
    }
  }

  return {
    incomingFile: String(parsed['incoming-file']),
    schemaDir: String(parsed['schema-dir']),
    catalogFile: String(parsed['catalog-file']),
    schemaValidationFile: String(parsed['schema-validation-file']),
    schemaFileName: String(parsed['schema-file-name']),
    versionedSchemaFileName: String(parsed['versioned-schema-file-name']),
    schemaMinorVersion: String(parsed['schema-minor-version']),
  };
}

if (!process.env.VITEST) {
  const args = parseArgs(process.argv.slice(2));
  applySchemaUpdates(args).catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
