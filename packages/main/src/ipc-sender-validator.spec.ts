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

import type { ContributionInfo, WebviewInfo } from '@desktop-framework/api';
import type { IpcMainInvokeEvent, WebContents } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { IpcSenderValidator } from './ipc-sender-validator.js';

const APP_URL = 'file:///application/renderer/index.html';
let validator: IpcSenderValidator;
let main: WebContents;

function contents(url: string, host?: WebContents): WebContents {
  return {
    mainFrame: { url },
    isDestroyed: vi.fn().mockReturnValue(false),
    getType: () => (host ? 'webview' : 'window'),
    hostWebContents: host,
  } as unknown as WebContents;
}

function event(sender: WebContents): IpcMainInvokeEvent {
  return { sender, senderFrame: sender.mainFrame } as IpcMainInvokeEvent;
}

function navigate(sender: WebContents, url: string): void {
  Object.defineProperty(sender.mainFrame, 'url', { value: url, configurable: true });
}

beforeEach(() => {
  validator = new IpcSenderValidator();
  main = contents(APP_URL);
  validator.registerMainWindow(main, APP_URL);
});

describe('main renderer', () => {
  test('allows the registered main frame and route changes', () => {
    navigate(main, `${APP_URL}#/containers`);
    expect(() => validator.assertSharedSender(event(main), 'privileged:operation', [])).not.toThrow();
  });

  test('rejects a different WebContents at the same URL', () => {
    expect(() => validator.assertMainSender(event(contents(APP_URL)))).toThrow();
  });

  test('rejects a subframe and a missing frame', () => {
    expect(() =>
      validator.assertMainSender({ ...event(main), senderFrame: { url: APP_URL } } as IpcMainInvokeEvent),
    ).toThrow();
    expect(() => validator.assertMainSender({ ...event(main), senderFrame: null } as IpcMainInvokeEvent)).toThrow();
  });

  test.each(['https://attacker.example/', 'file:///application/untrusted.html'])('rejects navigation to %s', url => {
    navigate(main, url);
    expect(() => validator.assertMainSender(event(main))).toThrow();
  });

  test('rejects destroyed contents', () => {
    vi.mocked(main.isDestroyed).mockReturnValue(true);
    expect(() => validator.assertMainSender(event(main))).toThrow();
  });

  test('rejects the old window after recreation', () => {
    const replacement = contents(APP_URL);
    validator.registerMainWindow(replacement, APP_URL);
    expect(() => validator.assertMainSender(event(main))).toThrow();
    expect(() => validator.assertMainSender(event(replacement))).not.toThrow();
  });

  test('supports a configured development URL without trusting other localhost pages', () => {
    validator.registerMainWindow(main, 'http://localhost:9000/');
    navigate(main, 'http://localhost:9000/#/containers');
    expect(() => validator.assertMainSender(event(main))).not.toThrow();
    navigate(main, 'http://localhost:9000/untrusted');
    expect(() => validator.assertMainSender(event(main))).toThrow();
  });
});

describe('Docker extension', () => {
  const contribution = {
    extensionId: 'extension-one',
    uiUri: 'file:///extensions/one/ui/index.html',
  } as ContributionInfo;
  let guest: WebContents;

  beforeEach(() => {
    validator.registerContributions(() => [contribution]);
    guest = contents(`${contribution.uiUri}?extensionName=extension-one`, main);
  });

  test('allows its execution and the shared preload API channels', () => {
    expect(validator.assertDockerSender(event(guest), 'extension-one')).toBe(contribution);
    navigate(guest, `${contribution.uiUri}?extensionName=extension-one#/settings`);
    for (const channel of [
      'container-provider-registry:listImages',
      'container-provider-registry:listSimpleContainers',
      'shell:openExternal',
    ]) {
      expect(() => validator.assertSharedSender(event(guest), channel, [])).not.toThrow();
    }
  });

  test('rejects unrelated privileged channels and impersonation', () => {
    expect(() => validator.assertSharedSender(event(guest), 'extension-loader:removeExtension', [])).toThrow();
    expect(() => validator.assertDockerSender(event(guest), 'extension-two')).toThrow();
    navigate(guest, `${contribution.uiUri}?extensionName=extension-two`);
    expect(() => validator.assertDockerSender(event(guest))).toThrow();
  });

  test('rejects unregistered pages even with a known contribution ID', () => {
    navigate(guest, 'file:///extensions/other/index.html?extensionName=extension-one');
    expect(() => validator.assertDockerSender(event(guest))).toThrow();
  });

  test('rejects a guest belonging to a different host', () => {
    guest = contents(`${contribution.uiUri}?extensionName=extension-one`, contents(APP_URL));
    expect(() => validator.assertDockerSender(event(guest))).toThrow();
  });

  test('rejects guests when the host has navigated', () => {
    navigate(main, 'https://attacker.example/');
    expect(() => validator.assertDockerSender(event(guest))).toThrow();
  });

  test('rejects deleted contributions', () => {
    validator.registerContributions(() => []);
    expect(() => validator.assertDockerSender(event(guest))).toThrow();
  });

  test('binds a WebContents to its contribution even if it navigates to another registered extension', () => {
    const other = { extensionId: 'extension-two', uiUri: 'file:///extensions/two/index.html' } as ContributionInfo;
    validator.registerContributions(() => [contribution, other]);
    validator.assertDockerSender(event(guest), 'extension-one');
    navigate(guest, `${other.uiUri}?extensionName=extension-two`);
    expect(() => validator.assertDockerSender(event(guest), 'extension-two')).toThrow('navigated');
  });
});

describe('ordinary extension webview', () => {
  const view = { id: 'view-one', uuid: 'registered-uuid' } as WebviewInfo;
  let guest: WebContents;

  beforeEach(() => {
    validator.registerWebviews(() => ({ views: [view], port: 44000 }));
    guest = contents('http://registered-uuid.webview.localhost:44000/?webviewId=view-one', main);
  });

  test('allows its theme, state, message, and bootstrap APIs', () => {
    for (const [channel, args] of [
      ['configuration-registry:getConfigurationValue', ['preferences.appearance']],
      ['colorRegistry:listColors', ['dark']],
      ['colorRegistry:getThemeInfo', ['dark']],
      ['webviewRegistry:listWebviews', []],
      ['webviewRegistry:post-message', [view.id, { data: 'message' }]],
      ['webviewRegistry:update-state', [view.id, {}]],
    ] as const) {
      expect(() => validator.assertSharedSender(event(guest), channel, [...args])).not.toThrow();
    }
  });

  test.each(['webviewRegistry:post-message', 'webviewRegistry:update-state'])(
    'rejects other view IDs on %s',
    channel => {
      expect(() => validator.assertSharedSender(event(guest), channel, ['view-two'])).toThrow();
    },
  );

  test('rejects configuration beyond the theme setting', () => {
    expect(() =>
      validator.assertSharedSender(event(guest), 'configuration-registry:getConfigurationValue', ['secret']),
    ).toThrow();
  });

  test.each([
    'http://registered-uuid.webview.localhost:44001/?webviewId=view-one',
    'http://other.webview.localhost:44000/?webviewId=view-one',
    'http://registered-uuid.webview.localhost:44000/?webviewId=view-two',
  ])('rejects mismatched URL %s', url => {
    navigate(guest, url);
    expect(() => validator.assertSharedSender(event(guest), 'webviewRegistry:listWebviews', [])).toThrow();
  });
});
