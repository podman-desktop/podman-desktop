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

import '@testing-library/jest-dom/vitest';

import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import BooleanEnumDisplay from './BooleanEnumDisplay.svelte';

describe('BooleanEnumDisplay', () => {
  test('should display first enum value when attrValue is false', () => {
    const props = {
      value: false,
      options: ['disabled', 'enabled'],
      ariaLabel: 'test.property',
    };

    const { getByText } = render(BooleanEnumDisplay, props);
    expect(getByText('disabled')).toBeInTheDocument();
  });

  test('should display second enum value when attrValue is true', () => {
    const props = {
      value: true,
      options: ['disabled', 'enabled'],
      ariaLabel: 'test.property',
    };

    const { getByText } = render(BooleanEnumDisplay, props);
    expect(getByText('enabled')).toBeInTheDocument();
  });

  test('should not render when enum has not 2 values', () => {
    const props = {
      value: true,
      options: ['only-one'],
      ariaLabel: 'test.property',
    };

    const { queryByText } = render(BooleanEnumDisplay, props);
    expect(queryByText('only-one')).not.toBeInTheDocument();
  });

  test('should include aria-label when provided', () => {
    const props = {
      value: true,
      options: ['rootless', 'rootful'],
      ariaLabel: 'Machine with root privileges: rootful',
    };

    const { getByLabelText } = render(BooleanEnumDisplay, props);
    expect(getByLabelText('Machine with root privileges: rootful')).toBeInTheDocument();
  });

  test('should use displayText as fallback for aria-label when aria-label is not provided', () => {
    const props = {
      value: false,
      options: ['rootless', 'rootful'],
    };

    const { getByLabelText } = render(BooleanEnumDisplay, props);
    expect(getByLabelText('rootless')).toBeInTheDocument();
  });
});
