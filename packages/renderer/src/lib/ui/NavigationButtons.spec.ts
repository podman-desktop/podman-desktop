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

import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  getBackEntries,
  getForwardEntries,
  goBack,
  goForward,
  goToHistoryIndex,
  navigationHistory,
} from '/@/stores/navigation-history.svelte';

import NavigationButtons from './NavigationButtons.svelte';

const goBackMock = vi.fn();
const goForwardMock = vi.fn();
const goToHistoryIndexMock = vi.fn();
const getBackEntriesMock = vi.fn().mockReturnValue([]);
const getForwardEntriesMock = vi.fn().mockReturnValue([]);

vi.mock(import('/@/stores/navigation-history.svelte'));

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });

  vi.mocked(window.telemetryTrack).mockResolvedValue(undefined);
  vi.mocked(window.getOsPlatform).mockResolvedValue('linux');
});

afterEach(() => {
  vi.useRealTimers();
});

describe('button states', () => {
  test('back button should be disabled when no history', async () => {
    const { findByTitle } = render(NavigationButtons);

    await vi.waitFor(async () => {
      const backButton = await findByTitle('Back (hold for history)');
      expect(backButton).toBeDisabled();
    });
  });

  test('forward button should be disabled when no history', async () => {
    const { findByTitle } = render(NavigationButtons);

    await vi.waitFor(async () => {
      const forwardButton = await findByTitle('Forward (hold for history)');
      expect(forwardButton).toBeDisabled();
    });
  });

  test('back button should be enabled when can go back', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 1;

    const { findByTitle } = render(NavigationButtons);

    await vi.waitFor(async () => {
      const backButton = await findByTitle('Back (hold for history)');
      expect(backButton).toBeEnabled();
    });
  });

  test('forward button should be enabled when can go forward', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 0;

    const { findByTitle } = render(NavigationButtons);

    await vi.waitFor(async () => {
      const forwardButton = await findByTitle('Forward (hold for history)');
      expect(forwardButton).toBeEnabled();
    });
  });
});

describe('click navigation', () => {
  test('clicking back button should call goBack', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 1;

    const { findByTitle } = render(NavigationButtons);

    await vi.waitFor(async () => {
      const backButton = await findByTitle('Back (hold for history)');
      await fireEvent.click(backButton);
      expect(goBack).toHaveBeenCalled();
    });
  });

  test('clicking forward button should call goForward', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 0;

    const { findByTitle } = render(NavigationButtons);

    await vi.waitFor(async () => {
      const forwardButton = await findByTitle('Forward (hold for history)');
      await fireEvent.click(forwardButton);
      expect(goForward).toHaveBeenCalled();
    });
  });
});

describe('mouse button navigation', () => {
  test('mouse button 3 should trigger goBack', async () => {
    render(NavigationButtons);

    await vi.waitFor(async () => {
      const mouseUpEvent = new MouseEvent('mouseup', { button: 3 });
      window.dispatchEvent(mouseUpEvent);
      expect(goBack).toHaveBeenCalled();
    });
  });

  test('mouse button 4 should trigger goForward', async () => {
    render(NavigationButtons);

    await vi.waitFor(async () => {
      const mouseUpEvent = new MouseEvent('mouseup', { button: 4 });
      window.dispatchEvent(mouseUpEvent);
      expect(goForward).toHaveBeenCalled();
    });
  });
});

describe('keyboard navigation - Windows/Linux', () => {
  test('Alt+Left should trigger goBack', async () => {
    render(NavigationButtons);

    await vi.waitFor(async () => {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        altKey: true,
      });
      window.dispatchEvent(keydownEvent);
      expect(goBack).toHaveBeenCalled();
    });
  });

  test('Alt+Right should trigger goForward', async () => {
    render(NavigationButtons);

    await vi.waitFor(async () => {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        altKey: true,
      });
      window.dispatchEvent(keydownEvent);
      expect(goForward).toHaveBeenCalled();
    });
  });
});

