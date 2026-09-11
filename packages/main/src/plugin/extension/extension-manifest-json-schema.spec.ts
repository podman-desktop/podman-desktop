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

import { generateExtensionManifestJsonSchema } from './extension-manifest-json-schema.js';

function getExtensionSchema(): Record<string, unknown> {
  const schema = generateExtensionManifestJsonSchema();
  const allOf = schema['allOf'] as Record<string, unknown>[];
  return allOf[1] as Record<string, unknown>;
}

describe('generateExtensionManifestJsonSchema', () => {
  test('produces a valid JSON Schema with allOf composition', () => {
    const schema = generateExtensionManifestJsonSchema();

    expect(schema['$schema']).toBe('http://json-schema.org/draft-07/schema#');
    expect(schema['title']).toBe('Podman Desktop Extension Manifest');
    expect(schema['allOf']).toBeDefined();
    expect(Array.isArray(schema['allOf'])).toBe(true);
  });

  test('references the SchemaStore package.json schema', () => {
    const schema = generateExtensionManifestJsonSchema();
    const allOf = schema['allOf'] as Record<string, unknown>[];

    expect(allOf[0]).toEqual({ $ref: 'https://json.schemastore.org/package.json' });
  });

  test('includes extension-specific properties in the second allOf entry', () => {
    const extensionSchema = getExtensionSchema();

    expect(extensionSchema['type']).toBe('object');

    const properties = extensionSchema['properties'] as Record<string, unknown>;
    expect(properties).toHaveProperty('displayName');
    expect(properties).toHaveProperty('publisher');
    expect(properties).toHaveProperty('contributes');
    expect(properties).toHaveProperty('engines');
    expect(properties).toHaveProperty('extensionDependencies');
    expect(properties).toHaveProperty('extensionPack');
  });

  test('does not set additionalProperties to false (loose schema)', () => {
    const extensionSchema = getExtensionSchema();
    expect(extensionSchema['additionalProperties']).not.toBe(false);
  });

  test('requires mandatory extension fields', () => {
    const extensionSchema = getExtensionSchema();
    const required = extensionSchema['required'] as string[];

    expect(required).toContain('name');
    expect(required).toContain('displayName');
    expect(required).toContain('version');
    expect(required).toContain('publisher');
    expect(required).toContain('description');
  });

  test('requires visible content in contributed configuration property names', () => {
    const extensionSchema = getExtensionSchema();
    const extensionProperties = extensionSchema['properties'] as Record<string, Record<string, unknown>>;
    const contributes = extensionProperties['contributes'] as Record<string, unknown>;
    const contributesProperties = contributes['properties'] as Record<string, Record<string, unknown>>;
    const configuration = contributesProperties['configuration'] as Record<string, unknown>;
    const configurationProperties = configuration['properties'] as Record<string, Record<string, unknown>>;
    const configurationPropertyMap = configurationProperties['properties'] as Record<string, unknown>;
    const contributedProperties = configurationPropertyMap['additionalProperties'] as Record<
      string,
      Record<string, unknown>
    >;
    const propertySchema = contributedProperties['properties'] as Record<string, Record<string, unknown>>;

    expect(propertySchema['name']).toMatchObject({ minLength: 1, pattern: '\\S', type: 'string' });
    expect((contributedProperties['required'] as string[] | undefined) ?? []).not.toContain('name');
  });
});
