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

import { beforeEach, expect, test, vi } from 'vitest';

import { defaultButtonOnEnter } from './default-button-attachment';

const onDefaultClick = vi.fn();
const cleanups: (() => void)[] = [];
let modal: HTMLDivElement;
let input: HTMLInputElement;
let defaultButton: HTMLButtonElement;

function attachModal(): { modal: HTMLDivElement; input: HTMLInputElement; defaultButton: HTMLButtonElement } {
  const modal = document.createElement('div');
  const input = document.createElement('input');
  const defaultButton = document.createElement('button');
  defaultButton.setAttribute('data-default', '');
  modal.append(input, defaultButton);
  document.body.append(modal);
  const detach = defaultButtonOnEnter(modal);
  cleanups.push(() => {
    detach?.();
    modal.remove();
  });
  return { modal, input, defaultButton };
}

function pressEnter(target: HTMLElement, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  vi.resetAllMocks();
  // reset the module-level modal list left by the previous test
  cleanups.splice(0).forEach(cleanup => cleanup());
  ({ modal, input, defaultButton } = attachModal());
  defaultButton.addEventListener('click', onDefaultClick);
});

test('Enter in an input clicks the default button', () => {
  const event = pressEnter(input);

  expect(onDefaultClick).toHaveBeenCalledOnce();
  expect(event.defaultPrevented).toBe(true);
});

test('other keys are ignored', () => {
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));

  expect(onDefaultClick).not.toHaveBeenCalled();
});

test.each([
  { shiftKey: true },
  { ctrlKey: true },
  { altKey: true },
  { metaKey: true },
  { isComposing: true },
  { repeat: true },
])('Enter with %o is ignored', init => {
  pressEnter(input, init);

  expect(onDefaultClick).not.toHaveBeenCalled();
});

test('Enter already handled by another listener is ignored', () => {
  input.addEventListener('keydown', e => e.preventDefault());
  pressEnter(input);

  expect(onDefaultClick).not.toHaveBeenCalled();
});

test('only the topmost modal handles Enter', () => {
  const upper = attachModal();
  const onUpperClick = vi.fn();
  upper.defaultButton.addEventListener('click', onUpperClick);
  pressEnter(document.body);

  expect(onUpperClick).toHaveBeenCalledOnce();
  expect(onDefaultClick).not.toHaveBeenCalled();
});

test('the lower modal handles Enter again once the topmost one is detached', () => {
  attachModal();
  cleanups.pop()?.();
  pressEnter(document.body);

  expect(onDefaultClick).toHaveBeenCalledOnce();
});

test('Enter on a button, and outside the modal, is left alone', () => {
  const outside = document.createElement('input');
  document.body.append(outside);
  pressEnter(defaultButton);
  pressEnter(outside);
  outside.remove();

  expect(onDefaultClick).not.toHaveBeenCalled();
});

test.each(['button', 'submit', 'reset'])('Enter on an input of type %s is left alone', type => {
  const inputButton = document.createElement('input');
  inputButton.type = type;
  modal.append(inputButton);
  pressEnter(inputButton);

  expect(onDefaultClick).not.toHaveBeenCalled();
});

test('Enter works when focus dropped to the body', () => {
  pressEnter(document.body);

  expect(onDefaultClick).toHaveBeenCalledOnce();
});

test('a disabled default button is skipped', () => {
  defaultButton.disabled = true;
  pressEnter(document.body);

  expect(onDefaultClick).not.toHaveBeenCalled();
});

test('a detached modal no longer handles Enter', () => {
  cleanups.pop()?.();
  pressEnter(document.body);

  expect(onDefaultClick).not.toHaveBeenCalled();
});
