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

import type { Dirent } from 'node:fs';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';

import type { TelemetryLogger } from '@podman-desktop/api';
import { env } from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { type CertificateDetectionConfig, CertificateDetectionService } from './certificate-detection-service';

vi.mock('node:fs/promises');
vi.mock('node:os');

vi.mock('@podman-desktop/api', async () => {
  return {
    env: {
      isWindows: false,
      isMac: false,
      isLinux: false,
    },
  };
});

const mockTelemetryLogger = {
  logUsage: vi.fn(),
  logError: vi.fn(),
  onDidChangeEnableStates: vi.fn(),
  isUsageEnabled: true,
  isErrorsEnabled: true,
  dispose: vi.fn(),
} as TelemetryLogger;

describe('CertificateDetectionService', () => {
  let service: CertificateDetectionService;

  const createMockFileSystemWithCerts = (registryName: string, certFiles: Dirent[]): void => {
    const mockDirent = {
      name: registryName,
      isDirectory: (): boolean => true,
      isFile: (): boolean => false,
      isSymbolicLink: (): boolean => false,
      isBlockDevice: (): boolean => false,
      isCharacterDevice: (): boolean => false,
      isFIFO: (): boolean => false,
      isSocket: (): boolean => false,
      path: registryName,
      parentPath: '/etc/containers/certs.d',
    } as Dirent;

    vi.mocked(fs.access).mockResolvedValue();
    vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
      const pathStr = String(dirPath);
      if (pathStr === '/etc/containers/certs.d') {
        return [mockDirent] as unknown as Dirent<Buffer>[];
      }
      if (pathStr.includes(registryName)) {
        return certFiles as unknown as Dirent<Buffer>[];
      }
      return [] as unknown as Dirent<Buffer>[];
    });
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(env).isWindows = false;
    vi.mocked(env).isMac = false;
    vi.mocked(env).isLinux = false;
    vi.mocked(os.homedir).mockReturnValue('/home/user');
    service = new CertificateDetectionService();
  });

  describe('constructor', () => {
    test('should create service with default config when no config provided', () => {
      const serviceWithDefaults = new CertificateDetectionService();
      expect(serviceWithDefaults).toBeDefined();
    });

    test('should create service with telemetry logger', () => {
      const serviceWithTelemetry = new CertificateDetectionService(mockTelemetryLogger);
      expect(serviceWithTelemetry).toBeDefined();
    });

    test('should merge provided config with defaults', () => {
      const customConfig: Partial<CertificateDetectionConfig> = {
        scanTimeoutMs: 5000,
        validCertExtensions: ['.crt'],
      };
      const serviceWithConfig = new CertificateDetectionService(undefined, customConfig);
      expect(serviceWithConfig).toBeDefined();
    });
  });

  describe('detectCustomCertificates', () => {
    test('should return result with no certificates when directories do not exist', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT: no such file or directory'));

      const result = await service.detectCustomCertificates();

      expect(result).toMatchObject({
        hasCustomCertificates: false,
        certificateCount: 0,
        scanDurationMs: expect.any(Number),
        errors: [],
        isWindows: false,
        isMac: false,
        isLinux: false,
      });
    });

    test('should detect certificates in system directory', async () => {
      const mockDirent = {
        name: 'registry.example.com',
        isDirectory: (): boolean => true,
        isFile: (): boolean => false,
        isSymbolicLink: (): boolean => false,
        isBlockDevice: (): boolean => false,
        isCharacterDevice: (): boolean => false,
        isFIFO: (): boolean => false,
        isSocket: (): boolean => false,
        path: 'registry.example.com',
        parentPath: '/etc/containers/certs.d',
      } as Dirent;
      const mockCertFile = {
        name: 'ca.crt',
        isDirectory: (): boolean => false,
        isFile: (): boolean => true,
        isSymbolicLink: (): boolean => false,
        isBlockDevice: (): boolean => false,
        isCharacterDevice: (): boolean => false,
        isFIFO: (): boolean => false,
        isSocket: (): boolean => false,
        path: 'ca.crt',
        parentPath: '/etc/containers/certs.d/registry.example.com',
      } as Dirent;

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return [mockDirent] as unknown as Dirent<Buffer>[];
        }
        if (pathStr.includes('registry.example.com')) {
          return [mockCertFile] as unknown as Dirent<Buffer>[];
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      const result = await service.detectCustomCertificates();

      expect(result).toMatchObject({
        hasCustomCertificates: true,
        certificateCount: 1,
        scanDurationMs: expect.any(Number),
        errors: [],
      });
    });

    test('should detect certificates in user directory', async () => {
      const mockDirent = {
        name: 'localhost:5000',
        isDirectory: (): boolean => true,
        isFile: (): boolean => false,
        isSymbolicLink: (): boolean => false,
        isBlockDevice: (): boolean => false,
        isCharacterDevice: (): boolean => false,
        isFIFO: (): boolean => false,
        isSocket: (): boolean => false,
        path: 'localhost:5000',
        parentPath: '/home/user/.config/containers/certs.d',
      } as Dirent;
      const mockCertFile = {
        name: 'server.cert',
        isDirectory: (): boolean => false,
        isFile: (): boolean => true,
        isSymbolicLink: (): boolean => false,
        isBlockDevice: (): boolean => false,
        isCharacterDevice: (): boolean => false,
        isFIFO: (): boolean => false,
        isSocket: (): boolean => false,
        path: 'server.cert',
        parentPath: '/home/user/.config/containers/certs.d/localhost:5000',
      } as Dirent;

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr.includes('.config/containers/certs.d') && !pathStr.includes('localhost:5000')) {
          return [mockDirent] as unknown as Dirent<Buffer>[];
        }
        if (pathStr.includes('localhost:5000')) {
          return [mockCertFile] as unknown as Dirent<Buffer>[];
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      const result = await service.detectCustomCertificates();

      expect(result).toMatchObject({
        hasCustomCertificates: true,
        certificateCount: 1,
      });
    });

    test('should handle scan timeout', async () => {
      const shortTimeoutConfig: Partial<CertificateDetectionConfig> = {
        scanTimeoutMs: 1,
      };
      const serviceWithTimeout = new CertificateDetectionService(undefined, shortTimeoutConfig);

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 100)));

      const result = await serviceWithTimeout.detectCustomCertificates();

      expect(result).toMatchObject({
        hasCustomCertificates: false,
        certificateCount: 0,
        errors: [{ error: 'Scan operation timed out' }],
      });
    });

    test('should handle general errors gracefully', async () => {
      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockRejectedValue(new Error('Critical file system error'));

      const result = await service.detectCustomCertificates();

      expect(result).toMatchObject({
        hasCustomCertificates: false,
        certificateCount: 0,
      });
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
      expect(result.errors![0]).toMatchObject({
        error: 'Critical file system error',
      });
    });

    test('should send telemetry when enabled', async () => {
      const serviceWithTelemetry = new CertificateDetectionService(mockTelemetryLogger);
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      await serviceWithTelemetry.detectCustomCertificates();

      expect(mockTelemetryLogger.logUsage).toHaveBeenCalledWith(
        'custom_certs',
        expect.objectContaining({
          using_custom_certificates: false,
          certificate_count: 0,
          scan_duration_ms: expect.any(Number),
          is_windows: false,
          is_linux: false,
          is_mac: false,
          errors: '',
        }),
      );
    });

    test('should not send telemetry when disabled', async () => {
      const noTelemetryConfig: Partial<CertificateDetectionConfig> = {
        enableTelemetry: false,
      };
      const serviceWithoutTelemetry = new CertificateDetectionService(mockTelemetryLogger, noTelemetryConfig);
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      await serviceWithoutTelemetry.detectCustomCertificates();

      expect(mockTelemetryLogger.logUsage).not.toHaveBeenCalled();
    });
  });

  describe('platform detection', () => {
    test('should detect Windows environment', async () => {
      vi.mocked(env).isWindows = true;
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      const result = await service.detectCustomCertificates();

      expect(result).toMatchObject({
        isWindows: true,
        isMac: false,
        isLinux: false,
      });
    });

    test('should detect macOS environment', async () => {
      vi.mocked(env).isMac = true;
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      const result = await service.detectCustomCertificates();

      expect(result).toMatchObject({
        isWindows: false,
        isMac: true,
        isLinux: false,
      });
    });

    test('should detect Linux environment', async () => {
      vi.mocked(env).isLinux = true;
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      const result = await service.detectCustomCertificates();

      expect(result).toMatchObject({
        isWindows: false,
        isMac: false,
        isLinux: true,
      });
    });
  });

  describe('Windows/WSL2 path handling', () => {
    test('should handle Windows paths correctly', async () => {
      vi.mocked(env).isWindows = true;
      vi.mocked(os.homedir).mockReturnValue('C:\\Users\\testuser');

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockResolvedValue([]);

      const result = await service.detectCustomCertificates();

      expect(result.isWindows).toBe(true);
      expect(fs.access).toHaveBeenCalledWith('/etc/containers/certs.d', expect.any(Number));
      expect(fs.access).toHaveBeenCalledWith(expect.stringContaining('testuser'), expect.any(Number));
    });

    test('should handle WSL2 paths correctly', async () => {
      vi.mocked(env).isWindows = true;
      vi.mocked(os.homedir).mockReturnValue('/mnt/c/Users/testuser');

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockResolvedValue([]);

      await service.detectCustomCertificates();

      expect(fs.access).toHaveBeenCalledWith('/etc/containers/certs.d', expect.any(Number));
      expect(fs.access).toHaveBeenCalledWith(expect.stringContaining('mnt/c/Users/testuser'), expect.any(Number));
    });

    test('should handle macOS paths correctly', async () => {
      vi.mocked(env).isMac = true;
      vi.mocked(os.homedir).mockReturnValue('/Users/testuser');

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockResolvedValue([]);

      await service.detectCustomCertificates();

      expect(fs.access).toHaveBeenCalledWith('/etc/containers/certs.d', expect.any(Number));
      expect(fs.access).toHaveBeenCalledWith(expect.stringContaining('Users/testuser'), expect.any(Number));
    });

    test('should handle Linux paths correctly', async () => {
      vi.mocked(env).isLinux = true;
      vi.mocked(os.homedir).mockReturnValue('/home/testuser');

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockResolvedValue([]);

      await service.detectCustomCertificates();

      expect(fs.access).toHaveBeenCalledWith('/etc/containers/certs.d', expect.any(Number));
      expect(fs.access).toHaveBeenCalledWith(expect.stringContaining('home/testuser'), expect.any(Number));
    });
  });

  describe('certificate file validation', () => {
    test('should count valid certificate extensions', async () => {
      const mockFiles = [
        {
          name: 'ca.crt',
          isDirectory: (): boolean => false,
          isFile: (): boolean => true,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'ca.crt',
          parentPath: '/etc/containers/certs.d/registry.example.com',
        },
        {
          name: 'server.cert',
          isDirectory: (): boolean => false,
          isFile: (): boolean => true,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'server.cert',
          parentPath: '/etc/containers/certs.d/registry.example.com',
        },
        {
          name: 'client.key',
          isDirectory: (): boolean => false,
          isFile: (): boolean => true,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'client.key',
          parentPath: '/etc/containers/certs.d/registry.example.com',
        },
      ] as Dirent[];

      createMockFileSystemWithCerts('registry.example.com', mockFiles);

      const result = await service.detectCustomCertificates();

      expect(result.certificateCount).toBe(3);
    });

    test('should exclude files with excluded extensions', async () => {
      const mockFiles = [
        {
          name: 'ca.crt',
          isDirectory: (): boolean => false,
          isFile: (): boolean => true,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'ca.crt',
          parentPath: '/etc/containers/certs.d/registry.example.com',
        },
        {
          name: 'excluded.pem',
          isDirectory: (): boolean => false,
          isFile: (): boolean => true,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'excluded.pem',
          parentPath: '/etc/containers/certs.d/registry.example.com',
        },
        {
          name: 'excluded.cer',
          isDirectory: (): boolean => false,
          isFile: (): boolean => true,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'excluded.cer',
          parentPath: '/etc/containers/certs.d/registry.example.com',
        },
      ] as Dirent[];

      createMockFileSystemWithCerts('registry.example.com', mockFiles);

      const result = await service.detectCustomCertificates();

      expect(result.certificateCount).toBe(1);
    });

    test('should ignore files in root directory (depth 0)', async () => {
      const mockFiles = [
        {
          name: 'ca.crt',
          isDirectory: (): boolean => false,
          isFile: (): boolean => true,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'ca.crt',
          parentPath: '/etc/containers/certs.d',
        },
        {
          name: 'registry.example.com',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'registry.example.com',
          parentPath: '/etc/containers/certs.d',
        },
      ] as Dirent[];

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return mockFiles as unknown as Dirent<Buffer>[];
        }
        if (pathStr.includes('registry.example.com')) {
          return [] as unknown as Dirent<Buffer>[];
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      const result = await service.detectCustomCertificates();

      expect(result.certificateCount).toBe(0);
    });
  });

  describe('registry directory validation', () => {
    test('should accept valid hostname formats', async () => {
      const validDirectories = [
        {
          name: 'registry.example.com',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'registry.example.com',
          parentPath: '/etc/containers/certs.d',
        },
        {
          name: 'localhost',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'localhost',
          parentPath: '/etc/containers/certs.d',
        },
        {
          name: 'example.com',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'example.com',
          parentPath: '/etc/containers/certs.d',
        },
      ] as Dirent[];

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return validDirectories as unknown as Dirent<Buffer>[];
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      await service.detectCustomCertificates();

      expect(fs.readdir).toHaveBeenCalledWith(expect.stringContaining('registry.example.com'), expect.any(Object));
      expect(fs.readdir).toHaveBeenCalledWith(expect.stringContaining('localhost'), expect.any(Object));
      expect(fs.readdir).toHaveBeenCalledWith(expect.stringContaining('example.com'), expect.any(Object));
    });

    test('should accept valid hostname:port formats', async () => {
      const validDirectories = [
        {
          name: 'registry.example.com:5000',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'registry.example.com:5000',
          parentPath: '/etc/containers/certs.d',
        },
        {
          name: 'localhost:8080',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'localhost:8080',
          parentPath: '/etc/containers/certs.d',
        },
      ] as Dirent[];

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return validDirectories as unknown as Dirent<Buffer>[];
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      await service.detectCustomCertificates();

      expect(fs.readdir).toHaveBeenCalledWith(expect.stringContaining('registry.example.com:5000'), expect.any(Object));
      expect(fs.readdir).toHaveBeenCalledWith(expect.stringContaining('localhost:8080'), expect.any(Object));
    });

    test('should reject invalid directory names', async () => {
      const invalidDirectories = [
        {
          name: '.hidden',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: '.hidden',
          parentPath: '/etc/containers/certs.d',
        },
        {
          name: '-invalid',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: '-invalid',
          parentPath: '/etc/containers/certs.d',
        },
        {
          name: 'invalid_name',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'invalid_name',
          parentPath: '/etc/containers/certs.d',
        },
      ] as Dirent[];

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return invalidDirectories as unknown as Dirent<Buffer>[];
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      await service.detectCustomCertificates();

      expect(fs.readdir).not.toHaveBeenCalledWith(expect.stringContaining('.hidden'), expect.any(Object));
      expect(fs.readdir).not.toHaveBeenCalledWith(expect.stringContaining('-invalid'), expect.any(Object));
      expect(fs.readdir).not.toHaveBeenCalledWith(expect.stringContaining('invalid_name'), expect.any(Object));
    });

    test('should ignore symbolic links by default', async () => {
      const directories = [
        {
          name: 'registry.example.com',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => true,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'registry.example.com',
          parentPath: '/etc/containers/certs.d',
        },
        {
          name: 'localhost',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'localhost',
          parentPath: '/etc/containers/certs.d',
        },
      ] as Dirent[];

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return directories as unknown as Dirent<Buffer>[];
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      await service.detectCustomCertificates();

      expect(fs.readdir).not.toHaveBeenCalledWith(expect.stringContaining('registry.example.com'), expect.any(Object));
      expect(fs.readdir).toHaveBeenCalledWith(expect.stringContaining('localhost'), expect.any(Object));
    });

    test('should follow symbolic links when configured', async () => {
      const followSymlinksConfig: Partial<CertificateDetectionConfig> = {
        followSymlinks: true,
      };
      const serviceWithSymlinks = new CertificateDetectionService(undefined, followSymlinksConfig);

      const mockDirent = {
        name: 'registry.example.com',
        isDirectory: (): boolean => true,
        isFile: (): boolean => false,
        isSymbolicLink: (): boolean => false,
        isBlockDevice: (): boolean => false,
        isCharacterDevice: (): boolean => false,
        isFIFO: (): boolean => false,
        isSocket: (): boolean => false,
        path: 'registry.example.com',
        parentPath: '/etc/containers/certs.d',
      } as Dirent;
      const mockSymlinkFile = {
        name: 'symlink.crt',
        isDirectory: (): boolean => false,
        isFile: (): boolean => false,
        isSymbolicLink: (): boolean => true,
        isBlockDevice: (): boolean => false,
        isCharacterDevice: (): boolean => false,
        isFIFO: (): boolean => false,
        isSocket: (): boolean => false,
        path: 'symlink.crt',
        parentPath: '/etc/containers/certs.d/registry.example.com',
      } as Dirent;

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return [mockDirent] as unknown as Dirent<Buffer>[];
        }
        if (pathStr.includes('registry.example.com')) {
          return [mockSymlinkFile] as unknown as Dirent<Buffer>[];
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      const result = await serviceWithSymlinks.detectCustomCertificates();

      expect(result.certificateCount).toBe(1);
    });
  });

  describe('error handling', () => {
    test('should collect directory scan errors', async () => {
      const mockDirent = {
        name: 'registry.example.com',
        isDirectory: (): boolean => true,
        isFile: (): boolean => false,
        isSymbolicLink: (): boolean => false,
        isBlockDevice: (): boolean => false,
        isCharacterDevice: (): boolean => false,
        isFIFO: (): boolean => false,
        isSocket: (): boolean => false,
        path: 'registry.example.com',
        parentPath: '/etc/containers/certs.d',
      } as Dirent;

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return [mockDirent] as unknown as Dirent<Buffer>[];
        }
        if (pathStr.includes('registry.example.com')) {
          const error = new Error('Permission denied') as NodeJS.ErrnoException;
          error.code = 'EACCES';
          throw error;
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      const result = await service.detectCustomCertificates();

      expect(result.errors).toEqual([{ error: 'Permission denied', code: 'EACCES' }]);
    });

    test('should continue scanning after directory errors', async () => {
      const mockDirents = [
        {
          name: 'registry.example.com',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'registry.example.com',
          parentPath: '/etc/containers/certs.d',
        },
        {
          name: 'localhost',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'localhost',
          parentPath: '/etc/containers/certs.d',
        },
      ] as Dirent[];
      const mockCertFile = {
        name: 'ca.crt',
        isDirectory: (): boolean => false,
        isFile: (): boolean => true,
        isSymbolicLink: (): boolean => false,
        isBlockDevice: (): boolean => false,
        isCharacterDevice: (): boolean => false,
        isFIFO: (): boolean => false,
        isSocket: (): boolean => false,
        path: 'ca.crt',
        parentPath: '/etc/containers/certs.d/localhost',
      } as Dirent;

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return mockDirents as unknown as Dirent<Buffer>[];
        }
        if (pathStr.includes('registry.example.com')) {
          throw new Error('Permission denied');
        }
        if (pathStr.includes('localhost')) {
          return [mockCertFile] as unknown as Dirent<Buffer>[];
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      const result = await service.detectCustomCertificates();

      expect(result.certificateCount).toBe(1);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('updateConfig', () => {
    test('should update configuration', () => {
      const newConfig: Partial<CertificateDetectionConfig> = {
        scanTimeoutMs: 15000,
        validCertExtensions: ['.crt', '.pem'],
      };

      expect(() => service.updateConfig(newConfig)).not.toThrow();
    });
  });

  describe('telemetry formatting', () => {
    test('should format errors correctly in telemetry', async () => {
      const serviceWithTelemetry = new CertificateDetectionService(mockTelemetryLogger);

      const mockDirent = {
        name: 'registry.example.com',
        isDirectory: (): boolean => true,
        isFile: (): boolean => false,
        isSymbolicLink: (): boolean => false,
        isBlockDevice: (): boolean => false,
        isCharacterDevice: (): boolean => false,
        isFIFO: (): boolean => false,
        isSocket: (): boolean => false,
        path: 'registry.example.com',
        parentPath: '/etc/containers/certs.d',
      } as Dirent;

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return [mockDirent] as unknown as Dirent<Buffer>[];
        }
        if (pathStr.includes('registry.example.com')) {
          const error = new Error('Access denied') as NodeJS.ErrnoException;
          error.code = 'EACCES';
          throw error;
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      await serviceWithTelemetry.detectCustomCertificates();

      expect(mockTelemetryLogger.logUsage).toHaveBeenCalledWith(
        'custom_certs',
        expect.objectContaining({
          errors: 'Access denied (EACCES)',
        }),
      );
    });

    test('should format multiple errors correctly in telemetry', async () => {
      const serviceWithTelemetry = new CertificateDetectionService(mockTelemetryLogger);
      const mockDirents = [
        {
          name: 'registry1.example.com',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'registry1.example.com',
          parentPath: '/etc/containers/certs.d',
        },
        {
          name: 'registry2.example.com',
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          path: 'registry2.example.com',
          parentPath: '/etc/containers/certs.d',
        },
      ] as Dirent[];

      vi.mocked(fs.access).mockResolvedValue();
      vi.mocked(fs.readdir).mockImplementation(async (dirPath: unknown) => {
        const pathStr = String(dirPath);
        if (pathStr === '/etc/containers/certs.d') {
          return mockDirents as unknown as Dirent<Buffer>[];
        }
        if (pathStr.includes('registry1.example.com')) {
          const error = new Error('Error 1') as NodeJS.ErrnoException;
          error.code = 'EACCES';
          throw error;
        }
        if (pathStr.includes('registry2.example.com')) {
          throw new Error('Error 2');
        }
        return [] as unknown as Dirent<Buffer>[];
      });

      await serviceWithTelemetry.detectCustomCertificates();

      expect(mockTelemetryLogger.logUsage).toHaveBeenCalledWith(
        'custom_certs',
        expect.objectContaining({
          errors: 'Error 1 (EACCES); Error 2',
        }),
      );
    });
  });
});
