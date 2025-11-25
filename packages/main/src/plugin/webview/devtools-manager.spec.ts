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

import { BrowserWindow, type WebContents, webContents } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { DevToolsManager } from './devtools-manager.js';

vi.mock('electron', () => ({
  webContents: {
    fromId: vi.fn(),
  },
  BrowserWindow: {
    getAllWindows: vi.fn(),
  },
}));

const mockWebContents = vi.mocked(webContents);
const mockBrowserWindow = vi.mocked(BrowserWindow);

describe('DevToolsManager', () => {
  let devToolsManager: DevToolsManager;

  beforeEach(() => {
    vi.clearAllMocks();

    devToolsManager = new DevToolsManager();

    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('Core State Management', () => {
    test('should initialize with empty DevTools mapping', () => {
      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });

    test('should track DevTools mapping correctly', async () => {
      const mockGuest = {
        devToolsWebContents: {
          id: 67890,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);

      await devToolsManager.registerDevTools(12345);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(1);
    });

    test('should clear all tracking', async () => {
      const mockGuest = {
        devToolsWebContents: {
          id: 67890,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);
      await devToolsManager.registerDevTools(12345);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(1);

      devToolsManager.clearAllTracking();

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });
  });

  describe('registerDevTools', () => {
    test('should register DevTools when webContents exists and has devToolsWebContents', async () => {
      const mockDevToolsWebContents = {
        id: 67890,
        isDestroyed: vi.fn().mockReturnValue(false),
      };
      const mockGuest = {
        devToolsWebContents: mockDevToolsWebContents,
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);

      await devToolsManager.registerDevTools(12345);

      expect(vi.mocked(mockWebContents.fromId)).toHaveBeenCalledWith(12345);
      expect(mockDevToolsWebContents.isDestroyed).toHaveBeenCalled();
      expect(devToolsManager.getTrackedDevToolsCount()).toBe(1);
    });

    test('should handle missing webContents gracefully', async () => {
      vi.mocked(mockWebContents.fromId).mockReturnValue(undefined);

      await devToolsManager.registerDevTools(12345);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });

    test('should handle webContents without devToolsWebContents property', async () => {
      const mockGuest = {};
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);

      await devToolsManager.registerDevTools(12345);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });

    test('should handle destroyed devToolsWebContents', async () => {
      const mockDevToolsWebContents = {
        id: 67890,
        isDestroyed: vi.fn().mockReturnValue(true),
      };
      const mockGuest = {
        devToolsWebContents: mockDevToolsWebContents,
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);

      await devToolsManager.registerDevTools(12345);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });

    test('should handle errors during registration', async () => {
      vi.mocked(mockWebContents.fromId).mockImplementation(() => {
        throw new Error('WebContents access failed');
      });

      await devToolsManager.registerDevTools(12345);

      expect(console.error).toHaveBeenCalledWith('DevToolsManager: error in registerDevTools:', expect.any(Error));
      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });
  });

  describe('cleanupDevTools', () => {
    beforeEach(async () => {
      const mockGuest = {
        devToolsWebContents: {
          id: 67890,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);
      await devToolsManager.registerDevTools(12345);
    });

    test('should cleanup when devToolsId exists and strategy succeeds', async () => {
      const mockGuest = {
        isDestroyed: vi.fn().mockReturnValue(false),
        isDevToolsOpened: vi.fn().mockReturnValue(true),
        closeDevTools: vi.fn(),
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);

      await devToolsManager.cleanupDevTools(12345);

      expect(mockGuest.closeDevTools).toHaveBeenCalled();
      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });

    test('should handle missing devToolsId gracefully', async () => {
      await devToolsManager.cleanupDevTools(99999); // Non-existent ID

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(1); // Original should remain
    });

    test('should always remove from map even when all strategies fail', async () => {
      vi.mocked(mockWebContents.fromId).mockReturnValue(undefined); // Strategy 1 & 2 fail
      vi.mocked(mockBrowserWindow.getAllWindows).mockReturnValue([]); // Strategy 3 fails

      await devToolsManager.cleanupDevTools(12345);

      expect(console.warn).toHaveBeenCalledWith(
        'DevToolsManager: failed to close DevTools using all available methods',
      );
      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0); // Should still be removed from map
    });

    test('should handle errors in cleanup strategies', async () => {
      vi.mocked(mockWebContents.fromId).mockImplementation(() => {
        throw new Error('Strategy error');
      });

      await devToolsManager.cleanupDevTools(12345);

      expect(console.error).toHaveBeenCalledWith('DevToolsManager: error closing DevTools window:', expect.any(Error));
      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0); // Should still cleanup map
    });
  });

  describe('Strategy 1 - tryCloseDevToolsViaWebContents', () => {
    test('should close DevTools via original webContents successfully', async () => {
      const mockGuest = {
        isDestroyed: vi.fn().mockReturnValue(false),
        isDevToolsOpened: vi.fn().mockReturnValue(true),
        closeDevTools: vi.fn(),
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsViaWebContents'
      ]!(12345);

      expect(result).toBe(true);
      expect(mockGuest.closeDevTools).toHaveBeenCalled();
    });

    test('should return false when webContents not found', async () => {
      vi.mocked(mockWebContents.fromId).mockReturnValue(undefined);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsViaWebContents'
      ]!(12345);

      expect(result).toBe(false);
    });

    test('should return false when webContents is destroyed', async () => {
      const mockGuest = {
        isDestroyed: vi.fn().mockReturnValue(true),
        closeDevTools: vi.fn(),
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsViaWebContents'
      ]!(12345);

      expect(result).toBe(false);
      expect(mockGuest.closeDevTools).not.toHaveBeenCalled();
    });

    test('should return false when DevTools are not opened', async () => {
      const mockGuest = {
        isDestroyed: vi.fn().mockReturnValue(false),
        isDevToolsOpened: vi.fn().mockReturnValue(false),
        closeDevTools: vi.fn(),
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsViaWebContents'
      ]!(12345);

      expect(result).toBe(false);
      expect(mockGuest.closeDevTools).not.toHaveBeenCalled();
    });
  });

  describe('Strategy 2 - tryCloseDevToolsDirectly', () => {
    test('should succeed when close() method works', async () => {
      const mockDevToolsWebContents = {
        isDestroyed: vi.fn().mockReturnValue(false),
        close: vi.fn(),
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockDevToolsWebContents as unknown as WebContents);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsDirectly'
      ]!(67890);

      expect(result).toBe(true);
      expect(mockDevToolsWebContents.close).toHaveBeenCalled();
    });

    test('should fallback to destroy() when close() fails', async () => {
      const mockDevToolsWebContents = {
        isDestroyed: vi.fn().mockReturnValue(false),
        close: vi.fn().mockImplementation(() => {
          throw new Error('Close failed');
        }),
        destroy: vi.fn(),
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockDevToolsWebContents as unknown as WebContents);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsDirectly'
      ]!(67890);

      expect(result).toBe(true);
      expect(mockDevToolsWebContents.close).toHaveBeenCalled();
      expect(mockDevToolsWebContents.destroy).toHaveBeenCalled();
    });

    test('should return false when devToolsWebContents not found', async () => {
      vi.mocked(mockWebContents.fromId).mockReturnValue(undefined);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsDirectly'
      ]!(67890);

      expect(result).toBe(false);
    });

    test('should return false when devToolsWebContents is destroyed', async () => {
      const mockDevToolsWebContents = {
        isDestroyed: vi.fn().mockReturnValue(true),
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockDevToolsWebContents as unknown as WebContents);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsDirectly'
      ]!(67890);

      expect(result).toBe(false);
    });

    test('should return false when both close() and destroy() fail', async () => {
      const devToolsWithFailingMethods = {
        isDestroyed: vi.fn().mockReturnValue(false),
        close: vi.fn().mockImplementation(() => {
          throw new Error('close failed');
        }),
        destroy: vi.fn().mockImplementation(() => {
          throw new Error('destroy failed');
        }),
      };

      vi.mocked(mockWebContents.fromId).mockReturnValue(devToolsWithFailingMethods as unknown as WebContents);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsDirectly'
      ]!(67890);

      expect(result).toBe(false);
    });
  });

  describe('Strategy 3 - tryCloseDevToolsViaWindow', () => {
    test('should find and close matching window', async () => {
      const mockWindow = {
        isDestroyed: vi.fn().mockReturnValue(false),
        webContents: { id: 67890 },
        close: vi.fn(),
      };
      vi.mocked(mockBrowserWindow.getAllWindows).mockReturnValue([mockWindow as unknown as BrowserWindow]);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsViaWindow'
      ]!(67890);

      expect(result).toBe(true);
      expect(mockWindow.close).toHaveBeenCalled();
    });

    test('should skip destroyed windows', async () => {
      const destroyedWindow = {
        isDestroyed: vi.fn().mockReturnValue(true),
        close: vi.fn(),
      };
      vi.mocked(mockBrowserWindow.getAllWindows).mockReturnValue([destroyedWindow as unknown as BrowserWindow]);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsViaWindow'
      ]!(67890);

      expect(result).toBe(false);
      expect(destroyedWindow.close).not.toHaveBeenCalled();
    });

    test('should return false when no matching window found', async () => {
      const nonMatchingWindow = {
        isDestroyed: vi.fn().mockReturnValue(false),
        webContents: { id: 99999 },
        close: vi.fn(),
      };
      vi.mocked(mockBrowserWindow.getAllWindows).mockReturnValue([nonMatchingWindow as unknown as BrowserWindow]);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsViaWindow'
      ]!(67890);

      expect(result).toBe(false);
    });

    test('should handle empty windows list', async () => {
      vi.mocked(mockBrowserWindow.getAllWindows).mockReturnValue([]);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsViaWindow'
      ]!(67890);

      expect(result).toBe(false);
    });

    test('should handle multiple windows and find correct one', async () => {
      const window1 = {
        isDestroyed: vi.fn().mockReturnValue(false),
        webContents: { id: 11111 },
        close: vi.fn(),
      };
      const window2 = {
        isDestroyed: vi.fn().mockReturnValue(false),
        webContents: { id: 67890 }, // Matching
        close: vi.fn(),
      };
      const window3 = {
        isDestroyed: vi.fn().mockReturnValue(false),
        webContents: { id: 33333 },
        close: vi.fn(),
      };

      vi.mocked(mockBrowserWindow.getAllWindows).mockReturnValue([
        window1,
        window2,
        window3,
      ] as unknown as BrowserWindow[]);

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseDevToolsViaWindow'
      ]!(67890);

      expect(result).toBe(true);
      expect(window2.close).toHaveBeenCalled();
      expect(window1.close).not.toHaveBeenCalled();
      expect(window3.close).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should log errors without throwing in registerDevTools', async () => {
      vi.mocked(mockWebContents.fromId).mockImplementation(() => {
        throw new Error('Test error');
      });

      await expect(devToolsManager.registerDevTools(12345)).resolves.not.toThrow();
      expect(console.error).toHaveBeenCalledWith('DevToolsManager: error in registerDevTools:', expect.any(Error));
    });

    test('should log errors without throwing in cleanupDevTools', async () => {
      const mockGuest = {
        devToolsWebContents: {
          id: 67890,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);
      await devToolsManager.registerDevTools(12345);

      vi.mocked(mockWebContents.fromId).mockImplementation(() => {
        throw new Error('Cleanup error');
      });

      await expect(devToolsManager.cleanupDevTools(12345)).resolves.not.toThrow();
      expect(console.error).toHaveBeenCalledWith('DevToolsManager: error closing DevTools window:', expect.any(Error));
    });

    test('should continue execution after individual strategy failures', async () => {
      const mockGuest = {
        devToolsWebContents: {
          id: 67890,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);
      await devToolsManager.registerDevTools(12345);

      vi.mocked(mockWebContents.fromId).mockReturnValue(undefined); // Strategy 1 & 2 fail

      const mockWindow = {
        isDestroyed: vi.fn().mockReturnValue(false),
        webContents: { id: 67890 },
        close: vi.fn(),
      };
      vi.mocked(mockBrowserWindow.getAllWindows).mockReturnValue([mockWindow as unknown as BrowserWindow]);

      await devToolsManager.cleanupDevTools(12345);

      expect(mockWindow.close).toHaveBeenCalled();
      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });
  });

  describe('Helper Methods', () => {
    test('tryCloseWebContents should call close() method when available', async () => {
      const mockDevToolsWebContents = {
        close: vi.fn(),
      };

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseWebContents'
      ]!(mockDevToolsWebContents);

      expect(result).toBe(true);
      expect(mockDevToolsWebContents.close).toHaveBeenCalled();
    });

    test('tryCloseWebContents should handle missing close() method', async () => {
      const webContentsWithoutClose = {};

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseWebContents'
      ]!(webContentsWithoutClose);

      expect(result).toBe(true); // Still returns true as close() is optional
    });

    test('tryCloseWebContents should handle close() method errors', async () => {
      const mockDevToolsWebContents = {
        close: vi.fn().mockImplementation(() => {
          throw new Error('Close method failed');
        }),
      };

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryCloseWebContents'
      ]!(mockDevToolsWebContents);

      expect(result).toBe(false);
    });

    test('tryDestroyWebContents should call destroy() method when available', async () => {
      const mockDevToolsWebContents = {
        destroy: vi.fn(),
      };

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryDestroyWebContents'
      ]!(mockDevToolsWebContents);

      expect(result).toBe(true);
      expect(mockDevToolsWebContents.destroy).toHaveBeenCalled();
    });

    test('tryDestroyWebContents should handle missing destroy() method', async () => {
      const webContentsWithoutDestroy = {};

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryDestroyWebContents'
      ]!(webContentsWithoutDestroy);

      expect(result).toBe(true); // Still returns true as destroy() is optional
    });

    test('tryDestroyWebContents should handle destroy() method errors', async () => {
      const mockDevToolsWebContents = {
        destroy: vi.fn().mockImplementation(() => {
          throw new Error('Destroy method failed');
        }),
      };

      const result = await (devToolsManager as unknown as Record<string, (...args: unknown[]) => Promise<boolean>>)[
        'tryDestroyWebContents'
      ]!(mockDevToolsWebContents);

      expect(result).toBe(false);
    });
  });

  describe('Integration Scenarios', () => {
    test('should handle complete workflow: register -> cleanup', async () => {
      const mockGuest = {
        devToolsWebContents: {
          id: 67890,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);
      await devToolsManager.registerDevTools(12345);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(1);

      const mockGuestForCleanup = {
        isDestroyed: vi.fn().mockReturnValue(false),
        isDevToolsOpened: vi.fn().mockReturnValue(true),
        closeDevTools: vi.fn(),
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuestForCleanup as unknown as WebContents);

      await devToolsManager.cleanupDevTools(12345);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
      expect(mockGuestForCleanup.closeDevTools).toHaveBeenCalled();
    });

    test('should handle multiple concurrent registrations', async () => {
      const mockGuest1 = {
        devToolsWebContents: {
          id: 55555,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };
      const mockGuest2 = {
        devToolsWebContents: {
          id: 66666,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };

      vi.mocked(mockWebContents.fromId)
        .mockReturnValueOnce(mockGuest1 as unknown as WebContents)
        .mockReturnValueOnce(mockGuest2 as unknown as WebContents);

      await Promise.all([devToolsManager.registerDevTools(11111), devToolsManager.registerDevTools(22222)]);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(2);
    });

    test('should handle rapid register/cleanup cycles', async () => {
      for (let i = 0; i < 5; i++) {
        const mockGuest = {
          devToolsWebContents: {
            id: 67890 + i,
            isDestroyed: vi.fn().mockReturnValue(false),
          },
        };
        vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);
        await devToolsManager.registerDevTools(12345 + i);

        const mockGuestForCleanup = {
          isDestroyed: vi.fn().mockReturnValue(false),
          isDevToolsOpened: vi.fn().mockReturnValue(true),
          closeDevTools: vi.fn(),
        };
        vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuestForCleanup as unknown as WebContents);
        await devToolsManager.cleanupDevTools(12345 + i);
      }

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });

    test('should handle mixed success/failure scenarios', async () => {
      const mockGuest = {
        devToolsWebContents: {
          id: 67890,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };
      vi.mocked(mockWebContents.fromId)
        .mockReturnValueOnce(mockGuest as unknown as WebContents) // Success
        .mockReturnValueOnce(undefined) // Fail
        .mockReturnValueOnce(mockGuest as unknown as WebContents); // Success

      await devToolsManager.registerDevTools(11111);
      await devToolsManager.registerDevTools(22222);
      await devToolsManager.registerDevTools(33333);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(2);

      const mockGuestForCleanup = {
        isDestroyed: vi.fn().mockReturnValue(false),
        isDevToolsOpened: vi.fn().mockReturnValue(true),
        closeDevTools: vi.fn(),
      };
      const mockWindow = {
        isDestroyed: vi.fn().mockReturnValue(false),
        webContents: { id: 67890 },
        close: vi.fn(),
      };

      vi.mocked(mockWebContents.fromId)
        .mockReturnValueOnce(mockGuestForCleanup as unknown as WebContents) // Strategy 1 succeeds
        .mockReturnValueOnce(undefined); // Strategy 1 fails

      vi.mocked(mockBrowserWindow.getAllWindows).mockReturnValue([mockWindow as unknown as BrowserWindow]); // Strategy 3 succeeds

      await devToolsManager.cleanupDevTools(11111);
      await devToolsManager.cleanupDevTools(33333);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle DevTools WebContents with id 0', async () => {
      const mockGuest = {
        devToolsWebContents: {
          id: 0,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);

      await devToolsManager.registerDevTools(12345);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(1);
    });

    test('should handle negative webContents IDs', async () => {
      vi.mocked(mockWebContents.fromId).mockReturnValue(undefined);

      await devToolsManager.registerDevTools(-1);
      await devToolsManager.cleanupDevTools(-1);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });

    test('should handle cleanup of non-existent entries multiple times', async () => {
      await devToolsManager.cleanupDevTools(99999);
      await devToolsManager.cleanupDevTools(99999);
      await devToolsManager.cleanupDevTools(99999);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(0);
    });

    test('should handle registration with duplicate IDs', async () => {
      const mockGuest = {
        devToolsWebContents: {
          id: 67890,
          isDestroyed: vi.fn().mockReturnValue(false),
        },
      };
      vi.mocked(mockWebContents.fromId).mockReturnValue(mockGuest as unknown as WebContents);

      await devToolsManager.registerDevTools(12345);
      await devToolsManager.registerDevTools(12345);
      await devToolsManager.registerDevTools(12345);

      expect(devToolsManager.getTrackedDevToolsCount()).toBe(1);
    });
  });
});
