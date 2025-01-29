/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import DevelopersFeedback from './DevelopersFeedback.svelte';

beforeAll(() => {
  Object.defineProperty(window, 'openExternal', {
    value: vi.fn(),
  });
  Object.defineProperty(window, 'telemetryTrack', {
    value: vi.fn(),
  });
  Object.defineProperty(window, 'sendFeedback', {
    value: vi.fn(),
  });
});

beforeEach(() => {
  vi.resetAllMocks();
});

test('Expect that the button is disabled when loading the page', () => {
  render(DevelopersFeedback, { contentChange: vi.fn(), onCloseForm: vi.fn() });
  const button = screen.getByRole('button', { name: 'Send feedback' });
  expect(button).toBeInTheDocument();
  expect(button).toBeDisabled();
});

test('Expect that the button is enabled after clicking on a smiley', async () => {
  render(DevelopersFeedback, { contentChange: vi.fn(), onCloseForm: vi.fn() });
  const button = screen.getByRole('button', { name: 'Send feedback' });

  // expect to have indication why the button is disabled
  expect(screen.getByText('Please select an experience smiley')).toBeInTheDocument();

  // click on a smiley
  const smiley = screen.getByRole('button', { name: 'very-happy-smiley' });
  await fireEvent.click(smiley);

  // now expect to have the button enabled
  expect(button).toBeEnabled();

  // and the indication is gone
  expect(screen.queryByText('Please select an experience smiley')).not.toBeInTheDocument();
});

test('Expect very sad smiley errors without feedback', async () => {
  render(DevelopersFeedback, { contentChange: vi.fn(), onCloseForm: vi.fn() });
  const button = screen.getByRole('button', { name: 'Send feedback' });
  expect(button).toBeDisabled();

  // expect to have indication why the button is disabled
  expect(screen.getByText('Please select an experience smiley')).toBeInTheDocument();

  // click on very sad smiley
  const smiley = screen.getByRole('button', { name: 'very-sad-smiley' });
  await fireEvent.click(smiley);

  // expect button is still disabled, but with different indication
  expect(button).toBeDisabled();
  const message = screen.getByText('Please share contact info or details on how we can improve');
  expect(message).toBeInTheDocument();

  // add some text
  const feedback = screen.getByTestId('tellUsWhyFeedback');
  expect(feedback).toBeInTheDocument();

  await userEvent.type(feedback, 'PD is awesome');

  // button is enabled and the indication is gone
  expect(button).toBeEnabled();
  expect(message).not.toBeInTheDocument();
});

test('Expect sad smiley warns without feedback', async () => {
  render(DevelopersFeedback, { contentChange: vi.fn(), onCloseForm: vi.fn() });
  const button = screen.getByRole('button', { name: 'Send feedback' });
  expect(button).toBeDisabled();

  // expect to have indication why the button is disabled
  expect(screen.getByText('Please select an experience smiley')).toBeInTheDocument();

  // click on very sad smiley
  const smiley = screen.getByRole('button', { name: 'sad-smiley' });
  await fireEvent.click(smiley);

  // expect button is now enabled, but with different indication
  expect(button).toBeEnabled();
  const warn = screen.getByText('We would really appreciate knowing how we can improve');
  expect(warn).toBeInTheDocument();

  // add some text
  const feedback = screen.getByTestId('tellUsWhyFeedback');
  expect(feedback).toBeInTheDocument();

  await userEvent.type(feedback, 'PD is awesome');

  // and the indication is gone
  expect(warn).not.toBeInTheDocument();
});

test('Expect message for very-happy-smiley to use love', async () => {
  const { getByRole, getByLabelText } = render(DevelopersFeedback, { contentChange: vi.fn(), onCloseForm: vi.fn() });

  // click on a smiley
  const smiley = getByRole('button', { name: 'very-happy-smiley' });
  await fireEvent.click(smiley);

  // and the GitHub star text is visible
  const region = getByLabelText('Like Podman Desktop? Give us a star on GitHub');
  expect(region.textContent).toBe('Love It? Give us a on GitHub');
});

test('Expect message for happy-smiley to use like', async () => {
  const { getByRole, getByLabelText } = render(DevelopersFeedback, { contentChange: vi.fn(), onCloseForm: vi.fn() });

  // click on a smiley
  const smiley = getByRole('button', { name: 'happy-smiley' });
  await fireEvent.click(smiley);

  // and the GitHub star text is visible
  const region = getByLabelText('Like Podman Desktop? Give us a star on GitHub');
  expect(region.textContent).toBe('Like It? Give us a on GitHub');
});

test('Expect GitHub dialog visible when very-happy-smiley selected', async () => {
  render(DevelopersFeedback, { contentChange: vi.fn(), onCloseForm: vi.fn() });

  // click on a smiley
  const smiley = screen.getByRole('button', { name: 'very-happy-smiley' });
  await fireEvent.click(smiley);

  // and the GitHub star text is visible
  expect(screen.getByLabelText('Like Podman Desktop? Give us a star on GitHub')).toBeInTheDocument();

  const link = screen.getByRole('link', { name: 'GitHub' });
  await fireEvent.click(link);

  await vi.waitFor(() => {
    expect(window.telemetryTrack).toHaveBeenCalledWith('feedback.openGitHub');
    expect(window.openExternal).toHaveBeenCalledWith('https://github.com/containers/podman-desktop');
  });
});

test('Expect category to be sent', async () => {
  const closeMock = vi.fn();
  render(DevelopersFeedback, { contentChange: vi.fn(), onCloseForm: closeMock });

  // click on a smiley
  const smiley = screen.getByRole('button', { name: 'very-happy-smiley' });
  await fireEvent.click(smiley);

  // click on submit button
  const button = screen.getByRole('button', { name: 'Send feedback' });
  expect(button).toBeInTheDocument();
  expect(button).toBeEnabled();
  await fireEvent.click(button);

  await vi.waitFor(() => {
    expect(window.sendFeedback).toHaveBeenCalledWith({
      category: 'developers',
      rating: 4,
    });
  });

  // expect nice message to be displayed
  expect(window.showMessageBox).toHaveBeenCalledWith({
    title: 'Thanks for your feedback',
    message: 'Your input is valuable in helping us better understand and tailor Podman Desktop.',
    type: 'info',
    buttons: ['OK'],
  });

  // expect close to have been call with confirmation=false
  expect(closeMock).toHaveBeenCalledWith(false);
});
