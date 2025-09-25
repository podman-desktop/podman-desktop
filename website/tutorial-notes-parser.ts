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
 * Creates a JSON file containing all tutorial entries with their titles and URLs
 * Scans the tutorial directory for markdown files and extracts metadata from front matter
 */
export async function createJsonTutorialFile(): Promise<void> {
  const tutorialDir = './tutorial';
  const outputFile = './static/tutorials.json';

  // Exit early if tutorial directory doesn't exist
  if (!fs.existsSync(tutorialDir)) {
    return;
  }

  const tutorialEntries: { name: string; url: string }[] = [];

  // Read all items in the tutorial directory
  const items = await readdir(tutorialDir, { withFileTypes: true });

  for (const item of items) {
    // Process only markdown files, excluding index.md
    if (!item.isFile() || !item.name.endsWith('.md') || item.name === 'index.md') {
      continue;
    }

    const fullPath = path.join(tutorialDir, item.name);
    const content = await readFile(fullPath, 'utf-8');

    // Extract front matter from markdown (content between --- delimiters)
    const frontMatterMatch = /^---\n([\s\S]*?)\n---/.exec(content);

    if (!frontMatterMatch) {
      continue; // Skip files without front matter
    }

    const frontMatter = frontMatterMatch[1];

    // Extract title from front matter
    const title = extractTitle(frontMatter);

    // Only add entries that have a title
    if (title) {
      // Use filename (without .md) as the URL slug since tutorials don't have custom slugs
      const slug = path.basename(fullPath, '.md');
      const url = `https://podman-desktop.io/tutorial/${slug}`;
      tutorialEntries.push({ name: title, url });
    }
  }

  // Sort entries alphabetically by name and write to JSON file
  tutorialEntries.sort((a, b) => a.name.localeCompare(b.name));
  await writeFile(outputFile, JSON.stringify(tutorialEntries));
}
