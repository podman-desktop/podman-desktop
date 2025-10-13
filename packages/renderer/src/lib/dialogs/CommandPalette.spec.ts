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
import { tick } from 'svelte';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { commandsInfos } from '/@/stores/commands';
import { context } from '/@/stores/context';

import CommandPalette from './CommandPalette.svelte';

const receiveFunctionMock = vi.fn();

const COMMAND_PALETTE_ARIA_LABEL = 'Command palette command input';

beforeAll(() => {
  (window.events as unknown) = {
    receive: receiveFunctionMock,
  };

  vi.mocked(window.executeCommand).mockResolvedValue(undefined);
  vi.mocked(window.openExternal).mockResolvedValue(undefined);
  vi.mocked(window.getOsPlatform).mockResolvedValue('linux');
  vi.mocked(window.getDocumentationItems).mockResolvedValue([]);

  // mock missing scrollIntoView method
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Command Palette', () => {
  test('Expect that F1 key is displaying the widget', async () => {
    render(CommandPalette);

    // check we have the command palette input field
    const inputBefore = screen.queryByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
    expect(inputBefore).not.toBeInTheDocument();

    // now, press the F1 key
    await userEvent.keyboard('{F1}');

    // check it's displayed now
    const input = screen.getByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
    expect(input).toBeInTheDocument();
  });

  test('Expect that esc key is hiding the widget', async () => {
    render(CommandPalette, { display: true });

    // check we have the command palette input field
    const input = screen.getByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
    expect(input).toBeInTheDocument();

    // now, press the ESC key
    await userEvent.keyboard('{Escape}');

    // check it's not displayed anymore
    expect(input).not.toBeInTheDocument();
  });

  test('Check keydown ⬇️', async () => {
    const commandTitle1 = 'My command 1';
    const commandTitle2 = 'My command 2';

    commandsInfos.set([
      {
        id: 'my-command-1',
        title: commandTitle1,
      },
      {
        id: 'my-command-2',
        title: commandTitle2,
      },
    ]);

    render(CommandPalette, { display: true });

    // Wait for component to initialize and items to be rendered
    await screen.findByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });

    // Switch to Commands mode to ensure we're testing command navigation specifically
    const commandsButton = screen.getByRole('button', { name: /Commands/ });
    await userEvent.click(commandsButton);

    // Wait for items to appear
    await screen.findByRole('button', { name: commandTitle1 });
    await screen.findByRole('button', { name: commandTitle2 });

    // grab first item
    const firstItem = screen.getByRole('button', { name: commandTitle1 });
    // check the class selected is on this item
    expect(firstItem).toHaveClass('selected');

    // Focus the input to ensure keydown events are handled
    const input = screen.getByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
    await userEvent.click(input);

    // now, press the ⬇️ key using fireEvent
    await fireEvent.keyDown(window, { key: 'ArrowDown' });

    // expect we've scrolled
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();

    // check the class selected is no longer on the first item
    expect(firstItem).not.toHaveClass('selected');

    // but on the second one
    const secondItem = screen.getByRole('button', { name: commandTitle2 });
    // check the class selected is on this item
    expect(secondItem).toHaveClass('selected');

    // click on the item
    await userEvent.click(secondItem);

    expect(vi.mocked(window.executeCommand)).toHaveBeenCalledWith('my-command-2');
  });

  test('Check keyup ⬆️', async () => {
    const commandTitle1 = 'My command 1';
    const commandTitle2 = 'My command 2';
    const commandTitle3 = 'My command 3';

    commandsInfos.set([
      {
        id: 'my-command-1',
        title: commandTitle1,
      },
      {
        id: 'my-command-2',
        title: commandTitle2,
      },
      {
        id: 'my-command-3',
        title: commandTitle3,
      },
    ]);

    render(CommandPalette, { display: true });

    // Wait for component to initialize and items to be rendered
    const input = await screen.findByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });

    // Switch to Commands mode to ensure we're testing command navigation specifically
    const commandsButton = screen.getByRole('button', { name: /Commands/ });
    await userEvent.click(commandsButton);

    // Wait for all items to appear
    await screen.findByRole('button', { name: commandTitle1 });
    await screen.findByRole('button', { name: commandTitle2 });
    await screen.findByRole('button', { name: commandTitle3 });

    // grab first item
    const firstItem = screen.getByRole('button', { name: commandTitle1 });
    // check the class selected is on this item
    expect(firstItem).toHaveClass('selected');

    // Focus the input to ensure keydown events are handled
    await userEvent.click(input);

    // now, press the ⬆️ key using fireEvent
    await fireEvent.keyDown(window, { key: 'ArrowUp' });

    // expect we've scrolled
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();

    // check the class selected is no longer on the first item
    expect(firstItem).not.toHaveClass('selected');

    // but on the last one (as we were on top)
    const lastItem = screen.getByRole('button', { name: commandTitle3 });
    // check the class selected is on this item
    expect(lastItem).toHaveClass('selected');

    // now, press the ⬆️ key again using fireEvent
    await fireEvent.keyDown(window, { key: 'ArrowUp' });

    // but on the second one
    const secondItem = screen.getByRole('button', { name: commandTitle2 });
    // check the class selected is on this item
    expect(secondItem).toHaveClass('selected');

    // click on the item
    await userEvent.click(secondItem);

    expect(vi.mocked(window.executeCommand)).toHaveBeenCalledWith('my-command-2');
  });

  test('Check Enter key', async () => {
    const commandTitle1 = 'My command 1';
    const commandTitle2 = 'My command 2';

    commandsInfos.set([
      {
        id: 'my-command-1',
        title: commandTitle1,
      },
      {
        id: 'my-command-2',
        title: commandTitle2,
      },
    ]);

    render(CommandPalette, { display: true });

    // Wait for component to initialize and items to be rendered
    const input = await screen.findByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });

    // Switch to Commands mode to ensure we're testing command navigation specifically
    const commandsButton = screen.getByRole('button', { name: /Commands/ });
    await userEvent.click(commandsButton);

    // Wait for items to appear
    await screen.findByRole('button', { name: commandTitle1 });

    // grab first item
    const firstItem = screen.getByRole('button', { name: commandTitle1 });
    // check the class selected is on this item
    expect(firstItem).toHaveClass('selected');

    // Focus the input to ensure keydown events are handled
    await userEvent.click(input);

    // now, press the Enter key using fireEvent
    await fireEvent.keyDown(window, { key: 'Enter' });

    expect(vi.mocked(window.executeCommand)).toHaveBeenCalledWith('my-command-1');
  });

  test('Check filtering', async () => {
    const commandTitle0 = 'Another Command';
    const commandTitle1 = 'My command 1';
    const commandTitle2 = 'My command 2';
    const commandTitle3 = 'command 3';

    commandsInfos.set([
      {
        id: 'my-command-0',
        title: commandTitle0,
      },
      {
        id: 'my-command-1',
        title: commandTitle1,
      },
      {
        id: 'my-command-2',
        title: commandTitle2,
      },
      {
        id: 'my-command-3',
        title: commandTitle3,
      },
    ]);

    render(CommandPalette, { display: true });

    // check we have the command palette input field
    const filterInput = screen.getByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
    expect(filterInput).toBeInTheDocument();

    // Check items are displayed
    const item0 = screen.getByRole('button', { name: commandTitle0 });
    expect(item0).toBeInTheDocument();
    const item1 = screen.getByRole('button', { name: commandTitle1 });
    expect(item1).toBeInTheDocument();
    const item2 = screen.getByRole('button', { name: commandTitle2 });
    expect(item2).toBeInTheDocument();
    const item3 = screen.getByRole('button', { name: commandTitle3 });
    expect(item3).toBeInTheDocument();

    // now enter the text 'My '
    await userEvent.type(filterInput, 'My ');

    // check only command 1 and 2 are displayed
    const searchingItem0 = screen.queryByRole('button', { name: commandTitle0 });
    expect(searchingItem0).not.toBeInTheDocument();
    const searchingItem1 = screen.queryByRole('button', { name: commandTitle1 });
    expect(searchingItem1).toBeInTheDocument();
    const searchingItem2 = screen.queryByRole('button', { name: commandTitle2 });
    expect(searchingItem2).toBeInTheDocument();
    const searchingItem3 = screen.queryByRole('button', { name: commandTitle3 });
    expect(searchingItem3).not.toBeInTheDocument();

    // Focus the input to ensure keydown events are handled
    await userEvent.click(filterInput);

    // now, press the Enter key using fireEvent
    await fireEvent.keyDown(window, { key: 'Enter' });

    expect(vi.mocked(window.executeCommand)).toHaveBeenCalledWith('my-command-1');
  });

  test('Check enablement', async () => {
    const commandTitle0 = 'Command always disabled';
    const commandTitle1 = 'Command enabled from property';
    const commandTitle2 = 'My dummy command 1';
    const commandTitle3 = 'My dummy command 2';

    commandsInfos.set([
      {
        id: 'my-command-disabled-0',
        title: commandTitle0,
        enablement: 'false',
      },
      {
        id: 'my-command-enabled-1',
        title: commandTitle1,
        enablement: 'myProperty === myValue',
      },
      {
        id: 'my-dummy-command-2',
        title: commandTitle2,
      },
      {
        id: 'my-dummy-command-3',
        title: commandTitle3,
      },
    ]);

    // set the context property
    context.update(ctx => {
      ctx.setValue('myProperty', 'myValue');
      return ctx;
    });

    // wait a little bit for the context to be updated
    await new Promise(resolve => setTimeout(resolve, 100));

    render(CommandPalette, { display: true });

    // check we have the command palette input field
    const input = screen.getByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
    expect(input).toBeInTheDocument();

    // Check some items are hidden
    const itemDisabled = screen.queryByRole('button', { name: commandTitle0 });
    expect(itemDisabled).not.toBeInTheDocument();

    const commandEnabledFromProperty = screen.getByRole('button', { name: commandTitle1 });
    expect(commandEnabledFromProperty).toBeInTheDocument();
    const item2 = screen.getByRole('button', { name: commandTitle2 });
    expect(item2).toBeInTheDocument();
    const item3 = screen.getByRole('button', { name: commandTitle3 });
    expect(item3).toBeInTheDocument();

    // Focus the input to ensure keydown events are handled
    const enablementInput = screen.getByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
    await userEvent.click(enablementInput);

    // now, press the Enter key using fireEvent
    await fireEvent.keyDown(window, { key: 'Enter' });

    expect(vi.mocked(window.executeCommand)).toHaveBeenCalledWith('my-command-enabled-1');
  });

  // Test data for shortcut and tab combinations
  const shortcutTabTestCases = [
    {
      description: 'Ctrl+Shift+P',
      shortcut: '{Control>}{Shift>}p{/Shift}{/Control}',
      expectedTabText: 'Ctrl+Shift+P All',
    },
    {
      description: 'F1 key',
      shortcut: '{F1}',
      expectedTabText: 'F1 > Commands',
    },
    {
      description: '> key',
      shortcut: '>',
      expectedTabText: 'F1 > Commands',
    },
    {
      description: 'Ctrl+K',
      shortcut: '{Control>}k{/Control}',
      expectedTabText: 'Ctrl+K Documentation',
    },
    {
      description: 'Ctrl+F',
      shortcut: '{Control>}f{/Control}',
      expectedTabText: 'Ctrl+F Go to',
    },
  ];

  test.each(shortcutTabTestCases)(
    'Expect that $description opens command palette with $expectedTabText tab selected',
    async ({ shortcut, expectedTabText }) => {
      render(CommandPalette);

      // check command palette is not displayed initially
      const inputBefore = screen.queryByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
      expect(inputBefore).not.toBeInTheDocument();

      // press the shortcut
      await userEvent.keyboard(shortcut);

      // check command palette is now displayed
      const input = screen.getByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
      expect(input).toBeInTheDocument();

      const expectedTab = screen.getByRole('button', { name: expectedTabText });
      expect(expectedTab).toHaveClass('text-[var(--pd-button-tab-text-selected)]');
      expect(expectedTab).toHaveClass('border-[var(--pd-button-tab-border-selected)]');

      const allTab = screen.getByRole('button', { name: 'Ctrl+Shift+P All' });
      const commandsTab = screen.getByRole('button', { name: 'F1 > Commands' });
      const docsTab = screen.getByRole('button', { name: 'Ctrl+K Documentation' });
      const gotoTab = screen.getByRole('button', { name: 'Ctrl+F Go to' });

      [allTab, commandsTab, docsTab, gotoTab].forEach(button => {
        if (button !== expectedTab) {
          expect(button).not.toHaveClass('text-[var(--pd-button-tab-text-selected)]');
          expect(button).not.toHaveClass('border-[var(--pd-button-tab-border-selected)]');
        }
      });
    },
  );

  test('Expect that clicking tabs switches between them correctly', async () => {
    // Set up some commands so tab switching logic gets triggered
    commandsInfos.set([
      {
        id: 'test-command-1',
        title: 'Test Command 1',
      },
      {
        id: 'test-command-2',
        title: 'Test Command 2',
      },
    ]);

    render(CommandPalette, { display: true });

    // check command palette is displayed
    const input = screen.getByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
    expect(input).toBeInTheDocument();

    await screen.findByRole('button', { name: 'Test Command 1' });

    const allTab = screen.getByRole('button', { name: 'Ctrl+Shift+P All' });
    const commandsTab = screen.getByRole('button', { name: 'F1 > Commands' });
    const docsTab = screen.getByRole('button', { name: 'Ctrl+K Documentation' });
    const gotoTab = screen.getByRole('button', { name: 'Ctrl+F Go to' });

    // initially "All" tab should be selected (index 0)
    expect(allTab).toHaveClass('text-[var(--pd-button-tab-text-selected)]');

    // click Commands tab
    await userEvent.click(commandsTab);
    await tick();
    expect(commandsTab).toHaveClass('text-[var(--pd-button-tab-text-selected)]');
    expect(allTab).not.toHaveClass('text-[var(--pd-button-tab-text-selected)]');

    // click Documentation tab
    await userEvent.click(docsTab);
    await tick();
    expect(docsTab).toHaveClass('text-[var(--pd-button-tab-text-selected)]');
    expect(commandsTab).not.toHaveClass('text-[var(--pd-button-tab-text-selected)]');

    // click Go to tab
    await userEvent.click(gotoTab);
    await tick();
    expect(gotoTab).toHaveClass('text-[var(--pd-button-tab-text-selected)]');
    expect(docsTab).not.toHaveClass('text-[var(--pd-button-tab-text-selected)]');

    // click back to All tab
    await userEvent.click(allTab);
    await tick();
    expect(allTab).toHaveClass('text-[var(--pd-button-tab-text-selected)]');
    expect(gotoTab).not.toHaveClass('text-[var(--pd-button-tab-text-selected)]');
  });

  test('Expect that tab selection state is maintained correctly', async () => {
    // Set up some commands
    commandsInfos.set([
      {
        id: 'test-command-1',
        title: 'Test Command 1',
      },
    ]);

    render(CommandPalette, { display: true });

    // check command palette is displayed
    const input = screen.getByRole('textbox', { name: COMMAND_PALETTE_ARIA_LABEL });
    expect(input).toBeInTheDocument();

    const allTab = screen.getByRole('button', { name: 'Ctrl+Shift+P All' });
    const commandsTab = screen.getByRole('button', { name: 'F1 > Commands' });
    const docsTab = screen.getByRole('button', { name: 'Ctrl+K Documentation' });
    const gotoTab = screen.getByRole('button', { name: 'Ctrl+F Go to' });

    // Test that only one tab is selected at a time
    expect(allTab).toHaveClass('text-[var(--pd-button-tab-text-selected)]');
    expect(commandsTab).not.toHaveClass('text-[var(--pd-button-tab-text-selected)]');
    expect(docsTab).not.toHaveClass('text-[var(--pd-button-tab-text-selected)]');
    expect(gotoTab).not.toHaveClass('text-[var(--pd-button-tab-text-selected)]');

    // Test that border styling is also correct
    expect(allTab).toHaveClass('border-[var(--pd-button-tab-border-selected)]');
    expect(commandsTab).not.toHaveClass('border-[var(--pd-button-tab-border-selected)]');
    expect(docsTab).not.toHaveClass('border-[var(--pd-button-tab-border-selected)]');
    expect(gotoTab).not.toHaveClass('border-[var(--pd-button-tab-border-selected)]');
  });
});
