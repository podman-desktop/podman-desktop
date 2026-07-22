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

import type { Stats } from 'node:fs';
import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import setup from './vitest-generate-api-global-setup.js';

vi.mock(import('node:fs/promises'), () => {
  const stat = vi.fn();
  const readFile = vi.fn();
  const writeFile = vi.fn();
  const mkdir = vi.fn();
  const copyFile = vi.fn();
  return {
    default: { stat, readFile, writeFile, mkdir, copyFile },
    stat,
    readFile,
    writeFile,
    mkdir,
    copyFile,
  };
});

// Minimal TypeScript declaration that exercises namespace + class extraction
const MOCK_EXTENSION_API_CONTENT = `
declare module '@podman-desktop/api' {
  export namespace commands {
    export function registerCommand(command: string): void;
    export function executeCommand<T>(command: string): Promise<T>;
    export const onDidExecuteCommand: string;
  }
  export class EventEmitter<T> {
    fire(data: T): void;
    dispose(): void;
  }
}
`;

const MOCK_TEMPLATE = '{{#namespaces}}{{name}} {{/namespaces}}{{#classes}}{{name}} {{/classes}}';

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(mkdir).mockResolvedValue(undefined);
  vi.mocked(copyFile).mockResolvedValue(undefined);
  vi.mocked(writeFile).mockResolvedValue(undefined);
});

describe('setup', () => {
  test('skips generation when output file is newer than all inputs', async () => {
    vi.mocked(stat)
      .mockResolvedValueOnce({ mtimeMs: 100 } as Stats) // extensionApiTypePath
      .mockResolvedValueOnce({ mtimeMs: 100 } as Stats) // templatePath
      .mockResolvedValueOnce({ mtimeMs: 100 } as Stats) // productJsonPath
      .mockResolvedValueOnce({ mtimeMs: 300 } as Stats) // apiGeneratedFile — newer
      .mockResolvedValueOnce({ mtimeMs: 300 } as Stats); // packageProductJsonPath

    await setup();

    expect(writeFile).not.toHaveBeenCalled();
    expect(mkdir).not.toHaveBeenCalled();
  });

  test('generates output when it does not exist yet', async () => {
    vi.mocked(stat)
      .mockResolvedValueOnce({ mtimeMs: 100 } as Stats) // extensionApiTypePath
      .mockResolvedValueOnce({ mtimeMs: 100 } as Stats) // templatePath
      .mockResolvedValueOnce({ mtimeMs: 100 } as Stats) // productJsonPath
      .mockRejectedValueOnce(Object.assign(new Error('ENOENT'), { code: 'ENOENT' })); // apiGeneratedFile missing

    vi.mocked(readFile)
      .mockResolvedValueOnce(MOCK_EXTENSION_API_CONTENT as unknown as Buffer)
      .mockResolvedValueOnce(MOCK_TEMPLATE as unknown as Buffer);

    await setup();

    expect(mkdir).toHaveBeenCalled();
    expect(copyFile).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalled();
    const [, writtenContent] = vi.mocked(writeFile).mock.calls[0];
    expect(String(writtenContent)).toContain('commands');
    expect(String(writtenContent)).toContain('EventEmitter');
  });

  test('regenerates output when it is older than the newest input', async () => {
    vi.mocked(stat)
      .mockResolvedValueOnce({ mtimeMs: 500 } as Stats) // extensionApiTypePath — newest input
      .mockResolvedValueOnce({ mtimeMs: 100 } as Stats) // templatePath
      .mockResolvedValueOnce({ mtimeMs: 100 } as Stats) // productJsonPath
      .mockResolvedValueOnce({ mtimeMs: 200 } as Stats) // apiGeneratedFile — stale
      .mockResolvedValueOnce({ mtimeMs: 200 } as Stats); // packageProductJsonPath

    vi.mocked(readFile)
      .mockResolvedValueOnce(MOCK_EXTENSION_API_CONTENT as unknown as Buffer)
      .mockResolvedValueOnce(MOCK_TEMPLATE as unknown as Buffer);

    await setup();

    expect(mkdir).toHaveBeenCalled();
    expect(copyFile).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalled();
  });
});
