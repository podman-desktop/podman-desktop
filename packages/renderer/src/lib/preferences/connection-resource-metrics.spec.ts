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

import { assert, describe, expect, test } from 'vitest';

import type { ConnectionResourceMetrics } from './connection-resource-metrics';
import { extractConnectionResourceMetrics, RESOURCE_FORMATS, toDisplayMetrics } from './connection-resource-metrics';
import type { IProviderConnectionConfigurationPropertyRecorded } from './Util';

function makeConfig(
  overrides: Partial<IProviderConnectionConfigurationPropertyRecorded> & { id: string },
): IProviderConnectionConfigurationPropertyRecorded {
  return {
    title: '',
    parentId: '',
    type: 'number',
    connection: 'machine1',
    providerId: 'provider1',
    ...overrides,
  };
}

describe('extractConnectionResourceMetrics', () => {
  test('returns undefined for empty configs', () => {
    expect(extractConnectionResourceMetrics([])).toBeUndefined();
  });

  test('returns undefined when all values are undefined', () => {
    const configs = [makeConfig({ id: 'podman.machine.cpus', format: 'cpu', value: undefined })];
    expect(extractConnectionResourceMetrics(configs)).toBeUndefined();
  });

  test('returns undefined when no resource formats are present', () => {
    const configs = [makeConfig({ id: 'podman.machine.rootful', format: 'boolean', value: true })];
    expect(extractConnectionResourceMetrics(configs)).toBeUndefined();
  });

  test('extracts CPU metrics with usage peer', () => {
    const configs = [
      makeConfig({ id: 'podman.machine.cpus', format: 'cpu', value: 4, description: 'CPUs' }),
      makeConfig({ id: 'podman.machine.cpusUsage', format: 'cpuUsage', value: 50 }),
    ];

    const result = extractConnectionResourceMetrics(configs);

    assert(result);
    expect(result.cpu).toEqual({
      total: 4,
      used: 2,
      usagePercent: 50,
      description: 'CPUs',
    });
  });

  test('extracts memory metrics with usage peer', () => {
    const configs = [
      makeConfig({
        id: 'podman.machine.memory',
        format: 'memory',
        value: 8_000_000_000,
        description: 'Memory',
      }),
      makeConfig({ id: 'podman.machine.memoryUsage', format: 'memoryUsage', value: 25 }),
    ];

    const result = extractConnectionResourceMetrics(configs);

    assert(result);
    expect(result.memory).toEqual({
      total: 8_000_000_000,
      used: 2_000_000_000,
      usagePercent: 25,
      description: 'Memory',
    });
  });

  test('extracts disk metrics with usage peer', () => {
    const configs = [
      makeConfig({
        id: 'podman.machine.diskSize',
        format: 'diskSize',
        value: 100_000_000_000,
        description: 'Disk size',
      }),
      makeConfig({ id: 'podman.machine.diskSizeUsage', format: 'diskSizeUsage', value: 40 }),
    ];

    const result = extractConnectionResourceMetrics(configs);

    assert(result);
    expect(result.disk).toEqual({
      total: 100_000_000_000,
      used: 40_000_000_000,
      usagePercent: 40,
      description: 'Disk size',
    });
  });

  test('extracts all three metrics together', () => {
    const configs = [
      makeConfig({ id: 'podman.machine.cpus', format: 'cpu', value: 8 }),
      makeConfig({ id: 'podman.machine.cpusUsage', format: 'cpuUsage', value: 75 }),
      makeConfig({ id: 'podman.machine.memory', format: 'memory', value: 16_000_000_000 }),
      makeConfig({ id: 'podman.machine.memoryUsage', format: 'memoryUsage', value: 50 }),
      makeConfig({ id: 'podman.machine.diskSize', format: 'diskSize', value: 200_000_000_000 }),
      makeConfig({ id: 'podman.machine.diskSizeUsage', format: 'diskSizeUsage', value: 30 }),
    ];

    const result = extractConnectionResourceMetrics(configs);

    assert(result);
    expect(result.cpu?.total).toBe(8);
    expect(result.cpu?.usagePercent).toBe(75);
    expect(result.memory?.total).toBe(16_000_000_000);
    expect(result.memory?.usagePercent).toBe(50);
    expect(result.disk?.total).toBe(200_000_000_000);
    expect(result.disk?.usagePercent).toBe(30);
  });

  test('handles missing usage peer gracefully', () => {
    const configs = [makeConfig({ id: 'podman.machine.cpus', format: 'cpu', value: 4, description: 'CPUs' })];

    const result = extractConnectionResourceMetrics(configs);

    assert(result);
    expect(result.cpu).toEqual({
      total: 4,
      used: 0,
      usagePercent: 0,
      description: 'CPUs',
    });
  });

  test('returns partial metrics when only some formats exist', () => {
    const configs = [
      makeConfig({ id: 'podman.machine.cpus', format: 'cpu', value: 2 }),
      makeConfig({ id: 'podman.machine.cpusUsage', format: 'cpuUsage', value: 10 }),
    ];

    const result = extractConnectionResourceMetrics(configs);

    assert(result);
    expect(result.cpu).toBeDefined();
    expect(result.memory).toBeUndefined();
    expect(result.disk).toBeUndefined();
  });
});

