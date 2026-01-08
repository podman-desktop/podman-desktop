/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import type { Preview } from '@storybook/svelte-vite';
import { createElement } from 'react';
import { themes } from 'storybook/theming';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import './main.css';
import './themes.css';

let theme: 'dark' | 'light' = 'light';

// Theme logic here (runs in iframe context)
const applyTheme = () => {
  try {
    const isEmbedded = window.parent !== window;
    let parentTheme: string | undefined;
    if (isEmbedded) {
      parentTheme = window.parent.document.documentElement.dataset.theme;
      if (parentTheme === 'dark' || parentTheme === 'light') {
        theme = parentTheme;
      }
    }
    if (!parentTheme) {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = isDark ? 'dark' : 'light';
    }
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
  } catch (err) {
    console.warn('Theme detection failed:', err);
  }
};
applyTheme();

// Watch for changes if embedded
if (window.parent !== window) {
  try {
    const observer = new MutationObserver(applyTheme);
    observer.observe(window.parent.document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Disconnect on iframe unload
    window.parent.addEventListener('unload', () => {
      observer.disconnect();
    });
  } catch (err) {
    console.warn('Could not observe parent for theme changes:', err);
  }
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      container: props => {
        const currentProps = { ...props };
        currentProps.theme = theme === 'light' ? themes.light : themes.dark;
        return createElement(DocsContainer, currentProps);
      },
    },
    a11y: {
      config: {
        rules: [
          {
            // Disable region rule for component stories as they are isolated components
            id: 'region',
            enabled: false,
          },
        ],
      },
    },
  },
};

export default preview;
