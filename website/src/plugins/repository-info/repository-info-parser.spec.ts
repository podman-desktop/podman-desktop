/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import { RepositoryInfoParser } from './repository-info-parser.js';

describe('RepositoryInfoParser', () => {
  test('should correctly extract owner and repository from a standard GitHub URL', () => {
    const url = 'https://github.com/podman-desktop/podman-desktop';
    const parser = new RepositoryInfoParser(url);

    expect(parser.owner).toBe('podman-desktop');
    expect(parser.repository).toBe('podman-desktop');
  });

  test('should correctly parse a URL with the .git suffix', () => {
    const url = 'https://github.com/some-user/another-repo.git';
    const parser = new RepositoryInfoParser(url);

    expect(parser.owner).toBe('some-user');
    expect(parser.repository).toBe('another-repo');
  });

  test('should throw an error for a non-GitHub repository URL', () => {
    const url = 'https://gitlab.com/foo/bar';

    // Check that the constructor throws the expected error.
    expect(() => new RepositoryInfoParser(url)).toThrow(
      'Repository type is not GitHub. Detected type: gitlab. URL: https://gitlab.com/foo/bar',
    );
  });

  test('should throw an error for an unparseable repository URL', () => {
    const url = 'this is not a valid url';

    expect(() => new RepositoryInfoParser(url)).toThrow(`Could not parse repository information from URL: ${url}`);
  });

  test('should throw an error for a missing or undefined URL', () => {
    // We pass undefined to simulate a missing repository field in package.json
    expect(() => new RepositoryInfoParser(undefined as unknown as string)).toThrow(
      'Could not parse repository information from URL: undefined',
    );
  });
});
