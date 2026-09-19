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

import { stripPrompts } from './stripPrompts.js';

describe('stripPrompts', () => {
  test('strips $ prompt from a single line', () => {
    expect(stripPrompts('$ podman run nginx')).toBe('podman run nginx');
  });

  test('strips # prompt from a single line', () => {
    expect(stripPrompts('# dnf install podman')).toBe('dnf install podman');
  });

  test('strips > prompt from a single line', () => {
    expect(stripPrompts('> Get-Command podman')).toBe('Get-Command podman');
  });

  test('leaves code without prompts unchanged', () => {
    expect(stripPrompts('podman run nginx')).toBe('podman run nginx');
  });

  test('handles empty string', () => {
    expect(stripPrompts('')).toBe('');
  });

  test('only strips prompts at the start of a line', () => {
    expect(stripPrompts('echo "$ hello"')).toBe('echo "$ hello"');
  });

  test('strips $ prompt from each line in a multi-line block', () => {
    const input = '$ podman pull nginx\n$ podman run -d nginx';
    expect(stripPrompts(input)).toBe('podman pull nginx\npodman run -d nginx');
  });

  test('strips mixed prompt types across lines', () => {
    const input = '$ echo hello\n# echo world\n> echo test';
    expect(stripPrompts(input)).toBe('echo hello\necho world\necho test');
  });

  test('handles mixed lines with and without prompts', () => {
    const input = '$ podman pull nginx\nnginx:latest pulled\n$ podman run nginx';
    expect(stripPrompts(input)).toBe('podman pull nginx\nnginx:latest pulled\npodman run nginx');
  });
});
