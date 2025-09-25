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

import { inject, injectable } from 'inversify';

import { DocumentationInfo, DocumentationJsonInfo } from '/@api/documentation-info.js';

import { ApiSenderType } from '../api.js';
import { Disposable } from '../types/disposable.js';

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
    } catch (error) {
      console.error('Failed to fetch documentation at startup:', error);
      // Fallback to predefined documentation if fetching fails
      this.documentation = this.getFallbackDocumentation();
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

  private async fetchJsonContent(url: string): Promise<Array<{ name: string; url: string }> | null> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
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
    docsJson: DocumentationJsonInfo[],
    tutorialsJson: DocumentationJsonInfo[],
  ): DocumentationInfo[] {
    const documentation: DocumentationInfo[] = [];

    // Validate input parameters
    if (!docsJson || !tutorialsJson) {
      console.warn('Missing JSON content for parsing documentation');
      return this.getCoreDocumentationPages();
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
              id: `${config.category}-${this.generateId(item.name)}`,
              title: item.name,
              description: `${config.category}: ${item.name}`,
              url: item.url,
              category: config.category,
            });
          }
        }
      } catch (error) {
        console.error(config.errorMessage, error);
      }
    }

    // Remove duplicates and add core pages
    const corePages = this.getCoreDocumentationPages();
    return [...corePages, ...this.removeDuplicates(documentation)];
  }

  private getCoreDocumentationPages(): DocumentationInfo[] {
    return [
      {
        id: 'docs-intro',
        title: 'Introduction & Getting Started',
        description: 'Learn the basics of Podman Desktop',
        url: 'https://podman-desktop.io/docs/intro',
        category: 'Documentation',
      },
      {
        id: 'tutorial-index',
        title: 'Tutorials & Guides',
        description: 'Step-by-step tutorials for common tasks',
        url: 'https://podman-desktop.io/tutorial',
        category: 'Tutorial',
      },
    ];
  }

  private getFallbackDocumentation(): DocumentationInfo[] {
    return [
      {
        id: 'docs-intro',
        title: 'Introduction & Getting Started',
        description: 'Learn the basics of Podman Desktop',
        url: 'https://podman-desktop.io/docs/intro',
        category: 'Documentation',
      },
      {
        id: 'tutorial-index',
        title: 'Tutorials & Guides',
        description: 'Step-by-step tutorials for common tasks',
        url: 'https://podman-desktop.io/tutorial',
        category: 'Tutorial',
      },
      {
        id: 'docs-containers',
        title: 'Containers Documentation',
        description: 'Working with containers, images, and pods',
        url: 'https://podman-desktop.io/docs/containers',
        category: 'Documentation',
      },
      {
        id: 'docs-kubernetes',
        title: 'Kubernetes Documentation',
        description: 'Deploy and manage Kubernetes applications',
        url: 'https://podman-desktop.io/docs/kubernetes',
        category: 'Documentation',
      },
      {
        id: 'docs-extensions',
        title: 'Extensions Development',
        description: 'Create and develop extensions',
        url: 'https://podman-desktop.io/docs/extensions/developing',
        category: 'Documentation',
      },
      {
        id: 'docs-troubleshooting',
        title: 'Troubleshooting Guide',
        description: 'Solve common issues and problems',
        url: 'https://podman-desktop.io/docs/troubleshooting',
        category: 'Documentation',
      },
    ];
  }

  private removeDuplicates(items: DocumentationInfo[]): DocumentationInfo[] {
    if (!items || items.length === 0) {
      return [];
    }

    const seen = new Set<string>();
    return items.filter(item => {
      if (!item?.url || !item.title) {
        return false;
      }

      const key = `${item.url}-${item.title}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private generateId(title: string): string {
    if (!title || typeof title !== 'string') {
      return 'unknown-' + Date.now();
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .trim() // Ensure no leading/trailing whitespace
      .split(/\s+/) // Split by spaces
      .filter(word => word.length > 0) // Remove empty strings
      .join('-') // Join with dashes
      .substring(0, 50);

    // Ensure slug doesn't end with a dash (only case where trailing dash could occur)
    return slug.endsWith('-') ? slug.slice(0, -1) : slug || 'doc-' + Date.now();
  }
}
