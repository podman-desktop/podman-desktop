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

import { beforeEach, expect, test } from 'vitest';

import { TelemetryEnvDetection } from './telemetry-env-detection.js';

let telemetryEnvDetection: TelemetryEnvDetection;

beforeEach(() => {
  telemetryEnvDetection = new TelemetryEnvDetection();
});

test('should not disable telemetry if the variable is not set', () => {
  expect(telemetryEnvDetection.isTelemetryDisabled({ HOME: '/home/user' })).toBeFalsy();
});

test.each(['1', 'true', 'TRUE', 'yes'])('should disable telemetry if the variable is set to %s', value => {
  expect(telemetryEnvDetection.isTelemetryDisabled({ PODMAN_DESKTOP_DISABLE_TELEMETRY: value })).toBeTruthy();
});

test.each(['', 'false', 'FALSE', '0'])('should not disable telemetry if the variable is set to %s', value => {
  expect(telemetryEnvDetection.isTelemetryDisabled({ PODMAN_DESKTOP_DISABLE_TELEMETRY: value })).toBeFalsy();
});