describe('keyboard navigation - macOS', () => {
  test('Cmd+[ should trigger goBack', async () => {
    vi.mocked(window.getOsPlatform).mockResolvedValue('darwin');
    render(NavigationButtons);

    await vi.waitFor(async () => {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: '[',
        metaKey: true,
      });
      window.dispatchEvent(keydownEvent);
      expect(goBack).toHaveBeenCalled();
    });
  });

  test('Cmd+] should trigger goForward', async () => {
    vi.mocked(window.getOsPlatform).mockResolvedValue('darwin');
    render(NavigationButtons);

    await vi.waitFor(async () => {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: ']',
        metaKey: true,
      });
      window.dispatchEvent(keydownEvent);
      expect(goForward).toHaveBeenCalled();
    });
  });

  test('Cmd+Left should trigger goBack', async () => {
    vi.mocked(window.getOsPlatform).mockResolvedValue('darwin');
    render(NavigationButtons);

    await vi.waitFor(async () => {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        metaKey: true,
      });
      window.dispatchEvent(keydownEvent);
      expect(goBack).toHaveBeenCalled();
    });
  });

  test('Cmd+Right should trigger goForward', async () => {
    vi.mocked(window.getOsPlatform).mockResolvedValue('darwin');
    render(NavigationButtons);

    await vi.waitFor(async () => {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        metaKey: true,
      });
      window.dispatchEvent(keydownEvent);
      expect(goForward).toHaveBeenCalled();
    });
  });
});

describe('trackpad swipe navigation', () => {
  test('swipe right (negative deltaX) should trigger goBack', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 1;

    render(NavigationButtons);

    await vi.waitFor(async () => {
      const wheelEvent = new WheelEvent('wheel', { deltaX: -50, deltaY: 0 });
      window.dispatchEvent(wheelEvent);
      expect(goBack).toHaveBeenCalled();
    });
  });

  test('swipe left (positive deltaX) should trigger goForward', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 0;

    render(NavigationButtons);

    await vi.waitFor(async () => {
      const wheelEvent = new WheelEvent('wheel', { deltaX: 50, deltaY: 0 });
      window.dispatchEvent(wheelEvent);
      expect(goForward).toHaveBeenCalled();
    });
  });
});

describe('mouse button navigation', () => {
  test('mouse button 3 should trigger goBack', async () => {
    render(NavigationButtons);

    // Simulate mouse button 3 (back)
    const mouseUpEvent = new MouseEvent('mouseup', { button: 3 });
    window.dispatchEvent(mouseUpEvent);

    expect(goBackMock).toHaveBeenCalled();
  });

  test('mouse button 4 should trigger goForward', async () => {
    render(NavigationButtons);

    // Simulate mouse button 4 (forward)
    const mouseUpEvent = new MouseEvent('mouseup', { button: 4 });
    window.dispatchEvent(mouseUpEvent);

    expect(goForwardMock).toHaveBeenCalled();
  });
});

describe('keyboard navigation - Windows/Linux', () => {
  test('Alt+Left should trigger goBack', async () => {
    render(NavigationButtons);
    await tick();

    const keydownEvent = new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
      altKey: true,
    });
    window.dispatchEvent(keydownEvent);

    expect(goBackMock).toHaveBeenCalled();
  });

  test('Alt+Right should trigger goForward', async () => {
    render(NavigationButtons);
    await tick();

    const keydownEvent = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      altKey: true,
    });
    window.dispatchEvent(keydownEvent);

    expect(goForwardMock).toHaveBeenCalled();
  });
});

describe('keyboard navigation - macOS', () => {
  test('Cmd+[ should trigger goBack', async () => {
    vi.mocked(window.getOsPlatform).mockResolvedValue('darwin');
    render(NavigationButtons);
    await tick();

    const keydownEvent = new KeyboardEvent('keydown', {
      key: '[',
      metaKey: true,
    });
    window.dispatchEvent(keydownEvent);

    expect(goBackMock).toHaveBeenCalled();
  });

  test('Cmd+] should trigger goForward', async () => {
    vi.mocked(window.getOsPlatform).mockResolvedValue('darwin');
    render(NavigationButtons);
    await tick();

    const keydownEvent = new KeyboardEvent('keydown', {
      key: ']',
      metaKey: true,
    });
    window.dispatchEvent(keydownEvent);

    expect(goForwardMock).toHaveBeenCalled();
  });

  test('Cmd+Left should trigger goBack', async () => {
    vi.mocked(window.getOsPlatform).mockResolvedValue('darwin');
    render(NavigationButtons);
    await tick();

    const keydownEvent = new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
      metaKey: true,
    });
    window.dispatchEvent(keydownEvent);

    expect(goBackMock).toHaveBeenCalled();
  });

  test('Cmd+Right should trigger goForward', async () => {
    vi.mocked(window.getOsPlatform).mockResolvedValue('darwin');
    render(NavigationButtons);
    await tick();

    const keydownEvent = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      metaKey: true,
    });
    window.dispatchEvent(keydownEvent);

    expect(goForwardMock).toHaveBeenCalled();
  });
});
