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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import HistoryDropdown from './HistoryDropdown.svelte';

const onSelectEntryMock = vi.fn();
const onSetHoveredIndexMock = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
});

describe('rendering', () => {
  test('should not render when show is false', () => {
    render(HistoryDropdown, {
      show: false,
      entries: [{ index: 0, name: 'Containers' }],
      hoveredEntryIndex: undefined,
      isLongPressing: false,
      onSelectEntry: onSelectEntryMock,
      onSetHoveredIndex: onSetHoveredIndexMock,
    });

    expect(screen.queryByText('Containers')).not.toBeInTheDocument();
  });

  test('should not render when entries are empty', () => {
    render(HistoryDropdown, {
      show: true,
      entries: [],
      hoveredEntryIndex: undefined,
      isLongPressing: false,
      onSelectEntry: onSelectEntryMock,
      onSetHoveredIndex: onSetHoveredIndexMock,
    });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('should render entries when show is true and entries exist', () => {
    render(HistoryDropdown, {
      show: true,
      entries: [
        { index: 0, name: 'Containers' },
        { index: 1, name: 'Images' },
      ],
      hoveredEntryIndex: undefined,
      isLongPressing: false,
      onSelectEntry: onSelectEntryMock,
      onSetHoveredIndex: onSetHoveredIndexMock,
    });

    expect(screen.getByText('Containers')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
  });
});

describe('click selection', () => {
  test('clicking entry should call onSelectEntry', async () => {
    render(HistoryDropdown, {
      show: true,
      entries: [
        { index: 0, name: 'Containers' },
        { index: 1, name: 'Images' },
      ],
      hoveredEntryIndex: undefined,
      isLongPressing: false,
      onSelectEntry: onSelectEntryMock,
      onSetHoveredIndex: onSetHoveredIndexMock,
    });

    const containersItem = screen.getByText('Containers');
    await fireEvent.click(containersItem);

    expect(onSelectEntryMock).toHaveBeenCalledWith(0);
  });
});

describe('long press selection', () => {
  test('mouseup on entry should call onSelectEntry when isLongPressing', async () => {
    render(HistoryDropdown, {
      show: true,
      entries: [{ index: 1, name: 'Images' }],
      hoveredEntryIndex: undefined,
      isLongPressing: true,
      onSelectEntry: onSelectEntryMock,
      onSetHoveredIndex: onSetHoveredIndexMock,
    });

    const imagesItem = screen.getByText('Images');
    await fireEvent.mouseUp(imagesItem);

    expect(onSelectEntryMock).toHaveBeenCalledWith(1);
  });

  test('mouseup on entry should not call onSelectEntry when not long pressing', async () => {
    render(HistoryDropdown, {
      show: true,
      entries: [{ index: 1, name: 'Images' }],
      hoveredEntryIndex: undefined,
      isLongPressing: false,
      onSelectEntry: onSelectEntryMock,
      onSetHoveredIndex: onSetHoveredIndexMock,
    });

    const imagesItem = screen.getByText('Images');
    await fireEvent.mouseUp(imagesItem);

    expect(onSelectEntryMock).not.toHaveBeenCalled();
  });
});

describe('hover tracking', () => {
  test('mouseenter should call onSetHoveredIndex with entry index', async () => {
    render(HistoryDropdown, {
      show: true,
      entries: [{ index: 2, name: 'Pods' }],
      hoveredEntryIndex: undefined,
      isLongPressing: false,
      onSelectEntry: onSelectEntryMock,
      onSetHoveredIndex: onSetHoveredIndexMock,
    });

    const podsItem = screen.getByText('Pods');
    await fireEvent.mouseEnter(podsItem.closest('button')!);

    expect(onSetHoveredIndexMock).toHaveBeenCalledWith(2);
  });

  test('mouseleave should call onSetHoveredIndex with undefined', async () => {
    render(HistoryDropdown, {
      show: true,
      entries: [{ index: 2, name: 'Pods' }],
      hoveredEntryIndex: 2,
      isLongPressing: false,
      onSelectEntry: onSelectEntryMock,
      onSetHoveredIndex: onSetHoveredIndexMock,
    });

    const podsItem = screen.getByText('Pods');
    await fireEvent.mouseLeave(podsItem.closest('button')!);

    expect(onSetHoveredIndexMock).toHaveBeenCalledWith(undefined);
  });
});