describe('toDisplayMetrics', () => {
  test('returns empty array for empty metrics', () => {
    const metrics: ConnectionResourceMetrics = {};
    expect(toDisplayMetrics(metrics)).toEqual([]);
  });

  test('formats CPU metric with raw number value', () => {
    const metrics: ConnectionResourceMetrics = {
      cpu: { total: 4, used: 2, usagePercent: 50, description: 'CPUs' },
    };

    const result = toDisplayMetrics(metrics);

    expect(result).toEqual([{ title: 'CPUs', value: 4, percent: 50 }]);
  });

  test('formats memory metric with filesize', () => {
    const metrics: ConnectionResourceMetrics = {
      memory: { total: 8_000_000_000, used: 2_000_000_000, usagePercent: 25, description: 'Memory' },
    };

    const result = toDisplayMetrics(metrics);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Memory');
    expect(result[0].value).toBe('8 GB');
    expect(result[0].percent).toBe(25);
  });

  test('formats disk metric with filesize', () => {
    const metrics: ConnectionResourceMetrics = {
      disk: { total: 100_000_000_000, used: 40_000_000_000, usagePercent: 40, description: 'Disk size' },
    };

    const result = toDisplayMetrics(metrics);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Disk size');
    expect(result[0].value).toBe('100 GB');
    expect(result[0].percent).toBe(40);
  });

  test('returns all three metrics in cpu/memory/disk order', () => {
    const metrics: ConnectionResourceMetrics = {
      cpu: { total: 8, used: 6, usagePercent: 75, description: 'CPUs' },
      memory: { total: 16_000_000_000, used: 8_000_000_000, usagePercent: 50, description: 'Memory' },
      disk: { total: 200_000_000_000, used: 60_000_000_000, usagePercent: 30, description: 'Disk size' },
    };

    const result = toDisplayMetrics(metrics);

    expect(result).toHaveLength(3);
    expect(result[0].title).toBe('CPUs');
    expect(result[0].value).toBe(8);
    expect(result[1].title).toBe('Memory');
    expect(result[1].value).toBe('16 GB');
    expect(result[2].title).toBe('Disk size');
    expect(result[2].value).toBe('200 GB');
  });

  test('returns partial results for partial metrics', () => {
    const metrics: ConnectionResourceMetrics = {
      cpu: { total: 2, used: 0.2, usagePercent: 10, description: 'CPUs' },
      disk: { total: 50_000_000_000, used: 5_000_000_000, usagePercent: 10, description: 'Disk size' },
    };

    const result = toDisplayMetrics(metrics);

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('CPUs');
    expect(result[1].title).toBe('Disk size');
  });
});

describe('RESOURCE_FORMATS', () => {
  test('contains all resource format types', () => {
    expect(RESOURCE_FORMATS).toContain('cpu');
    expect(RESOURCE_FORMATS).toContain('cpuUsage');
    expect(RESOURCE_FORMATS).toContain('memory');
    expect(RESOURCE_FORMATS).toContain('memoryUsage');
    expect(RESOURCE_FORMATS).toContain('diskSize');
    expect(RESOURCE_FORMATS).toContain('diskSizeUsage');
  });

  test('does not contain non-resource formats', () => {
    expect(RESOURCE_FORMATS).not.toContain('boolean');
    expect(RESOURCE_FORMATS).not.toContain('string');
  });
});
