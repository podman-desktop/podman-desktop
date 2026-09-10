/*********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
 ********************************************************************/

import { describe, expect, test } from 'vitest';

import {
  getBundledFileName,
  getBundledPodmanVersion,
  getBundledReleaseNotesHref,
  getBundledTagVersion,
} from './podman-bundled';

describe('getBundledPodmanVersion', () => {
  test('should return the bundled podman version', async () => {
    const version = getBundledPodmanVersion('darwin', 'arm64');
    expect(version).toBeTruthy();
    expect(version.startsWith('4')).toBeFalsy();
  });

  test('should throw for unknown platform', () => {
    expect(() => getBundledPodmanVersion('freebsd', 'x64')).toThrow('No bundled podman for platform freebsd');
  });

  test('should throw for unknown arch', () => {
    expect(() => getBundledPodmanVersion('darwin', 'mips')).toThrow('No bundled podman for darwin/mips');
  });
});

describe('getBundledReleaseNotesHref', () => {
  test('should return a valid release notes URL', () => {
    const href = getBundledReleaseNotesHref('darwin', 'arm64');
    expect(href).toContain('https://github.com/');
    expect(href).toContain('/releases/tag/');
  });
});

describe('getBundledFileName', () => {
  test('should return darwin x64 pkg filename', () => {
    const fileName = getBundledFileName('darwin', 'x64');
    expect(fileName).toContain('macos-amd64');
    expect(fileName).toMatch(/\.pkg$/);
  });

  test('should return darwin arm64 pkg filename', () => {
    const fileName = getBundledFileName('darwin', 'arm64');
    expect(fileName).toContain('macos-aarch64');
    expect(fileName).toMatch(/\.pkg$/);
  });

  test('should return win32 x64 msi filename', () => {
    const fileName = getBundledFileName('win32', 'x64');
    expect(fileName).toContain('windows-amd64');
    expect(fileName).toMatch(/\.msi$/);
  });
});

describe('getBundledTagVersion', () => {
  test('should return tag version starting with v', () => {
    const tagVersion = getBundledTagVersion('darwin', 'arm64');
    expect(tagVersion).toMatch(/^v\d+/);
  });
});
