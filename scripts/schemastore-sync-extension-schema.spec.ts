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
import { describe, expect, test } from 'vitest';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  applySchemaUpdates,
  buildSchemaOutputs,
  parseArgs,
  updateCatalogText,
  updateSchemaValidationText,
} from './schemastore-sync-extension-schema';

describe('sync-schemastore-extension-schema', () => {
  test('buildSchemaOutputs sets stable and versioned ids', () => {
    const incoming = JSON.stringify({
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Podman Desktop Extension Manifest',
      description: 'Schema for Podman Desktop extension package.json files',
      allOf: [{ $ref: 'https://json.schemastore.org/package.json' }],
    });

    const outputs = buildSchemaOutputs(incoming, 'podman-desktop-extension.json', 'podman-desktop-extension-1.28.json');
    const stable = JSON.parse(outputs.stableSchemaText);
    const versioned = JSON.parse(outputs.versionedSchemaText);

    expect(stable.$id).toBe('https://json.schemastore.org/podman-desktop-extension.json');
    expect(versioned.$id).toBe('https://json.schemastore.org/podman-desktop-extension-1.28.json');
    expect(versioned.title).toBe(stable.title);
  });

  test('updateCatalogText updates only podman entry version map', () => {
    const catalogText = JSON.stringify(
      {
        schemas: [
          {
            name: 'Other',
            description: 'Rocket \\u2014 keep escaped text',
            versions: { '10': 'https://www.schemastore.org/other-10.json' },
          },
          {
            name: 'Podman Desktop Extension',
            url: 'https://www.schemastore.org/podman-desktop-extension.json',
            versions: { '1.27': 'https://www.schemastore.org/podman-desktop-extension-1.27.json' },
          },
        ],
      },
      null,
      2,
    );

    const updated = updateCatalogText(
      catalogText,
      'podman-desktop-extension.json',
      'podman-desktop-extension-1.28.json',
      '1.28',
    );
    const parsed = JSON.parse(updated);

    expect(parsed.schemas[1].url).toBe('https://www.schemastore.org/podman-desktop-extension.json');
    expect(parsed.schemas[1].versions['1.27']).toBe('https://www.schemastore.org/podman-desktop-extension-1.27.json');
    expect(parsed.schemas[1].versions['1.28']).toBe('https://www.schemastore.org/podman-desktop-extension-1.28.json');
    expect(updated).toContain('Rocket \\\\u2014 keep escaped text');
  });

  test('updateCatalogText throws when schemas array is missing', () => {
    expect(() =>
      updateCatalogText(
        JSON.stringify({ somethingElse: [] }),
        'podman-desktop-extension.json',
        'podman-desktop-extension-1.28.json',
        '1.28',
      ),
    ).toThrowError('Invalid SchemaStore catalog format: missing schemas array.');
  });

  test('updateCatalogText throws when podman entry is missing', () => {
    expect(() =>
      updateCatalogText(
        JSON.stringify({ schemas: [{ name: 'Other schema' }] }),
        'podman-desktop-extension.json',
        'podman-desktop-extension-1.28.json',
        '1.28',
      ),
    ).toThrowError('Podman Desktop catalog entry is missing in SchemaStore.');
  });

  test('updateSchemaValidationText adds options from previous podman entry and ajv list entry', () => {
    const schemaValidation = `{
  "ajvNotStrictMode": [
    "pnpm-workspace.json",
    "podman-desktop-extension.json"
  ],
  "options": {
    "package.json": {
      "externalSchema": ["package.json", "eslintrc.json"],
      "unknownKeywords": ["exec", "tsType"]
    },
    "podman-desktop-extension.json": {
      "externalSchema": ["package.json", "eslintrc.json"],
      "unknownKeywords": ["exec", "tsType"]
    }
  }
}
`;

    const updated = updateSchemaValidationText(schemaValidation, ['podman-desktop-extension-1.28.json']);
    const parsed = JSON.parse(updated);

    expect(parsed.options['podman-desktop-extension-1.28.json']).toEqual(
      parsed.options['podman-desktop-extension.json'],
    );
    expect(parsed.ajvNotStrictMode).toContain('podman-desktop-extension-1.28.json');
  });

  test('updateSchemaValidationText throws when options are missing', () => {
    const invalidSchemaValidation = `{
  "ajvNotStrictMode": []
}
`;
    expect(() =>
      updateSchemaValidationText(invalidSchemaValidation, ['podman-desktop-extension-1.28.json']),
    ).toThrowError('Could not find options object in schema-validation.jsonc');
  });

  test('updateSchemaValidationText throws when ajvNotStrictMode is missing', () => {
    const invalidSchemaValidation = `{
  "options": {}
}
`;
    expect(() =>
      updateSchemaValidationText(invalidSchemaValidation, ['podman-desktop-extension-1.28.json']),
    ).toThrowError('Could not find ajvNotStrictMode array in schema-validation.jsonc');
  });

  test('updateSchemaValidationText throws when source options are missing', () => {
    const schemaValidation = `{
  "ajvNotStrictMode": [],
  "options": {}
}
`;
    expect(() => updateSchemaValidationText(schemaValidation, ['podman-desktop-extension-1.28.json'])).toThrowError(
      'Could not find package.json options in schema-validation.jsonc',
    );
  });

  test('parseArgs validates required args', () => {
    const args = parseArgs([
      '--incoming-file',
      '../schemas/extension-schema.json',
      '--schema-dir',
      'src/schemas/json',
      '--catalog-file',
      'src/api/json/catalog.json',
      '--schema-validation-file',
      'src/schema-validation.jsonc',
      '--schema-file-name',
      'podman-desktop-extension.json',
      '--versioned-schema-file-name',
      'podman-desktop-extension-1.28.json',
      '--schema-minor-version',
      '1.28',
    ]);

    expect(args.schemaMinorVersion).toBe('1.28');
    expect(args.versionedSchemaFileName).toBe('podman-desktop-extension-1.28.json');
  });

  test('parseArgs throws when required args are missing', () => {
    expect(() => parseArgs(['--incoming-file', '../schemas/extension-schema.json'])).toThrowError(
      'Missing required argument --schema-dir',
    );
  });

  test('applySchemaUpdates writes expected files', async () => {
    const tmpRoot = await mkdtemp(join(tmpdir(), 'sync-schema-test-'));
    try {
      const incomingFile = join(tmpRoot, 'schemas', 'extension-schema.json');
      const schemaDir = join(tmpRoot, 'schemastore', 'src', 'schemas', 'json');
      const catalogFile = join(tmpRoot, 'schemastore', 'src', 'api', 'json', 'catalog.json');
      const schemaValidationFile = join(tmpRoot, 'schemastore', 'src', 'schema-validation.jsonc');

      await mkdir(join(tmpRoot, 'schemas'), { recursive: true });
      await mkdir(schemaDir, { recursive: true });
      await mkdir(join(tmpRoot, 'schemastore', 'src', 'api', 'json'), { recursive: true });

      await writeFile(
        incomingFile,
        JSON.stringify({
          title: 'Podman',
          allOf: [{ $ref: 'https://json.schemastore.org/package.json' }],
        }),
        'utf8',
      );
      await writeFile(
        catalogFile,
        JSON.stringify(
          {
            schemas: [
              {
                name: 'Podman Desktop Extension',
                url: 'https://www.schemastore.org/podman-desktop-extension.json',
                versions: {},
              },
            ],
          },
          null,
          2,
        ),
        'utf8',
      );
      await writeFile(
        schemaValidationFile,
        `{
  "ajvNotStrictMode": [],
  "options": {
    "package.json": {
      "externalSchema": ["package.json"],
      "unknownKeywords": ["exec", "tsType"]
    }
  }
}
`,
        'utf8',
      );

      await applySchemaUpdates({
        incomingFile,
        schemaDir,
        catalogFile,
        schemaValidationFile,
        schemaFileName: 'podman-desktop-extension.json',
        versionedSchemaFileName: 'podman-desktop-extension-1.28.json',
        schemaMinorVersion: '1.28',
      });

      const stableSchema = JSON.parse(await readFile(join(schemaDir, 'podman-desktop-extension.json'), 'utf8'));
      const versionedSchema = JSON.parse(await readFile(join(schemaDir, 'podman-desktop-extension-1.28.json'), 'utf8'));
      expect(stableSchema.$id).toBe('https://json.schemastore.org/podman-desktop-extension.json');
      expect(versionedSchema.$id).toBe('https://json.schemastore.org/podman-desktop-extension-1.28.json');
    } finally {
      await rm(tmpRoot, { force: true, recursive: true });
    }
  });

  test('applySchemaUpdates throws when incoming schema is missing', async () => {
    await expect(
      applySchemaUpdates({
        incomingFile: '/tmp/definitely-missing-file.json',
        schemaDir: '/tmp',
        catalogFile: '/tmp/catalog.json',
        schemaValidationFile: '/tmp/schema-validation.jsonc',
        schemaFileName: 'podman-desktop-extension.json',
        versionedSchemaFileName: 'podman-desktop-extension-1.28.json',
        schemaMinorVersion: '1.28',
      }),
    ).rejects.toThrowError('Missing source schema at /tmp/definitely-missing-file.json');
  });
});
