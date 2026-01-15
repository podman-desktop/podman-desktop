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

import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import type { CertificateInfo } from '/@api/certificate-info';

import CertificateExpirationIcon from './CertificateExpirationIcon.svelte';

const validCertificate: CertificateInfo = {
  subjectCommonName: 'Test Certificate',
  subject: 'CN=Test Certificate, O=Test Org, C=US',
  issuerCommonName: 'Test Issuer',
  issuer: 'CN=Test Issuer, O=Issuer Org, C=US',
  serialNumber: 'ABC123',
  validFrom: '2024-01-01T00:00:00.000Z',
  validTo: '2030-12-31T00:00:00.000Z',
  isCA: false,
};

const unknownDateCertificate: CertificateInfo = {
  subjectCommonName: 'Unknown Date Cert',
  subject: 'CN=Unknown Date Cert',
  issuerCommonName: 'Unknown Issuer',
  issuer: 'CN=Unknown Issuer',
  serialNumber: 'GHI789',
  validFrom: undefined,
  validTo: undefined,
  isCA: false,
};

describe('CertificateExpirationIcon', () => {
  test('should not show any icon for certificate with unknown expiration date', () => {
    const { container } = render(CertificateExpirationIcon, { props: { cert: unknownDateCertificate } });

    // Should not have any icon
    const icon = container.querySelector('svg');
    expect(icon).not.toBeInTheDocument();
  });

  test('should show green check icon for certificate expiring in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const futureCert: CertificateInfo = {
      ...validCertificate,
      validTo: futureDate.toISOString(),
    };

    const { container } = render(CertificateExpirationIcon, { props: { cert: futureCert } });

    // Should render an SVG icon for valid certificates
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    // Check the success color is in the rendered HTML
    expect(container.innerHTML).toContain('pd-state-success');
  });

  test('should show warning icon for certificate that expired in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const expiredYesterdayCert: CertificateInfo = {
      ...validCertificate,
      validTo: yesterday.toISOString(),
    };

    const { container } = render(CertificateExpirationIcon, { props: { cert: expiredYesterdayCert } });

    // Should render an SVG icon for expired certificates
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    // Check the warning color is in the rendered HTML
    expect(container.innerHTML).toContain('pd-state-warning');
  });
});
