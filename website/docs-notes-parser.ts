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

import fs from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Helper function to extract the title from markdown front matter
 * @param frontMatter - The front matter content
 * @returns The cleaned title value or undefined if not found
 */
function extractTitle(frontMatter: string): string | undefined {
  const match = /^title:\s*(.{1,200})$/m.exec(frontMatter);
  return match ? match[1].replace(/['"]/g, '').trim() : undefined;
}

/**
 * Helper function to generate URL slug from file path
 * @param fullPath - The full file path
 * @returns The URL slug for the documentation page
 */
function generateSlug(fullPath: string): string {
  // First normalize all path separators to forward slashes
  let slug = fullPath.replace(/\\/g, '/');

  // Then remove prefixes and suffixes
  slug = slug
    .replace(/^docs\//, '') // Remove 'docs/' prefix
    .replace(/\.md$/, '') // Remove '.md' extension
    .replace(/\/index$/, ''); // Remove '/index' suffix

  // Handle root index file
  if (slug === 'index') slug = '';

  return slug;
}

/**
 * Creates a JSON file containing all documentation entries with their titles and URLs
 * Recursively scans the docs directory for markdown files and extracts metadata from front matter
 */
export async function createJsonDocsFile(): Promise<void> {
  const docsDir = './docs';
  const outputFile = './static/docs.json';

  // Exit early if docs directory doesn't exist
  if (!fs.existsSync(docsDir)) {
    return;
  }

  const docEntries: { name: string; url: string }[] = [];

  // Recursively walk through all directories and collect doc entries
  await walkDirectory(docsDir, docEntries);

  // Sort entries alphabetically by name and write to JSON file
  docEntries.sort((a, b) => a.name.localeCompare(b.name));
  await writeFile(outputFile, JSON.stringify(docEntries));
}

/**
 * Recursively walks through a directory to find and process markdown files
 * @param dir - Directory to walk through
 * @param entries - Array to collect documentation entries
 */
async function walkDirectory(dir: string, entries: { name: string; url: string }[]): Promise<void> {
  const items = await readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory() && item.name !== 'img') {
      // Recursively process subdirectories, but skip image directories
      await walkDirectory(fullPath, entries);
    } else if (item.isFile() && item.name.endsWith('.md')) {
      // Process markdown files
      const content = await readFile(fullPath, 'utf-8');

      const frontMatterMatch = /^---\n([\s\S]*?)\n---/.exec(content);

      if (!frontMatterMatch) {
        continue; // Skip files without front matter
      }

      const frontMatter = frontMatterMatch[1];
      const title = extractTitle(frontMatter);

      // Only add entries that have a title
      if (title) {
        // Generate URL slug from file path since docs don't have custom slugs
        const slug = generateSlug(fullPath);
        const url = `https://podman-desktop.io/docs/${slug}`;
        entries.push({ name: title, url });
      }
    }
  }
}
