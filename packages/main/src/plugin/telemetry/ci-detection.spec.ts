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

import { CIDetection } from './ci-detection.js';

class TestCIDetection extends CIDetection {
  public static getCIEnvironmentVariables(): readonly string[] {
    return TestCIDetection.CI_ENVIRONMENT_VARIABLES;
  }
}

let ciDetection: TestCIDetection;

beforeEach(() => {
  ciDetection = new TestCIDetection();
});

test('should not detect a CI environment if no variable is set', () => {
  expect(ciDetection.isCIEnvironment({})).toBeFalsy();
});

test('should not detect a CI environment if only unrelated variables are set', () => {
  expect(ciDetection.isCIEnvironment({ HOME: '/home/user', PATH: '/usr/bin' })).toBeFalsy();
});

test.each(TestCIDetection.getCIEnvironmentVariables())('should detect a CI environment with %s', name => {
  expect(ciDetection.isCIEnvironment({ [name]: 'true' })).toBeTruthy();
});

test('should detect a CI environment on a provider specific value', () => {
  expect(ciDetection.isCIEnvironment({ JENKINS_URL: 'https://jenkins.example.com/' })).toBeTruthy();
});

test.each(['', 'false', 'FALSE', '0'])('should not detect a CI environment if CI is set to %s', value => {
  expect(ciDetection.isCIEnvironment({ CI: value })).toBeFalsy();
});
