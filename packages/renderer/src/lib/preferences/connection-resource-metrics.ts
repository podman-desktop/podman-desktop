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

import { filesize } from 'filesize';

import { PeerProperties } from './PeerProperties';
import type { IProviderConnectionConfigurationPropertyRecorded } from './Util';

export interface ConnectionResourceMetric {
  total: number;
  used: number;
  usagePercent: number;
  description?: string;
}

export interface ConnectionResourceMetrics {
  cpu?: ConnectionResourceMetric;
  memory?: ConnectionResourceMetric;
  disk?: ConnectionResourceMetric;
}

export const RESOURCE_FORMATS = new Set(['cpu', 'cpuUsage', 'memory', 'memoryUsage', 'diskSize', 'diskSizeUsage']);

function extractMetric(
  format: string,
  connectionConfigs: IProviderConnectionConfigurationPropertyRecorded[],
  peerProperties: PeerProperties,
): ConnectionResourceMetric | undefined {
  const config = connectionConfigs.find(c => c.format === format);
  if (!config) return undefined;

  const usagePercent = peerProperties.getPeerProperty(config.id, connectionConfigs) ?? 0;
  const total = config.value ?? 0;
  const used = total > 0 && usagePercent > 0 ? (usagePercent / 100) * total : 0;

  return {
    total,
    used,
    usagePercent: typeof usagePercent === 'number' ? usagePercent : 0,
    description: config.description,
  };
}

export function extractConnectionResourceMetrics(
  configs: IProviderConnectionConfigurationPropertyRecorded[],
): ConnectionResourceMetrics | undefined {
  const connectionConfigs = configs.filter(config => config.value !== undefined);
  if (connectionConfigs.length === 0) return undefined;

  const peerProperties = new PeerProperties();

  const cpu = extractMetric('cpu', connectionConfigs, peerProperties);
  const memory = extractMetric('memory', connectionConfigs, peerProperties);
  const disk = extractMetric('diskSize', connectionConfigs, peerProperties);

  if (!cpu && !memory && !disk) return undefined;

  return { cpu, memory, disk };
}

export interface ConnectionResourceMetricDisplay {
  title?: string;
  value: string | number;
  percent: number;
}

export function toDisplayMetrics(metrics: ConnectionResourceMetrics): ConnectionResourceMetricDisplay[] {
  const entries: ConnectionResourceMetricDisplay[] = [];
  if (metrics.cpu) {
    entries.push({ title: metrics.cpu.description, value: metrics.cpu.total, percent: metrics.cpu.usagePercent });
  }
  if (metrics.memory) {
    entries.push({
      title: metrics.memory.description,
      value: filesize(metrics.memory.total),
      percent: metrics.memory.usagePercent,
    });
  }
  if (metrics.disk) {
    entries.push({
      title: metrics.disk.description,
      value: filesize(metrics.disk.total),
      percent: metrics.disk.usagePercent,
    });
  }
  return entries;
}
