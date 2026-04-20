/**********************************************************************
 * Copyright (C) 2022-2026 Red Hat, Inc.
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

import * as fs from 'node:fs';

import { beforeEach, describe, expect, test, vi } from 'vitest';
import wincaAPI from 'win-ca/api';

import { isLinux, isMac, isWindows } from '/@/util.js';

import { Certificates } from './certificates.js';
import { spawnWithPromise } from './util/spawn-promise.js';

let certificate: Certificates;

const BEGIN_CERTIFICATE = '-----BEGIN CERTIFICATE-----';
const END_CERTIFICATE = '-----END CERTIFICATE-----';
const CR = '\n';

// mock spawn
vi.mock(import('node:child_process'), () => {
  return {
    spawn: vi.fn(),
  };
});

vi.mock(import('./util/spawn-promise.js'), () => {
  return {
    spawnWithPromise: vi.fn(),
  };
});

vi.mock(import('node:fs'));

// Fake root certificates for mocking tls.rootCertificates
// These are simple fake PEM strings (not valid X.509, but sufficient for testing fallback behavior)
const FAKE_ROOT_CERTIFICATES = ['fake-cert-1', 'fake-cert-2'];

vi.mock(import('node:tls'), () => {
  return {
    rootCertificates: ['fake-cert-1', 'fake-cert-2'],
  };
});

vi.mock(import('/@/util.js'));

interface WincaProcedure {
  exe: () => string;
  inject: (cert: string) => void;
  der2: {
    pem: string;
  };
}

interface WincaAPIOptions {
  store?: string;
  ondata: (ca: unknown) => void;
  onend?: () => void;
}

vi.mock(import('win-ca/api'), () => {
  const wincaAPI = vi.fn();
  (wincaAPI as unknown as WincaProcedure).exe = vi.fn();
  (wincaAPI as unknown as WincaProcedure).inject = vi.fn();
  (wincaAPI as unknown as WincaProcedure).der2 = { pem: 'pem' };
  return {
    default: wincaAPI,
  };
});

beforeEach(() => {
  certificate = new Certificates();
  vi.clearAllMocks();
});

test('expect parse correctly certificates', async () => {
  const certificateContent = `${BEGIN_CERTIFICATE}${CR}Foo${CR}${END_CERTIFICATE}${CR}${BEGIN_CERTIFICATE}${CR}Bar${CR}${END_CERTIFICATE}${CR}${BEGIN_CERTIFICATE}${CR}Baz${CR}${END_CERTIFICATE}${CR}${BEGIN_CERTIFICATE}${CR}Qux${CR}${END_CERTIFICATE}${CR}`;
  const list = certificate.extractCertificates(certificateContent);
  expect(list.length).toBe(4);

  // strip prefix and suffix, CR
  const stripped = list.map(cert =>
    cert
      .replace(new RegExp(BEGIN_CERTIFICATE, 'g'), '')
      .replace(new RegExp(END_CERTIFICATE, 'g'), '')
      .replace(new RegExp(CR, 'g'), ''),
  );
  expect(stripped).toStrictEqual(['Foo', 'Bar', 'Baz', 'Qux']);
});

describe('Windows', () => {
  beforeEach(() => {
    vi.mocked(isWindows).mockReturnValue(true);
  });

  test('expect retrieve certificates', async () => {
    const rootCertificate = `${BEGIN_CERTIFICATE}${CR}Root${CR}${END_CERTIFICATE}${CR}`;
    const intermediateCertificate = `${BEGIN_CERTIFICATE}${CR}CA${CR}${END_CERTIFICATE}${CR}`;
    vi.mocked(wincaAPI).mockImplementation((options: WincaAPIOptions) => {
      options.ondata(rootCertificate);
      options.ondata(intermediateCertificate);
      if (options.onend) options.onend();
    });
    const certificates = await certificate.retrieveCertificates();
    expect(certificates).toContain(rootCertificate);
    expect(certificates).toContain(intermediateCertificate);
  });

  test('should return tls.rootCertificates when wincaAPI.inject throws', async () => {
    vi.mocked(wincaAPI).mockImplementation((options: WincaAPIOptions) => {
      if (options.onend) options.onend();
    });
    // Mock inject to throw an error - using vi.mocked() so it's properly restored by vi.clearAllMocks()
    vi.mocked((wincaAPI as unknown as WincaProcedure).inject).mockImplementationOnce(() => {
      throw new Error('inject failed');
    });

    const certificates = await certificate.retrieveWindowsCertificates();

    // Should fallback to tls.rootCertificates (mocked as FAKE_ROOT_CERTIFICATES)
    expect(certificates).toEqual(FAKE_ROOT_CERTIFICATES);
  });

  test('should return tls.rootCertificates when wincaAPI throws', async () => {
    vi.mocked(wincaAPI).mockImplementation(() => {
      throw new Error('wincaAPI failed');
    });

    const certificates = await certificate.retrieveWindowsCertificates();

    // Should fallback to tls.rootCertificates (mocked as FAKE_ROOT_CERTIFICATES)
    expect(certificates).toEqual(FAKE_ROOT_CERTIFICATES);
  });
});

describe('init', () => {
  test('should populate allCertificates from retrieveCertificates', async () => {
    const testCerts = ['cert1', 'cert2'];
    vi.spyOn(certificate, 'retrieveCertificates').mockResolvedValue(testCerts);

    await certificate.init();

    expect(certificate.getAllCertificates()).toEqual(testCerts);
  });

  test('should set empty array when no certificates retrieved', async () => {
    vi.spyOn(certificate, 'retrieveCertificates').mockResolvedValue([]);

    await certificate.init();

    expect(certificate.getAllCertificates()).toEqual([]);
  });
});

describe('getAllCertificates', () => {
  test('should return empty array before init', () => {
    expect(certificate.getAllCertificates()).toEqual([]);
  });

  test('should return certificates after init', async () => {
    const testCerts = ['cert1', 'cert2', 'cert3'];
    vi.spyOn(certificate, 'retrieveCertificates').mockResolvedValue(testCerts);

    await certificate.init();

    expect(certificate.getAllCertificates()).toEqual(testCerts);
    expect(certificate.getAllCertificates().length).toBe(3);
  });
});

describe('retrieveCertificates', () => {
  test('should call retrieveMacOSCertificates on macOS', async () => {
    vi.mocked(isMac).mockReturnValue(true);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(false);

    const macCerts = ['mac-cert'];
    vi.spyOn(certificate, 'retrieveMacOSCertificates').mockResolvedValue(macCerts);

    const result = await certificate.retrieveCertificates();

    expect(result).toEqual(macCerts);
  });

  test('should call retrieveLinuxCertificates on Linux', async () => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(true);

    const linuxCerts = ['linux-cert'];
    vi.spyOn(certificate, 'retrieveLinuxCertificates').mockResolvedValue(linuxCerts);

    const result = await certificate.retrieveCertificates();

    expect(result).toEqual(linuxCerts);
  });

  test('should return default root certificates on unknown platform', async () => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(false);

    const result = await certificate.retrieveCertificates();

    // Should return tls.rootCertificates (array)
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('retrieveLinuxCertificates', () => {
  test('should read certificates from ca-certificates.crt when it exists', async () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath: fs.PathLike) => {
      return filePath === '/etc/ssl/certs/ca-certificates.crt';
    });
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(`${BEGIN_CERTIFICATE}${CR}LinuxCert${CR}${END_CERTIFICATE}`);

    const result = await certificate.retrieveLinuxCertificates();

    expect(result.length).toBe(1);
    expect(result[0]).toContain('LinuxCert');
  });

  test('should read certificates from ca-bundle.crt when it exists', async () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath: fs.PathLike) => {
      return filePath === '/etc/ssl/certs/ca-bundle.crt';
    });
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(`${BEGIN_CERTIFICATE}${CR}BundleCert${CR}${END_CERTIFICATE}`);

    const result = await certificate.retrieveLinuxCertificates();

    expect(result.length).toBe(1);
    expect(result[0]).toContain('BundleCert');
  });

  test('should return empty array when no certificate files exist', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    const result = await certificate.retrieveLinuxCertificates();

    expect(result).toEqual([]);
  });

  test('should remove duplicate certificates', async () => {
    const duplicateCert = `${BEGIN_CERTIFICATE}${CR}DuplicateCert${CR}${END_CERTIFICATE}`;
    // Both files exist and contain the same certificate
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(duplicateCert);

    const result = await certificate.retrieveLinuxCertificates();

    // Same certificate from both files should be deduplicated to 1
    expect(result.length).toBe(1);
  });

  test('should handle extractCertificates errors gracefully', async () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath: fs.PathLike) => {
      return filePath === '/etc/ssl/certs/ca-certificates.crt';
    });
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue('some content');
    vi.spyOn(certificate, 'extractCertificates').mockImplementation(() => {
      throw new Error('Extraction error');
    });

    const result = await certificate.retrieveLinuxCertificates();

    expect(result).toEqual([]);
  });
});

describe('getMacOSCertificates', () => {
  test('should return certificates when spawn succeeds', async () => {
    const certContent = `${BEGIN_CERTIFICATE}${CR}MacCert${CR}${END_CERTIFICATE}`;
    vi.mocked(spawnWithPromise).mockResolvedValue({
      stdout: certContent,
      exitCode: 0,
    });

    const result = await certificate.getMacOSCertificates();

    expect(result.length).toBe(1);
    expect(result[0]).toContain('MacCert');
  });

  test('should pass key parameter when provided', async () => {
    vi.mocked(spawnWithPromise).mockResolvedValue({
      stdout: `${BEGIN_CERTIFICATE}${CR}KeychainCert${CR}${END_CERTIFICATE}`,
      exitCode: 0,
    });

    await certificate.getMacOSCertificates('/System/Library/Keychains/SystemRootCertificates.keychain');

    expect(spawnWithPromise).toHaveBeenCalledWith('/usr/bin/security', [
      'find-certificate',
      '-a',
      '-p',
      '/System/Library/Keychains/SystemRootCertificates.keychain',
    ]);
  });

  test('should return empty array when spawn has error', async () => {
    vi.mocked(spawnWithPromise).mockResolvedValue({
      stdout: '',
      exitCode: 1,
      error: 'spawn error',
    });

    const result = await certificate.getMacOSCertificates();

    expect(result).toEqual([]);
  });

  test('should return empty array when certificate extraction throws', async () => {
    vi.mocked(spawnWithPromise).mockResolvedValue({
      stdout: 'some content',
      exitCode: 0,
    });
    vi.spyOn(certificate, 'extractCertificates').mockImplementation(() => {
      throw new Error('Extraction error');
    });

    const result = await certificate.getMacOSCertificates();

    expect(result).toEqual([]);
  });
});

describe('retrieveMacOSCertificates', () => {
  test('should combine root and user certificates', async () => {
    const rootCert = `${BEGIN_CERTIFICATE}${CR}RootCert${CR}${END_CERTIFICATE}`;
    const userCert = `${BEGIN_CERTIFICATE}${CR}UserCert${CR}${END_CERTIFICATE}`;

    vi.mocked(spawnWithPromise)
      .mockResolvedValueOnce({ stdout: rootCert, exitCode: 0 })
      .mockResolvedValueOnce({ stdout: userCert, exitCode: 0 });

    const result = await certificate.retrieveMacOSCertificates();

    expect(result.length).toBe(2);
    expect(result[0]).toContain('RootCert');
    expect(result[1]).toContain('UserCert');
  });
});

describe('extractCertificates', () => {
  test('should return empty array for empty content', () => {
    const result = certificate.extractCertificates('');

    expect(result).toEqual([]);
  });

  test('should return empty array for whitespace only content', () => {
    const result = certificate.extractCertificates('   \n\t  ');

    expect(result).toEqual([]);
  });

  test('should extract single certificate', () => {
    const content = `${BEGIN_CERTIFICATE}${CR}SingleCert${CR}${END_CERTIFICATE}`;

    const result = certificate.extractCertificates(content);

    expect(result.length).toBe(1);
  });

  test('should handle certificates without trailing newline', () => {
    const content = `${BEGIN_CERTIFICATE}${CR}Cert1${CR}${END_CERTIFICATE}${BEGIN_CERTIFICATE}${CR}Cert2${CR}${END_CERTIFICATE}`;

    const result = certificate.extractCertificates(content);

    expect(result.length).toBe(2);
  });
});
