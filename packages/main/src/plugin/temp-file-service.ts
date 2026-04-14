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

import { unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { IAsyncDisposable } from '@podman-desktop/core-api';
import { injectable, preDestroy } from 'inversify';

/**
 * Service for managing temporary files (YAML, configuration files, etc.)
 */
@injectable()
export class TempFileService implements IAsyncDisposable {
  private tempFiles: Set<string> = new Set();

  @preDestroy()
  async asyncDispose(): Promise<void> {
    await this.cleanup();
  }

  /**
   * Creates a temporary file with the provided content
   * @param content The content to write to the temporary file
   * @param extension Optional file extension (default: 'yaml')
   * @returns The path to the created temporary file
   */
  async createTempFile(content: string, extension: string = 'yaml'): Promise<string> {
    const tempDir = tmpdir();
    const tempFileName = `temp-${new Date().getTime()}.${extension}`;
    const tempFilePath = join(tempDir, tempFileName);

    await writeFile(tempFilePath, content, 'utf-8');

    // Track the temporary file for cleanup
    this.tempFiles.add(tempFilePath);

    return tempFilePath;
  }

  /**
   * Removes a temporary file
   * @param filePath The path to the temporary file to remove
   */
  async removeTempFile(filePath: string): Promise<void> {
    try {
      if (this.tempFiles.has(filePath)) {
        await unlink(filePath);
        this.tempFiles.delete(filePath);
      }
    } catch (error: unknown) {
      // File might already be deleted, log but don't throw
      console.warn(`Failed to remove temporary file ${filePath}:`, error);
    }
  }

  /**
   * Cleanup all tracked temporary files
   */
  async cleanup(): Promise<void> {
    const cleanupPromises = Array.from(this.tempFiles).map(filePath => this.removeTempFile(filePath));
    await Promise.allSettled(cleanupPromises);
  }

  /**
   * Get the list of currently tracked temporary files
   */
  protected getTempFiles(): string[] {
    return Array.from(this.tempFiles);
  }
}
