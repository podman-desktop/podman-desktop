/**********************************************************************
 * Copyright (C) 2022 Red Hat, Inc.
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

import { beforeEach, describe, expect, test, vi } from 'vitest';
import wincaAPI from 'win-ca/api';

import { isWindows } from '/@/util.js';

import { Certificates } from './certificates.js';

let certificate: Certificates;

const BEGIN_CERTIFICATE = '-----BEGIN CERTIFICATE-----';
const END_CERTIFICATE = '-----END CERTIFICATE-----';
const CR = '\n';

// mock spawn
vi.mock('node:child_process', () => {
  return {
    spawn: vi.fn(),
  };
});

vi.mock('../util.js', () => {
  return {
    isWindows: vi.fn(),
    isMac: vi.fn(),
    isLinux: vi.fn(),
  };
});

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

vi.mock('win-ca/api', () => {
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
});
