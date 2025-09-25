/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { beforeEach, expect, test, vi } from 'vitest';

import { createJsonDocsFile } from './docs-notes-parser';

const mocks = vi.hoisted(() => ({
  existsSyncMock: vi.fn(),
  readdirMock: vi.fn(),
  readFileMock: vi.fn(),
  writeFileMock: vi.fn(),
}));

vi.mock('node:fs', () => {
  return {
    default: {
      existsSync: mocks.existsSyncMock,
    },
  };
});

vi.mock('node:fs/promises', () => {
  return {
    readdir: mocks.readdirMock,
    readFile: mocks.readFileMock,
    writeFile: mocks.writeFileMock,
  };
});

const mockDocContent = `---
title: Installation
slug: installation
---

# Installation

This is a guide for installing Podman Desktop.`;

const mockIntroContent = `---
title: Introduction
---

# Introduction

Welcome to Podman Desktop documentation.`;

const expectedDocsJson = [
  {
    name: 'Installation',
    url: 'https://podman-desktop.io/docs/installation',
  },
  {
    name: 'Introduction',
    url: 'https://podman-desktop.io/docs/intro',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mocks.existsSyncMock.mockReturnValue(true);
  mocks.readdirMock.mockResolvedValue([
    { name: 'installation.md', isDirectory: (): boolean => false, isFile: (): boolean => true },
    { name: 'intro.md', isDirectory: (): boolean => false, isFile: (): boolean => true },
    { name: 'img', isDirectory: (): boolean => true, isFile: (): boolean => false },
  ]);
  mocks.readFileMock.mockResolvedValueOnce(mockDocContent).mockResolvedValueOnce(mockIntroContent);
});

test('create docs.json when docs directory exists', async () => {
  await createJsonDocsFile();
  expect(mocks.writeFileMock).toHaveBeenCalledWith('./static/docs.json', JSON.stringify(expectedDocsJson));
});

test('skip generation when docs directory does not exist', async () => {
  mocks.existsSyncMock.mockReturnValue(false);
  await createJsonDocsFile();
  expect(mocks.writeFileMock).not.toHaveBeenCalled();
});

test('parse docs with title and slug from front matter', async () => {
  await createJsonDocsFile();
  expect(mocks.readFileMock).toHaveBeenCalledTimes(2);
  expect(mocks.writeFileMock).toHaveBeenCalledWith('./static/docs.json', JSON.stringify(expectedDocsJson));
});
