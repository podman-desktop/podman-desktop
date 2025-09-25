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

import { createJsonTutorialFile } from './tutorial-notes-parser';

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

const mockTutorialContent = `---
title: Creating an extension
slug: creating-an-extension
---

# Creating an extension

This tutorial shows how to create a Podman Desktop extension.`;

const mockTutorialWithoutSlug = `---
title: Running a Kubernetes cluster
---

# Running a Kubernetes cluster

Learn how to run a Kubernetes cluster with Podman Desktop.`;

const expectedTutorialsJson = [
  {
    name: 'Creating an extension',
    url: 'https://podman-desktop.io/tutorial/creating-an-extension',
  },
  {
    name: 'Running a Kubernetes cluster',
    url: 'https://podman-desktop.io/tutorial/running-a-kubernetes-cluster',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mocks.existsSyncMock.mockReturnValue(true);
  mocks.readdirMock.mockResolvedValue([
    { name: 'creating-an-extension.md', isDirectory: (): boolean => false, isFile: (): boolean => true },
    { name: 'running-a-kubernetes-cluster.md', isDirectory: (): boolean => false, isFile: (): boolean => true },
    { name: 'index.md', isDirectory: (): boolean => false, isFile: (): boolean => true },
    { name: 'img', isDirectory: (): boolean => true, isFile: (): boolean => false },
  ]);
  mocks.readFileMock.mockResolvedValueOnce(mockTutorialContent).mockResolvedValueOnce(mockTutorialWithoutSlug);
});

test('create tutorials.json when tutorial directory exists', async () => {
  await createJsonTutorialFile();
  expect(mocks.writeFileMock).toHaveBeenCalledWith('./static/tutorials.json', JSON.stringify(expectedTutorialsJson));
});

test('skip generation when tutorial directory does not exist', async () => {
  mocks.existsSyncMock.mockReturnValue(false);
  await createJsonTutorialFile();
  expect(mocks.writeFileMock).not.toHaveBeenCalled();
});

test('parse tutorials with title and derive slug from filename when not provided', async () => {
  await createJsonTutorialFile();
  expect(mocks.readFileMock).toHaveBeenCalledTimes(2);
  expect(mocks.writeFileMock).toHaveBeenCalledWith('./static/tutorials.json', JSON.stringify(expectedTutorialsJson));
});
