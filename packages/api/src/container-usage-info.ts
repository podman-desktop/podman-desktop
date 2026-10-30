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

// CPU and memory used by a running container, as last read from its engine
export interface ContainerUsageInfo {
  engineId: string;
  containerId: string;
  // percentage of one CPU over the last refresh interval, over 100% when using several CPUs
  cpuPercentage?: number;
  // bytes of memory used, excluding the inactive page cache
  memoryUsage: number;
}
