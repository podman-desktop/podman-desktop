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

import '@testing-library/jest-dom/vitest';

import { render } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import TroubleshootingIconStyle from './TroubleshootingIconStyle.svelte';

test('Expect style to be injected into document head', () => {
  render(TroubleshootingIconStyle);

  // Check that a style element was added to the head
  const styles = document.head.querySelectorAll('style');
  expect(styles.length).toBeGreaterThan(0);

  // Check that the troubleshooting-icon class is defined
  const styleContent = Array.from(styles)
    .map(style => style.textContent)
    .join('\n');

  expect(styleContent).toContain('.troubleshooting-icon');
  expect(styleContent).toContain('mask-image');
  expect(styleContent).toContain('background-color: currentColor');
});
