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

import { writeFile } from 'node:fs/promises';

// Type definitions for Docusaurus sidebar items
interface DocSidebarItem {
  type: 'doc';
  id: string;
  label?: string;
}

interface CategorySidebarItem {
  type: 'category';
  label?: string;
  items: SidebarItem[];
}

type SidebarItem = DocSidebarItem | CategorySidebarItem;

interface NavigationItem {
  name: string;
  url: string;
}

/**
 * Extract navigation items from sidebar structure
 * @param items - Sidebar items from Docusaurus
 * @param baseUrl - Base URL for the site
 * @param section - Section type ('docs' or 'tutorial')
 * @returns Navigation items
 */
export function extractNavigationFromSidebar(
  items: SidebarItem[],
  baseUrl: string,
  section: 'docs' | 'tutorial' = 'docs',
): NavigationItem[] {
  const navItems: NavigationItem[] = [];

  items.forEach(item => {
    if (item.type === 'doc') {
      // Use the label (display name) instead of the id for better readability
      const rawName = item.label ?? item.id;
      if (!rawName) {
        return;
      }

      // Replace hashes with spaces and capitalize only the first letter of the whole name
      const processedName = rawName
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
        .trim() // Remove leading/trailing spaces
        .toLowerCase() // Convert to lowercase
        .replace(/\bai\b/g, 'AI'); // Keep "AI" capitalized (word boundary to avoid partial matches)

      let name = processedName.charAt(0).toUpperCase() + processedName.slice(1);

      // Handle tutorial index case - it should point to base /tutorial URL
      let url: string;
      if (section === 'tutorial' && item.id === 'index') {
        url = `${baseUrl}/tutorial`;
        name = 'Introduction';
      } else {
        url = `${baseUrl}/${section}/${item.id}`;
      }

      navItems.push({
        name: name,
        url: url,
      });
    } else if (item.type === 'category' && item.items) {
      // Recursively extract from categories
      navItems.push(...extractNavigationFromSidebar(item.items, baseUrl, section));
    }
  });

  return navItems;
}

/**
 * Generate JSON overview file for navigation
 * @param sidebarItems - Sidebar items from Docusaurus
 * @param section - Section type ('docs' or 'tutorial')
 * @param baseUrl - Base URL for the site
 * @param outputPath - Path to output the JSON file
 */
export async function generateJsonOverviewFile(
  sidebarItems: SidebarItem[],
  section: 'docs' | 'tutorial',
  baseUrl: string,
  outputPath: string,
): Promise<void> {
  const navItems = extractNavigationFromSidebar(sidebarItems, baseUrl, section);

  await writeFile(
    outputPath,
    JSON.stringify(navItems.toSorted((a: NavigationItem, b: NavigationItem) => a.name.localeCompare(b.name))),
  );
}
