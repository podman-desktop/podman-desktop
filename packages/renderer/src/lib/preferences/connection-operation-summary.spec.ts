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

import { ConnectionOperationSummary, type ConnectionOperationSummaryOptions } from './connection-operation-summary';

const providerInfo: ConnectionOperationSummaryOptions['providerInfo'] = {
  containerProviderConnectionCreationDisplayName: 'Test machine',
  kubernetesProviderConnectionCreationDisplayName: 'Test cluster',
  vmProviderConnectionCreationDisplayName: 'Test vm',
};

function createSummary(options: Partial<ConnectionOperationSummaryOptions>): ConnectionOperationSummary {
  return new ConnectionOperationSummary({
    providerInfo,
    propertyScope: 'ContainerProviderConnectionFactory',
    ...options,
  });
}

describe('getConnectionName', () => {
  test('returns the name of the edited connection', () => {
    const summary = createSummary({ connectionInfo: { name: 'edited' }, formData: { 'test.factory.name': 'other' } });

    expect(summary.getConnectionName()).toBe('edited');
  });

  test.each(['podman.factory.machine.name', 'kind.cluster.creation.name'])(
    'returns the name submitted in the %s field on creation',
    key => {
      const summary = createSummary({ formData: { 'test.cpus': '2', [key]: 'created' } });

      expect(summary.getConnectionName()).toBe('created');
    },
  );

  test.each([
    { description: 'there is no form data', formData: undefined },
    { description: 'there is no name field', formData: { 'test.cpus': '2' } },
    { description: 'the name is empty', formData: { 'test.factory.name': '' } },
    { description: 'the name is blank', formData: { 'test.factory.name': '   ' } },
    { description: 'the name is not a string', formData: { 'test.factory.name': 2 } },
  ])('returns undefined on creation when $description', ({ formData }) => {
    expect(createSummary({ formData }).getConnectionName()).toBeUndefined();
  });
});

describe('getProviderDisplayName', () => {
  test.each([
    { propertyScope: 'ContainerProviderConnectionFactory', expected: 'Test machine' },
    { propertyScope: 'ContainerConnection', expected: 'Test machine' },
    { propertyScope: 'KubernetesProviderConnectionFactory', expected: 'Test cluster' },
    { propertyScope: 'KubernetesConnection', expected: 'Test cluster' },
    { propertyScope: 'VmProviderConnectionFactory', expected: 'Test vm' },
    { propertyScope: 'UnknownScope', expected: undefined },
  ])('returns $expected for the $propertyScope scope', ({ propertyScope, expected }) => {
    expect(createSummary({ propertyScope }).getProviderDisplayName()).toBe(expected);
  });

  test('returns undefined when the provider does not define the display name', () => {
    expect(createSummary({ providerInfo: {} }).getProviderDisplayName()).toBeUndefined();
  });
});

describe('getTitle', () => {
  test.each([
    { propertyScope: 'ContainerProviderConnectionFactory', expected: 'Test machine created' },
    { propertyScope: 'KubernetesProviderConnectionFactory', expected: 'Test cluster created' },
    { propertyScope: 'VmProviderConnectionFactory', expected: 'Test vm created' },
  ])('returns $expected when a connection is created in the $propertyScope scope', ({ propertyScope, expected }) => {
    const summary = createSummary({ propertyScope, formData: { 'test.factory.name': 'created' } });

    expect(summary.getTitle('Creation')).toBe(expected);
  });

  test.each([
    { propertyScope: 'ContainerConnection', expected: 'Test machine updated' },
    { propertyScope: 'KubernetesConnection', expected: 'Test cluster updated' },
  ])('returns $expected when a connection is edited in the $propertyScope scope', ({ propertyScope, expected }) => {
    const summary = createSummary({ propertyScope, connectionInfo: { name: 'edited' } });

    expect(summary.getTitle('Update')).toBe(expected);
  });

  test('returns only the action without display name on creation', () => {
    const summary = createSummary({ providerInfo: {}, formData: { 'test.factory.name': 'created' } });

    expect(summary.getTitle('Creation')).toBe('Created');
  });

  test('returns only the action without display name on edition', () => {
    const summary = createSummary({ providerInfo: {}, connectionInfo: { name: 'edited' } });

    expect(summary.getTitle('Update')).toBe('Updated');
  });

  test('returns the operation label when the name of the connection is unknown', () => {
    expect(createSummary({ formData: {} }).getTitle('Creation')).toBe('Creation');
  });
});
