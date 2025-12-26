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

import { createHash } from 'node:crypto';

import { inject, injectable } from 'inversify';

import fallbackDocumentation from '/@/assets/fallback-documentation.json' with { type: 'json' };
import { ApiSenderType } from '/@/plugin/api.js';
import { Disposable } from '/@/plugin/types/disposable.js';
import { DocumentationBaseInfo, DocumentationInfo } from '/@api/documentation-info.js';

@injectable()
export class DocumentationService extends Disposable {
  private documentation: DocumentationInfo[] = [];
  private isInitialized = false;

  constructor(
    @inject(ApiSenderType)
    private apiSender: ApiSenderType,
  ) {
    super(() => {
      this.documentation = [];
      this.isInitialized = false;
    });
  }

  async fetchDocumentation(): Promise<void> {
    try {
      const [docsJson, tutorialsJson] = await Promise.all([
        this.fetchJsonContent('https://podman-desktop.io/docs.json'),
        this.fetchJsonContent('https://podman-desktop.io/tutorials.json'),
      ]);

      if (docsJson && tutorialsJson) {
        this.documentation = this.parseDocumentationFromJson(docsJson, tutorialsJson);
      } else {
        throw new Error('Failed to fetch documentation JSON files');
      }
      this.isInitialized = true;
    } catch (error: unknown) {
      console.error('Failed to fetch documentation at startup:', error);
      // Fallback to predefined documentation if fetching fails
      this.documentation = fallbackDocumentation as DocumentationInfo[];
      this.isInitialized = true;
    }
  }

  async getDocumentationItems(): Promise<DocumentationInfo[]> {
    if (!this.isInitialized) {
      await this.fetchDocumentation();
    }
    return this.documentation;
  }

  async refreshDocumentation(): Promise<void> {
    this.isInitialized = false; // Force re-fetch
    await this.fetchDocumentation();
    this.apiSender.send('documentation-updated');
  }

  private async fetchJsonContent(url: string): Promise<DocumentationBaseInfo[]> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      if (!Array.isArray(json)) {
        throw new Error(`Invalid JSON format for ${url}`);
      }
      return json;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout while fetching ${url}`);
        }
        throw new Error(`Failed to fetch ${url}: ${error.message}`);
      }
      throw new Error(`Failed to fetch ${url}: Unknown error`);
    }
  }

  private parseDocumentationFromJson(
    docsJson: DocumentationBaseInfo[],
    tutorialsJson: DocumentationBaseInfo[],
  ): DocumentationInfo[] {
    const documentation: DocumentationInfo[] = [];

    // Validate input parameters
    if (!docsJson || !tutorialsJson) {
      console.warn('Missing JSON content for parsing documentation');
      return fallbackDocumentation as DocumentationInfo[];
    }

    // Parse both docs and tutorials using generic logic
    const parseConfigs = [
      {
        data: docsJson,
        category: 'Documentation',
        errorMessage: 'Error parsing documentation JSON:',
      },
      {
        data: tutorialsJson,
        category: 'Tutorial',
        errorMessage: 'Error parsing tutorials JSON:',
      },
    ];

    for (const config of parseConfigs) {
      try {
        for (const item of config.data) {
          if (item.name && item.url) {
            documentation.push({
              id: createHash('sha256').update(item.name).digest('hex'),
              name: item.name,
              description: `${config.category}: ${item.name}`,
              url: item.url,
              category: config.category,
            });
          }
        }
      } catch (error: unknown) {
        console.error(config.errorMessage, error);
      }
    }

    // If no documentation was parsed, use fallback
    if (documentation.length === 0) {
      console.error('DocumentationService: No items parsed, using fallback documentation');
      return fallbackDocumentation as DocumentationInfo[];
    }

    return documentation;
  }
}
