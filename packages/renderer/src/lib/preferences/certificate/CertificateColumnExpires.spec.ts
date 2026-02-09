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

import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import type { CertificateInfo } from '/@api/certificate-info';

import { formatExpirationDate } from './certificate-util';
import CertificateColumnExpires from './CertificateColumnExpires.svelte';

const baseCertificate: CertificateInfo = {
  subjectCommonName: 'Test Certificate',
  subject: 'CN=Test Certificate, O=Test Org, C=US',
  issuerCommonName: 'Test Issuer',
  issuer: 'CN=Test Issuer, O=Issuer Org, C=US',
  serialNumber: 'ABC123',
  validFrom: '2024-01-01T00:00:00.000Z',
  validTo: '2030-12-31T00:00:00.000Z',
  isCA: false,
};

describe('CertificateColumnExpires should show', () => {
  test('"Valid until" tooltip for certificate expiring in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const futureCert: CertificateInfo = {
      ...baseCertificate,
      validTo: futureDate.toISOString(),
    };

    render(CertificateColumnExpires, { props: { object: futureCert } });

    const element = screen.getByTitle(/^Valid until:/);
    expect(element).toBeInTheDocument();
  });

  test('"Expired" tooltip for certificate that expired in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const expiredCert: CertificateInfo = {
      ...baseCertificate,
      validTo: pastDate.toISOString(),
    };

    render(CertificateColumnExpires, { props: { object: expiredCert } });

    const element = screen.getByTitle(/^Expired:/);
    expect(element).toBeInTheDocument();
  });

  test('"Expiration date: Unknown" tooltip when validTo is undefined', () => {
    const unknownDateCert: CertificateInfo = {
      ...baseCertificate,
      validTo: undefined,
    };

    render(CertificateColumnExpires, { props: { object: unknownDateCert } });

    const element = screen.getByTitle('Expiration date: Unknown');
    expect(element).toBeInTheDocument();
  });

  test('"Unknown" as the date text when validTo is undefined', () => {
    const unknownDateCert: CertificateInfo = {
      ...baseCertificate,
      validTo: undefined,
    };

    render(CertificateColumnExpires, { props: { object: unknownDateCert } });

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  test('formatted date when validTo is defined', () => {
    const validTo = '2030-12-31T00:00:00.000Z';
    const cert: CertificateInfo = {
      ...baseCertificate,
      validTo,
    };

    render(CertificateColumnExpires, { props: { object: cert } });

    // Use the same formatting function as the component
    const expectedDate = formatExpirationDate(validTo);
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
});
