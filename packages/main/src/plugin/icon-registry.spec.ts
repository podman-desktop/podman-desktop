/**********************************************************************
 * Copyright (C) 2022-2024 Red Hat, Inc.
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

import path from 'node:path';

import type { ApiSenderType } from '@desktop-framework/api/api-sender';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import type { AnalyzedExtension } from '/@/plugin/extension/extension-analyzer.js';

import { IconRegistry } from './icon-registry.js';

let iconRegistry: IconRegistry;
const apiSenderSendMock = vi.fn();

vi.mock(import('/@/util.js'), async () => {
  return {
    isWindows: (): boolean => false,
  };
});

beforeAll(async () => {
  iconRegistry = new IconRegistry({
    send: apiSenderSendMock,
  } as unknown as ApiSenderType);
});

beforeEach(() => {
  vi.clearAllMocks();
});

test('should register icon contribution', async () => {
  const fontPath = 'bootstrap-icons.woff2';
  const fontCharacter = '\\F844';
  const iconDescription = 'This is my icon';
  const icons = {
    'my-icon-id': {
      description: iconDescription,
      default: {
        fontPath,
        fontCharacter,
      },
    },
  };

  const extensionPath = `${path.sep}root${path.sep}path`;
  const extensionId = 'myextension.id';
  const extension = {
    path: extensionPath,
    id: extensionId,
  } as AnalyzedExtension;

  // register icons
  iconRegistry.registerIconContribution(extension, icons);

  // expect to have registered the icon
  expect(apiSenderSendMock).toHaveBeenCalledWith('icon-update');
  expect(apiSenderSendMock).toHaveBeenCalledWith('font-update');

  // grab the icons
  const allIcons = iconRegistry.listIcons();
  expect(allIcons).toHaveLength(1);
  const icon = allIcons[0];
  expect(icon?.id).toBe('my-icon-id');
  expect(icon?.definition.fontCharacter).toBe(fontCharacter);
  expect(icon?.definition.description).toBe(iconDescription);
  expect(icon?.definition.font).toBeDefined();
  expect(icon?.definition.font?.src).toStrictEqual([
    {
      format: 'woff2',
      location: `${extensionPath}${path.sep}${fontPath}`,
      browserURL: `url('file://${extensionPath}${path.sep}${fontPath}')`,
    },
  ]);
  expect(icon?.definition.font?.fontId).toBe(`${extensionId}-${fontPath}`);
});

function registerIcon(iconId: string, fontPath: string, fontCharacter: string): void {
  const extension = {
    path: `${path.sep}root${path.sep}path`,
    id: 'myextension.id',
  } as AnalyzedExtension;
  iconRegistry.registerIconContribution(extension, { [iconId]: { default: { fontPath, fontCharacter } } });
}

test.each([
  { iconId: 'kind-icon', fontPath: 'kind-icon.woff2', fontCharacter: '\\EA01' },
  { iconId: 'my_icon2', fontPath: 'fonts/my icons.woff2', fontCharacter: '\\0041' },
  { iconId: 'single-char', fontPath: 'icons.woff2', fontCharacter: 'A' },
])('should register valid icon $iconId', ({ iconId, fontPath, fontCharacter }) => {
  registerIcon(iconId, fontPath, fontCharacter);

  expect(iconRegistry.listIcons().find(icon => icon.id === iconId)?.definition.fontCharacter).toBe(fontCharacter);
});

test.each([
  { name: 'id with a space', iconId: 'kind icon', fontPath: 'icons.woff2', fontCharacter: '\\EA01' },
  { name: 'id with braces', iconId: 'x{color:red}', fontPath: 'icons.woff2', fontCharacter: '\\EA01' },
  { name: 'id with a comma', iconId: 'a,b', fontPath: 'icons.woff2', fontCharacter: '\\EA01' },
  { name: 'escape with extra character', iconId: 'reject-1', fontPath: 'icons.woff2', fontCharacter: '\\EA01X' },
  { name: 'escape with 7 digits', iconId: 'reject-2', fontPath: 'icons.woff2', fontCharacter: '\\1234567' },
  { name: 'two characters', iconId: 'reject-3', fontPath: 'icons.woff2', fontCharacter: 'AB' },
  { name: 'single quote', iconId: 'reject-4', fontPath: 'icons.woff2', fontCharacter: `'` },
  { name: 'empty character', iconId: 'reject-5', fontPath: 'icons.woff2', fontCharacter: '' },
  {
    name: 'CSS injection in fontCharacter',
    iconId: 'reject-6',
    fontPath: 'icons.woff2',
    fontCharacter: `'; .podman-desktop-icon-exfil:before { content: ''; } /*`,
  },
  { name: 'quote in fontPath', iconId: 'reject-7', fontPath: `it's.woff2`, fontCharacter: '\\EA01' },
  { name: 'backslash in fontPath', iconId: 'reject-8', fontPath: 'x\\.woff2', fontCharacter: '\\EA01' },
  { name: 'parenthesis in fontPath', iconId: 'reject-9', fontPath: 'x).woff2', fontCharacter: '\\EA01' },
  {
    name: 'fontPath outside the folder',
    iconId: 'reject-10',
    fontPath: '../path-evil/x.woff2',
    fontCharacter: '\\EA01',
  },
])('should not register icon with $name', ({ iconId, fontPath, fontCharacter }) => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});

  registerIcon(iconId, fontPath, fontCharacter);

  expect(iconRegistry.listIcons().find(icon => icon.id === iconId)).toBeUndefined();
  expect(apiSenderSendMock).not.toHaveBeenCalled();
  expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(iconId));
});
