/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import DirectFeedback from './feedbackForms/DirectFeedback.svelte';
import GitHubIssueFeedback from './feedbackForms/GitHubIssueFeedback.svelte';
import SendFeedback from './SendFeedback.svelte';

vi.mock(import('./feedbackForms/GitHubIssueFeedback.svelte'));

vi.mock(import('./feedbackForms/DirectFeedback.svelte'));

beforeAll(() => {
  (window.events as unknown) = {
    receive: (_channel: string, func: () => void): void => {
      func();
    },
  };
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.getGitHubFeedbackLinks).mockResolvedValue({
    bug: '/bug/link',
    feature: '/feature/link',
  });
});

test('Expect developers feedback form to be rendered by default', async () => {
  render(SendFeedback);

  await vi.waitFor(() => expect(window.getGitHubFeedbackLinks).toHaveBeenCalled());

  expect(DirectFeedback).toHaveBeenCalledOnce();
  expect(DirectFeedback).toHaveBeenCalledWith(expect.anything(), {
    onCloseForm: expect.any(Function),
    category: 'developers',
    contentChange: expect.any(Function),
  });
  expect(GitHubIssueFeedback).not.toHaveBeenCalled();
});

test('Expect confirmation dialog to be displayed if content changed', async () => {
  render(SendFeedback, {});

  await vi.waitFor(() => expect(window.getGitHubFeedbackLinks).toHaveBeenCalled());

  expect(DirectFeedback).toHaveBeenCalledWith(expect.anything(), {
    onCloseForm: expect.any(Function),
    category: 'developers',
    contentChange: expect.any(Function),
  });

  const { onCloseForm, contentChange } = vi.mocked(DirectFeedback).mock.calls[0][1];

  // 1. simulate content change
  contentChange(true);

  // 2. close
  onCloseForm(true);

  // expect confirm dialog
  expect(window.showMessageBox).toHaveBeenCalledWith({
    title: 'Close Feedback Form?',
    message: 'Do you want to close the Feedback form?\nClosing will erase your input.',
    type: 'warning',
    buttons: ['Close', 'Cancel'],
  });
});

test('Expect no confirmation dialog to be displayed if content has not changed', async () => {
  render(SendFeedback, {});

  await vi.waitFor(() => expect(window.getGitHubFeedbackLinks).toHaveBeenCalled());

  expect(DirectFeedback).toHaveBeenCalledWith(expect.anything(), {
    onCloseForm: expect.any(Function),
    category: 'developers',
    contentChange: expect.any(Function),
  });

  const { onCloseForm } = vi.mocked(DirectFeedback).mock.calls[0][1];

  // 2. close
  onCloseForm(true);

  // expect no confirm dialog
  expect(window.showMessageBox).not.toHaveBeenCalled();
});

test('Expect DirectFeedback form to be rendered when design category is selected', async () => {
  render(SendFeedback, {});

  await vi.waitFor(() => expect(window.getGitHubFeedbackLinks).toHaveBeenCalled());

  const categorySelect = screen.getByRole('button', { name: /Direct your words to the developers/ });
  expect(categorySelect).toBeInTheDocument();
  categorySelect.focus();

  // select the Design category
  await userEvent.keyboard('[ArrowDown]');
  const designCategory = screen.getByRole('button', { name: /User experience or design thoughts/ });
  expect(designCategory).toBeInTheDocument();
  await fireEvent.click(designCategory);

  expect(DirectFeedback).toHaveBeenLastCalledWith(expect.anything(), {
    onCloseForm: expect.any(Function),
    category: 'design',
    contentChange: expect.any(Function),
  });
  expect(GitHubIssueFeedback).not.toHaveBeenCalled();
});

test('Expect GitHubIssue feedback form to be rendered if category is not developers', async () => {
  render(SendFeedback, {});

  await vi.waitFor(() => expect(window.getGitHubFeedbackLinks).toHaveBeenCalled());

  const categorySelect = screen.getByRole('button', { name: /Direct your words to the developers/ });
  expect(categorySelect).toBeInTheDocument();
  categorySelect.focus();

  // select the Feature request category
  await userEvent.keyboard('[ArrowDown]');
  const bugCategory = screen.getByRole('button', { name: /Bug/ });
  expect(bugCategory).toBeInTheDocument();
  await fireEvent.click(bugCategory);
  // click on a smiley
  expect(vi.mocked(GitHubIssueFeedback)).toHaveBeenNthCalledWith(1, expect.anything(), {
    onCloseForm: expect.any(Function),
    categoryLinks: {
      bug: '/bug/link',
      feature: '/feature/link',
    },
    category: 'bug',
    contentChange: expect.any(Function),
  });

  categorySelect.focus();

  // select the Feature request category
  await userEvent.keyboard('[ArrowDown]');
  const featureCategory = screen.getByRole('button', { name: /Feature/ });
  await fireEvent.click(featureCategory);
  expect(vi.mocked(GitHubIssueFeedback)).toHaveBeenNthCalledWith(1, expect.anything(), {
    onCloseForm: expect.any(Function),
    categoryLinks: {
      bug: '/bug/link',
      feature: '/feature/link',
    },
    category: 'feature',
    contentChange: expect.any(Function),
  });
});

test('Expect if there no GitHub links to have a new category other with other feedback links', async () => {
  vi.mocked(window.getGitHubFeedbackLinks).mockResolvedValue(undefined);
  vi.mocked(window.getFeedbackLinks).mockResolvedValue({
    category1: '/catgory1/link',
    category2: '/catgory2/link',
    category3: '/catgory3/link',
  });

  render(SendFeedback);

  await vi.waitFor(() => expect(window.getGitHubFeedbackLinks).toHaveBeenCalled());

  const categorySelect = screen.getByRole('button', { name: /Direct your words to the developers/ });
  expect(categorySelect).toBeInTheDocument();
  categorySelect.focus();

  // open feedback categories dropdown
  await userEvent.keyboard('[ArrowDown]');

  const bugCategory = screen.queryByRole('button', { name: /Bug/ });
  expect(bugCategory).not.toBeInTheDocument();

  const featureCategory = screen.queryByRole('button', { name: /Feature/ });
  expect(featureCategory).not.toBeInTheDocument();

  const otherCategory = screen.getByRole('button', { name: /Other/ });
  expect(otherCategory).toBeInTheDocument();

  await fireEvent.click(otherCategory);

  expect(screen.getByText('category1')).toBeInTheDocument();
  expect(screen.getByText('category2')).toBeInTheDocument();
  expect(screen.getByText('category3')).toBeInTheDocument();
});

test('Expect if there no GitHub links to not have a new category other if there are also no other feedback links', async () => {
  vi.mocked(window.getGitHubFeedbackLinks).mockResolvedValue(undefined);
  vi.mocked(window.getFeedbackLinks).mockResolvedValue({});

  render(SendFeedback);

  await vi.waitFor(() => expect(window.getGitHubFeedbackLinks).toHaveBeenCalled());

  const categorySelect = screen.getByRole('button', { name: /Direct your words to the developers/ });
  expect(categorySelect).toBeInTheDocument();
  categorySelect.focus();

  // open feedback categories dropdown
  await userEvent.keyboard('[ArrowDown]');

  const bugCategory = screen.queryByRole('button', { name: /Bug/ });
  expect(bugCategory).not.toBeInTheDocument();

  const featureCategory = screen.queryByRole('button', { name: /Feature/ });
  expect(featureCategory).not.toBeInTheDocument();

  const otherCategory = screen.queryByRole('button', { name: /Other/ });
  expect(otherCategory).not.toBeInTheDocument();
});
