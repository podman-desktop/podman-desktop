/**********************************************************************
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
 ***********************************************************************/

import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { IPCHandle } from '/@/plugin/api.js';

import { ContainerfileParser } from './containerfile-parser.js';

let containerFileParser: ContainerfileParser;

const ipcHandle = {} as unknown as IPCHandle;
beforeEach(() => {
  vi.resetAllMocks();
  containerFileParser = new ContainerfileParser(ipcHandle);
});

describe('Should parse info from container files', () => {
  test('should parse targets from casing.Containerfile', async () => {
    const info = await containerFileParser.parseContent(`
      from alpine as lower
      FROM alpine AS UPPER
      FrOm alpine aS MiXeD
    `);
    expect(info).toEqual({
      targets: ['lower', 'UPPER', 'MiXeD'],
    });
  });

  test('should parse targets from comments-and-empty-lines.Containerfile', async () => {
    const info = await containerFileParser.parseContent(`
      # This is a comment
      FROM alpine AS stage1

        # Another comment with indentation
      FROM stage1 AS stage2

      RUN echo "test"
    `);
    expect(info).toEqual({
      targets: ['stage1', 'stage2'],
    });
  });

  test('should parse targets from empty.Containerfile', async () => {
    const info = await containerFileParser.parseContent(`# Empty Containerfile`);
    expect(info).toEqual({
      targets: [],
    });
  });

  test('should parse targets from multiple-targets.Containerfile', async () => {
    const info = await containerFileParser.parseContent(`
      FROM alpine AS base
      RUN echo "hello"

      FROM base AS builder
      COPY . .
      RUN build

      FROM builder AS final
      CMD ["sh"]
    `);
    expect(info).toEqual({
      targets: ['base', 'builder', 'final'],
    });
  });

  test('should parse targets from single-target.Containerfile', async () => {
    const info = await containerFileParser.parseContent(`
      FROM alpine AS base
      RUN echo "hello"
      CMD ["sh"]
    `);
    expect(info).toEqual({
      targets: ['base'],
    });
  });

  test('should parse targets with some special characters', async () => {
    const info = await containerFileParser.parseContent(`
      FROM busybox as base
      ARG TARGETPLATFORM
      RUN echo $TARGETPLATFORM > /plt
      FROM --platform=\${TARGETPLATFORM} base AS base-target
      FROM --platform=$BUILDPLATFORM base AS base-build
    `);
    expect(info).toEqual({
      targets: ['base', 'base-target', 'base-build'],
    });
  });

  test('should throw error if file does not exist', async () => {
    await expect(containerFileParser.parseContainerFile('/tmp/nonexistent-Containerfile')).rejects.toThrow(
      'ENOENT: no such file or directory',
    );
  });
});
