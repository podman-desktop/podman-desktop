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
  name: 'test-provider',
  containerProviderConnectionCreation: true,
  containerProviderConnectionCreationDisplayName: 'Test machine',
  kubernetesProviderConnectionCreation: false,
  kubernetesProviderConnectionCreationDisplayName: 'Test cluster',
  vmProviderConnectionCreation: false,
  vmProviderConnectionCreationDisplayName: 'Test vm',
};

function createSummary(options: Partial<ConnectionOperationSummaryOptions>): ConnectionOperationSummary {
  return new ConnectionOperationSummary({ providerInfo, ...options });
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

  test('returns undefined on creation when several fields end with .name', () => {
    const summary = createSummary({ formData: { 'test.image.name': 'image', 'test.factory.name': 'created' } });

    expect(summary.getConnectionName()).toBeUndefined();
  });

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
    { description: 'container', flags: { containerProviderConnectionCreation: true }, expected: 'Test machine' },
    {
      description: 'Kubernetes',
      flags: { containerProviderConnectionCreation: false, kubernetesProviderConnectionCreation: true },
      expected: 'Test cluster',
    },
    {
      description: 'VM',
      flags: { containerProviderConnectionCreation: false, vmProviderConnectionCreation: true },
      expected: 'Test vm',
    },
    {
      description: 'container, when the provider creates several kinds of connection',
      flags: { containerProviderConnectionCreation: true, kubernetesProviderConnectionCreation: true },
      expected: 'Test machine',
    },
  ])('returns the display name of the $description creation', ({ flags, expected }) => {
    const summary = createSummary({ providerInfo: { ...providerInfo, ...flags } });

    expect(summary.getProviderDisplayName()).toBe(expected);
  });

  test('returns the provider name when the provider can not create connections', () => {
    const summary = createSummary({ providerInfo: { ...providerInfo, containerProviderConnectionCreation: false } });

    expect(summary.getProviderDisplayName()).toBe('test-provider');
  });

  test('returns the provider name when the provider does not define the display name', () => {
    const summary = createSummary({
      providerInfo: { ...providerInfo, containerProviderConnectionCreationDisplayName: undefined },
    });

    expect(summary.getProviderDisplayName()).toBe('test-provider');
  });
});

describe('getTitle', () => {
  test('returns the display name and created when a connection is created', () => {
    const summary = createSummary({ formData: { 'test.factory.name': 'created' } });

    expect(summary.getTitle('Creation')).toBe('Test machine created');
  });

  test('returns the display name and updated when a connection is edited', () => {
    const summary = createSummary({ connectionInfo: { name: 'edited' } });

    expect(summary.getTitle('Update')).toBe('Test machine updated');
  });

  test('uses the provider name without display name', () => {
    const summary = createSummary({
      providerInfo: { ...providerInfo, containerProviderConnectionCreationDisplayName: undefined },
      formData: { 'test.factory.name': 'created' },
    });

    expect(summary.getTitle('Creation')).toBe('test-provider created');
  });

  test('returns the operation label when the name of the connection is unknown', () => {
    expect(createSummary({ formData: {} }).getTitle('Creation')).toBe('Creation');
  });
});
