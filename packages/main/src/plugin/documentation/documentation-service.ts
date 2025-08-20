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

import { DocumentationInfo } from '/@api/documentation-info.js';

import { ApiSenderType } from '../api.js';

@injectable()
export class DocumentationService {
  private documentation: DocumentationInfo[] = [];
  private isInitialized = false;

  constructor(
    @inject(ApiSenderType)
    private apiSender: ApiSenderType,
  ) {}

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const [docsContent, tutorialContent] = await Promise.all([
        this.fetchPageContent('https://podman-desktop.io/docs/intro'),
        this.fetchPageContent('https://podman-desktop.io/tutorial'),
      ]);

      if (docsContent && tutorialContent) {
        this.documentation = this.parseDocumentationContent(docsContent, tutorialContent);
      } else {
        throw new Error('Failed to fetch documentation content');
      }
    } catch (error) {
      console.error('Failed to fetch documentation at startup:', error);
      // Fallback to predefined documentation if fetching fails
      this.documentation = this.getFallbackDocumentation();
    }

    this.isInitialized = true;
  }

  async getDocumentationItems(): Promise<DocumentationInfo[]> {
    if (!this.isInitialized) {
      await this.init();
    }
    return this.documentation;
  }

  async refreshDocumentation(): Promise<void> {
    // Simply re-initialize
    this.isInitialized = false;
    await this.init();
    this.apiSender.send('documentation-updated');
  }

  private async fetchPageContent(url: string): Promise<string> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
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

  private parseDocumentationContent(docsHtml: string, tutorialHtml: string): DocumentationInfo[] {
    const documentation: DocumentationInfo[] = [];

    // Validate input parameters
    if (!docsHtml || !tutorialHtml) {
      console.warn('Missing HTML content for parsing documentation');
      return this.getCoreDocumentationPages();
    }

    // Parse both docs and tutorials using the same logic
    const parseConfigs = [
      {
        html: docsHtml,
        regex: /<a[^>]*href="([^"]*\/docs\/[^"]*)"[^>]*>([^<]+)<\/a>/g,
        category: 'Documentation',
        errorMessage: 'Error parsing documentation links:',
      },
      {
        html: tutorialHtml,
        regex: /<a[^>]*href="([^"]*\/tutorial\/[^"]*)"[^>]*>([^<]+)<\/a>/g,
        category: 'Tutorial',
        errorMessage: 'Error parsing tutorial links:',
      },
    ];

    for (const config of parseConfigs) {
      try {
        const matches = Array.from(config.html.matchAll(config.regex));

        for (const match of matches) {
          if (match && match.length >= 3 && match[1] && match[2]) {
            const url = match[1].startsWith('http') ? match[1] : `https://podman-desktop.io${match[1]}`;
            const title = match[2].trim();

            if (title && title.length > 0 && !title.includes('Edit this page') && !title.includes('Next')) {
              documentation.push({
                id: `${config.category}-${this.generateId(title)}`,
                title,
                description: `${config.category}: ${title}`,
                url,
                category: config.category,
              });
            }
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
