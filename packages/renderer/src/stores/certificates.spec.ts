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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { get } from 'svelte/store';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { CertificateInfo } from '/@api/certificate-info';

import { certificatesEventStore, certificatesInfos, filtered, searchPattern } from './certificates';

// first, patch window object
const callbacks = new Map<string, any>();
const eventEmitter = {
  receive: (message: string, callback: any): void => {
    callbacks.set(message, callback);
  },
};

const listCertificatesMock: Mock<() => Promise<CertificateInfo[]>> = vi.fn();

Object.defineProperty(global, 'window', {
  value: {
    listCertificates: listCertificatesMock,
    events: {
      receive: eventEmitter.receive,
    },
    addEventListener: eventEmitter.receive,
  },
  writable: true,
});

// We always mock findMatchInLeaves to return true so we can test certificates.ts without having to render
// the component, as we are not testing the $searchPattern store / functionality.
vi.mock('./search-util', () => ({
  findMatchInLeaves: vi.fn(() => true),
}));

beforeEach(() => {
  vi.clearAllMocks();
  searchPattern.set('');
  certificatesEventStore.setup();
});

const mockCertificate = (overrides: Partial<CertificateInfo> = {}): CertificateInfo => ({
  subjectCommonName: 'Test Certificate',
  subject: 'CN=Test Certificate, O=Test Org, C=US',
  issuerCommonName: 'Test Issuer',
  issuer: 'CN=Test Issuer, O=Test Org, C=US',
  serialNumber: '01',
  validFrom: new Date('2024-01-01'),
  validTo: new Date('2025-01-01'),
  isCA: false,
  ...overrides,
});

describe('certificates store', () => {
  test('certificates should be loaded after extensions-started event', async () => {
    listCertificatesMock.mockResolvedValue([mockCertificate({ subjectCommonName: 'Cert 1', serialNumber: '01' })]);

    const callback = callbacks.get('extensions-started');
    expect(callback).toBeDefined();
    await callback();

    await vi.waitFor(() => {
      const certificates = get(certificatesInfos);
      expect(certificates.length).toBe(1);
      expect(certificates[0]?.subjectCommonName).toBe('Cert 1');
      expect(certificates[0]?.serialNumber).toBe('01');
    });
  });

  test('should handle empty certificate list', async () => {
    listCertificatesMock.mockResolvedValue([]);

    const callback = callbacks.get('extensions-started');
    await callback();

    await vi.waitFor(() => {
      const certificates = get(certificatesInfos);
      expect(certificates.length).toBe(0);
    });
  });

  test('should handle multiple certificates', async () => {
    listCertificatesMock.mockResolvedValue([
      mockCertificate({ subjectCommonName: 'Root CA', serialNumber: '01', isCA: true }),
      mockCertificate({ subjectCommonName: 'Intermediate CA', serialNumber: '02', isCA: true }),
      mockCertificate({ subjectCommonName: 'End Entity', serialNumber: '03', isCA: false }),
    ]);

    const callback = callbacks.get('extensions-started');
    await callback();

    await vi.waitFor(() => {
      const certificates = get(certificatesInfos);
      expect(certificates.length).toBe(3);
      expect(certificates[0]?.subjectCommonName).toBe('Root CA');
      expect(certificates[0]?.isCA).toBe(true);
      expect(certificates[2]?.subjectCommonName).toBe('End Entity');
      expect(certificates[2]?.isCA).toBe(false);
    });
  });

  test('should handle certificates with undefined dates', async () => {
    listCertificatesMock.mockResolvedValue([
      mockCertificate({
        subjectCommonName: 'Non parsable certificate',
        validFrom: undefined,
        validTo: undefined,
      }),
    ]);

    const callback = callbacks.get('extensions-started');
    await callback();

    await vi.waitFor(() => {
      const certificates = get(certificatesInfos);
      expect(certificates.length).toBe(1);
      expect(certificates[0]?.subjectCommonName).toBe('Non parsable certificate');
      expect(certificates[0]?.validFrom).toBeUndefined();
      expect(certificates[0]?.validTo).toBeUndefined();
    });
  });
});

describe('filtered certificates', () => {
  test('filtered should return all certificates when search pattern is empty', async () => {
    listCertificatesMock.mockResolvedValue([
      mockCertificate({ subjectCommonName: 'Cert A', serialNumber: '01' }),
      mockCertificate({ subjectCommonName: 'Cert B', serialNumber: '02' }),
    ]);

    const callback = callbacks.get('extensions-started');
    await callback();

    await vi.waitFor(() => {
      const certificates = get(filtered);
      expect(certificates.length).toBe(2);
    });
  });

  test('filtered should include CA and non-CA certificates', async () => {
    listCertificatesMock.mockResolvedValue([
      mockCertificate({ subjectCommonName: 'CA Cert', serialNumber: '01', isCA: true }),
      mockCertificate({ subjectCommonName: 'Leaf Cert', serialNumber: '02', isCA: false }),
    ]);

    certificatesEventStore.setup();

    const callback = callbacks.get('extensions-started');
    await callback();

    await vi.waitFor(() => {
      const certificates = get(filtered);
      expect(certificates.length).toBe(2);
      expect(certificates.some(c => c.isCA)).toBe(true);
      expect(certificates.some(c => !c.isCA)).toBe(true);
    });
  });

  test('filtered should include self-signed root CA certificates', async () => {
    const selfSignedCert = mockCertificate({
      subjectCommonName: 'Root CA',
      subject: 'CN=Root CA, O=Org, C=US',
      issuerCommonName: 'Root CA',
      issuer: 'CN=Root CA, O=Org, C=US',
      serialNumber: '01',
      isCA: true,
    });

    listCertificatesMock.mockResolvedValue([selfSignedCert]);

    const callback = callbacks.get('extensions-started');
    await callback();

    await vi.waitFor(() => {
      const certificates = get(filtered);
      expect(certificates.length).toBe(1);
      expect(certificates[0]?.subject).toBe(certificates[0]?.issuer);
      expect(certificates[0]?.isCA).toBe(true);
    });
  });
});
