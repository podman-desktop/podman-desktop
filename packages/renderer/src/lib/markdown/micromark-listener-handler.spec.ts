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

import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { createListener } from './micromark-listener-handler';

let mockCommandCallback: (command: string, state: 'starting' | 'failed' | 'successful', value?: unknown) => void;
let listener: ReturnType<typeof createListener>;

beforeEach(() => {
  vi.clearAllMocks();
});

beforeAll(() => {
  mockCommandCallback = vi.fn();
  listener = createListener(mockCommandCallback);
  vi.mocked(window.executeCommand).mockResolvedValue(vi.fn());

  // scrollIntoView is a native method, so we don't use vi.mocked, we just set it as vi.fn().
  // we don't care about the elements (it just scrolls), we just want to ensure it was called.
  Element.prototype.scrollIntoView = vi.fn();
});

test('command button check: calls executeButtonCommand if data was passed in', () => {
  const target = document.createElement('button');
  target.dataset.command = 'foo';

  // Define an event
  const event = new MouseEvent('click', { bubbles: true });
  Object.defineProperty(event, 'target', { value: target });

  // Append and listen
  document.body.appendChild(target);
  listener(event);

  // Expect that the callback was called with "foo" and "starting"
  // since this is running the inProgressMarkdownCommandExecutionCallback function
  expect(mockCommandCallback).toHaveBeenCalledWith('foo', 'starting');

  // Check that window.executeCommand was called with the command
  expect(window.executeCommand).toHaveBeenCalledWith('foo', undefined);
});

test('command button check: calls executeButtonCommand with args if data (with args) was passed in', () => {
  const target = document.createElement('button');
  target.dataset.command = 'foo';
  target.dataset.args = 'foo,bar,baz';

  // Define an event
  const event = new MouseEvent('click', { bubbles: true });
  Object.defineProperty(event, 'target', { value: target });

  // Append and listen
  document.body.appendChild(target);
  listener(event);

  // Expect that the callback was called with "foo" and "starting"
  expect(mockCommandCallback).toHaveBeenCalledWith('foo', 'starting');

  // Check that window.executeCommand was called with the command and args
  expect(window.executeCommand).toHaveBeenCalledWith('foo', 'foo,bar,baz');
});

test('expect executeCommand is called if target is HTMLAnchorElement with NO commmand data', () => {
  const target = document.createElement('a');
  target.dataset.command = 'foo';
  target.href = 'https://example.com';

  // Define an event
  const event = new MouseEvent('click', { bubbles: true });
  Object.defineProperty(event, 'target', { value: target });

  // Append and listen
  document.body.appendChild(target);
  listener(event);

  // Check that window.executeCommand was called with the command
  expect(window.executeCommand).toHaveBeenCalledWith('foo', undefined);
});

test('does nothing if dataset is empty', () => {
  const target = document.createElement('span');
  const event = new MouseEvent('click', { bubbles: true });
  Object.defineProperty(event, 'target', { value: target });

  // Expect nothing to be called.
  listener(event);
  expect(mockCommandCallback).not.toHaveBeenCalled();
});

test('expect an immediate return if the target is not an HTMLElement', () => {
  const event = new MouseEvent('click', { bubbles: true });
  Object.defineProperty(event, 'target', { value: null });

  // Expect nothing to be called.
  listener(event);
  expect(mockCommandCallback).not.toHaveBeenCalled();
});

test('data-pd-jump-in-page: scrolls to the element with the matching ID', () => {
  const target = document.createElement('a');
  target.setAttribute('data-pd-jump-in-page', 'target-id');
  target.href = '#';

  // Create a target element to scroll to
  const targetElement = document.createElement('div');
  targetElement.id = 'target-id';
  document.body.appendChild(targetElement);

  // Define an event
  const event = new MouseEvent('click', { bubbles: true });
  Object.defineProperty(event, 'target', { value: target });

  // Append and listen
  document.body.appendChild(target);
  listener(event);

  // Check that the element was scrolled into view (href was found and clicked on)
  expect(targetElement.scrollIntoView).toHaveBeenCalledWith({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  });
});
