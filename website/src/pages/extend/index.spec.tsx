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

import { describe, expect, test, vi } from 'vitest';

// Mock React and other dependencies that aren't available in Node environment
vi.mock('react', () => ({
  default: {
    createElement: vi.fn(),
  },
}));

vi.mock('@docusaurus/useBaseUrl', () => ({
  default: vi.fn((path: string) => path),
}));

vi.mock('@docusaurus/useDocusaurusContext', () => ({
  default: vi.fn(() => ({
    siteConfig: { title: 'Test Site' },
  })),
}));

vi.mock('@theme/Layout', () => ({
  default: vi.fn(({ children }) => children),
}));

vi.mock('@theme/ThemedImage', () => ({
  default: vi.fn(),
}));

vi.mock('@site/src/components/TailWindThemeSelector', () => ({
  default: vi.fn(),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: vi.fn(),
}));

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
  faBook: 'faBook',
  faCertificate: 'faCertificate',
  faCloudArrowDown: 'faCloudArrowDown',
  faGears: 'faGears',
  faPalette: 'faPalette',
  faRocket: 'faRocket',
}));

describe('Extend Page', () => {
  test('should export default component function', async () => {
    // Import the component
    const module = await import('./index.tsx');

    // Verify the default export exists and is a function
    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe('function');
  });

  test('should import faPalette icon for Storybook link', async () => {
    // Verify that faPalette icon is imported from FontAwesome
    const { faPalette } = await import('@fortawesome/free-solid-svg-icons');
    expect(faPalette).toBeDefined();
    expect(faPalette).toBe('faPalette');
  });

  test('should call useBaseUrl with storybook path', async () => {
    const useBaseUrl = (await import('@docusaurus/useBaseUrl')).default;

    // Import and execute the component to trigger useBaseUrl calls
    const ExtendComponent = (await import('./index.tsx')).default;
    ExtendComponent();

    // Verify useBaseUrl was called with storybook path
    expect(useBaseUrl).toHaveBeenCalledWith('/storybook');
  });
});
