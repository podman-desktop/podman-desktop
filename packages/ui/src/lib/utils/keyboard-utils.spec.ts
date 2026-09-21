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

import { describe, expect, test } from 'vitest';

import { KeyboardUtils } from './keyboard-utils';

const keyboardUtils = new KeyboardUtils();

describe('isValidAriaKeyShortcuts', () => {
  test('accepts single modifier+key shortcuts', () => {
    expect(keyboardUtils.isValidAriaKeyShortcuts('Control+ArrowLeft')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Meta+ArrowLeft')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Shift+Delete')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Alt+F4')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('AltGraph+E')).toBeTruthy();
  });

  test('accepts case-insensitive modifiers', () => {
    expect(keyboardUtils.isValidAriaKeyShortcuts('control+ArrowLeft')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('CONTROL+ArrowLeft')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('meta+arrowleft')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('SHIFT+DELETE')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('alt+f4')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('altgraph+e')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Control+Shift+F')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('control+shift+f')).toBeTruthy();
  });

  test('accepts multiple space-separated shortcuts', () => {
    expect(keyboardUtils.isValidAriaKeyShortcuts('Control+ArrowLeft Meta+ArrowLeft')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Control+ArrowUp Control+ArrowDown')).toBeTruthy();
  });

  test('accepts multiple modifiers in a single shortcut', () => {
    expect(keyboardUtils.isValidAriaKeyShortcuts('Shift+Alt+Delete')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Control+Shift+F')).toBeTruthy();
  });

  test('rejects shortcuts without a key', () => {
    expect(keyboardUtils.isValidAriaKeyShortcuts('Control+')).toBeFalsy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Meta+')).toBeFalsy();
  });

  test('rejects shortcuts without a modifier', () => {
    expect(keyboardUtils.isValidAriaKeyShortcuts('ArrowLeft')).toBeFalsy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Delete')).toBeFalsy();
  });

  test('rejects invalid modifiers', () => {
    expect(keyboardUtils.isValidAriaKeyShortcuts('Cmd+ArrowLeft')).toBeFalsy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Ctrl+ArrowLeft')).toBeFalsy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Invalid+Key')).toBeFalsy();
  });

  test('rejects empty or undefined values', () => {
    expect(keyboardUtils.isValidAriaKeyShortcuts('')).toBeFalsy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('   ')).toBeFalsy();
    expect(keyboardUtils.isValidAriaKeyShortcuts(undefined)).toBeFalsy();
  });

  test('rejects non-string values', () => {
    expect(keyboardUtils.isValidAriaKeyShortcuts(123 as unknown as string)).toBeFalsy();
    expect(keyboardUtils.isValidAriaKeyShortcuts(null as unknown as string)).toBeFalsy();
    expect(keyboardUtils.isValidAriaKeyShortcuts({} as unknown as string)).toBeFalsy();
  });

  test('handles extra whitespace gracefully', () => {
    expect(keyboardUtils.isValidAriaKeyShortcuts('  Control+ArrowLeft  ')).toBeTruthy();
    expect(keyboardUtils.isValidAriaKeyShortcuts('Control+ArrowLeft  Meta+ArrowLeft')).toBeTruthy();
  });
});

describe('sanitizeAriaKeyShortcuts', () => {
  test('preserves valid shortcuts', () => {
    expect(keyboardUtils.sanitizeAriaKeyShortcuts('Control+ArrowLeft')).toBe('Control+ArrowLeft');
    expect(keyboardUtils.sanitizeAriaKeyShortcuts('Control+ArrowLeft Meta+ArrowLeft')).toBe(
      'Control+ArrowLeft Meta+ArrowLeft',
    );
  });

  test('filters out invalid shortcuts', () => {
    expect(keyboardUtils.sanitizeAriaKeyShortcuts('Control+ArrowLeft Invalid+Key')).toBe('Control+ArrowLeft');
    expect(keyboardUtils.sanitizeAriaKeyShortcuts('Cmd+A Control+B')).toBe('Control+B');
  });

  test('returns undefined when all shortcuts are invalid', () => {
    expect(keyboardUtils.sanitizeAriaKeyShortcuts('Invalid+Key')).toBeUndefined();
    expect(keyboardUtils.sanitizeAriaKeyShortcuts('ArrowLeft')).toBeUndefined();
    expect(keyboardUtils.sanitizeAriaKeyShortcuts('Cmd+A')).toBeUndefined();
  });

  test('returns undefined for empty or undefined values', () => {
    expect(keyboardUtils.sanitizeAriaKeyShortcuts('')).toBeUndefined();
    expect(keyboardUtils.sanitizeAriaKeyShortcuts('   ')).toBeUndefined();
    expect(keyboardUtils.sanitizeAriaKeyShortcuts(undefined)).toBeUndefined();
  });

  test('normalizes whitespace', () => {
    expect(keyboardUtils.sanitizeAriaKeyShortcuts('  Control+ArrowLeft  Meta+ArrowLeft  ')).toBe(
      'Control+ArrowLeft Meta+ArrowLeft',
    );
  });
});
