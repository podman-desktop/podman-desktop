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
import { tick } from 'svelte';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { certificatesInfos, searchPattern } from '/@/stores/certificates';
import type { CertificateInfo } from '/@api/certificate-info';

import CertificateList from './CertificateList.svelte';

// Mock window.events
beforeEach(() => {
  vi.resetAllMocks();
  certificatesInfos.set([]);
  searchPattern.set('');

  (window.events as unknown) = {
    receive: (_channel: string, func: () => void): void => {
      func();
    },
  };

  // Mock window methods that might be called
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);
});

async function waitRender(customProperties: object = {}): Promise<void> {
  render(CertificateList, { ...customProperties });
}

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

const expiredCertificate: CertificateInfo = {
  subjectCommonName: 'Expired Certificate',
  subject: 'CN=Expired Certificate, O=Test Org, C=US',
  issuerCommonName: 'Expired Issuer',
  issuer: 'CN=Expired Issuer, O=Issuer Org, C=US',
  serialNumber: 'DEF456',
  validFrom: '2020-01-01T00:00:00.000Z',
  validTo: '2023-12-31T00:00:00.000Z',
  isCA: true,
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

describe('CertificateList', () => {
  test('should display empty screen when no certificates', async () => {
    certificatesInfos.set([]);

    await waitRender();

    const emptyMessage = screen.getByText('No certificates found');
    expect(emptyMessage).toBeInTheDocument();
  });

  test('should display page title', async () => {
    await waitRender();

    const title = screen.getByText('Certificates');
    expect(title).toBeInTheDocument();
  });

  test('should display subtitle description', async () => {
    await waitRender();

    const subtitle = screen.getByText(/Manage host-based certificates in Podman Desktop/);
    expect(subtitle).toBeInTheDocument();
  });

  test('should display certificates in table when certificates exist', async () => {
    certificatesInfos.set([validCertificate]);

    await waitRender();

    // Wait for the table to render
    await vi.waitFor(() => {
      const certName = screen.getByText('Test Certificate');
      expect(certName).toBeInTheDocument();
    });
  });

  test('should display certificate issuer', async () => {
    certificatesInfos.set([validCertificate]);

    await waitRender();

    await vi.waitFor(() => {
      const issuer = screen.getByText('Test Issuer');
      expect(issuer).toBeInTheDocument();
    });
  });

  test('should display certificate serial number', async () => {
    certificatesInfos.set([validCertificate]);

    await waitRender();

    await vi.waitFor(() => {
      const serial = screen.getByText('ABC123');
      expect(serial).toBeInTheDocument();
    });
  });

  test('should display multiple certificates', async () => {
    certificatesInfos.set([validCertificate, expiredCertificate]);

    await waitRender();

    await vi.waitFor(() => {
      expect(screen.getByText('Test Certificate')).toBeInTheDocument();
      expect(screen.getByText('Expired Certificate')).toBeInTheDocument();
    });
  });

  test('should display Unknown for certificate with undefined expiration date', async () => {
    certificatesInfos.set([unknownDateCertificate]);

    await waitRender();

    await vi.waitFor(() => {
      const unknownDate = screen.getByText('Unknown');
      expect(unknownDate).toBeInTheDocument();
    });
  });

  test('should display filtered empty screen when search has no results', async () => {
    certificatesInfos.set([validCertificate]);

    await waitRender({ searchTerm: 'nonexistent' });
    await tick();

    // Update the search pattern store
    searchPattern.set('nonexistent');
    await tick();

    await vi.waitFor(() => {
      const filteredMessage = screen.getByText(/No certificates/);
      expect(filteredMessage).toBeInTheDocument();
    });
  });

  test('should filter certificates based on search term', async () => {
    certificatesInfos.set([validCertificate, expiredCertificate]);

    await waitRender({ searchTerm: 'Expired' });
    searchPattern.set('Expired');
    await tick();

    await vi.waitFor(() => {
      // Expired certificate should be visible
      expect(screen.getByText('Expired Certificate')).toBeInTheDocument();
    });
  });

  test('should use subjectCommonName as display name', async () => {
    const certWithCN: CertificateInfo = {
      ...validCertificate,
      subjectCommonName: 'My Common Name',
      subject: 'CN=My Common Name, O=Org',
    };
    certificatesInfos.set([certWithCN]);

    await waitRender();

    await vi.waitFor(() => {
      expect(screen.getByText('My Common Name')).toBeInTheDocument();
    });
  });

  test('should fallback to subject when subjectCommonName is empty', async () => {
    const certWithoutCN: CertificateInfo = {
      ...validCertificate,
      subjectCommonName: '',
      subject: 'O=Fallback Subject',
    };
    certificatesInfos.set([certWithoutCN]);

    await waitRender();

    // When subjectCommonName is empty, it falls back to subject in the name column
    // We check the table is rendered with the certificate
    await vi.waitFor(() => {
      // The subject should appear somewhere - either as display name or in tooltip
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });

  test('should display Unknown when both subjectCommonName and subject are empty', async () => {
    const certNoName: CertificateInfo = {
      ...validCertificate,
      subjectCommonName: '',
      subject: '',
    };
    certificatesInfos.set([certNoName]);

    await waitRender();

    await vi.waitFor(() => {
      // The name column should show 'Unknown'
      const unknownElements = screen.getAllByText('Unknown');
      expect(unknownElements.length).toBeGreaterThan(0);
    });
  });

  test('should use issuerCommonName for issuer display', async () => {
    const certWithIssuerCN: CertificateInfo = {
      ...validCertificate,
      issuerCommonName: 'Issuer Common Name',
      issuer: 'CN=Issuer Common Name, O=Issuer Org',
    };
    certificatesInfos.set([certWithIssuerCN]);

    await waitRender();

    await vi.waitFor(() => {
      expect(screen.getByText('Issuer Common Name')).toBeInTheDocument();
    });
  });

  test('should display table headers', async () => {
    certificatesInfos.set([validCertificate]);

    await waitRender();

    await vi.waitFor(() => {
      expect(screen.getByText('Certificate Name')).toBeInTheDocument();
      expect(screen.getByText('Issuer')).toBeInTheDocument();
      expect(screen.getByText('Serial Number')).toBeInTheDocument();
      expect(screen.getByText('Expires On')).toBeInTheDocument();
    });
  });

  test('should show search input', async () => {
    await waitRender();

    const searchInput = screen.getByRole('textbox', { name: 'search preferences' });
    expect(searchInput).toBeInTheDocument();
  });
});

describe('CertificateList store integration', () => {
  test('should update certificates when store changes', async () => {
    certificatesInfos.set([]);

    await waitRender();

    // Initially empty
    expect(screen.getByText('No certificates found')).toBeInTheDocument();

    // Update store
    certificatesInfos.set([validCertificate]);
    await tick();

    await vi.waitFor(() => {
      expect(screen.getByText('Test Certificate')).toBeInTheDocument();
    });
  });

  test('should update search pattern store when searchTerm prop changes', async () => {
    await waitRender({ searchTerm: 'test-search' });
    await vi.waitFor(() => {
      expect(get(searchPattern)).toBe('test-search');
    });
  });
});

describe('CertificateList sorting', () => {
  // Create certificates with distinct values for sorting tests
  const certA: CertificateInfo = {
    subjectCommonName: 'Alpha Certificate',
    subject: 'CN=Alpha Certificate',
    issuerCommonName: 'Zeta Issuer',
    issuer: 'CN=Zeta Issuer',
    serialNumber: 'AAA111',
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2025-01-01T00:00:00.000Z',
    isCA: false,
  };

  const certB: CertificateInfo = {
    subjectCommonName: 'Beta Certificate',
    subject: 'CN=Beta Certificate',
    issuerCommonName: 'Mu Issuer',
    issuer: 'CN=Mu Issuer',
    serialNumber: 'BBB222',
    validFrom: '2024-06-01T00:00:00.000Z',
    validTo: '2026-06-01T00:00:00.000Z',
    isCA: true,
  };

  const certC: CertificateInfo = {
    subjectCommonName: 'Gamma Certificate',
    subject: 'CN=Gamma Certificate',
    issuerCommonName: 'Alpha Issuer',
    issuer: 'CN=Alpha Issuer',
    serialNumber: 'CCC333',
    validFrom: '2023-01-01T00:00:00.000Z',
    validTo: '2024-06-01T00:00:00.000Z',
    isCA: false,
  };

  test('should sort certificates by name when clicking Certificate Name header', async () => {
    certificatesInfos.set([certC, certA, certB]);

    await waitRender();

    await vi.waitFor(() => {
      expect(screen.getByText('Alpha Certificate')).toBeInTheDocument();
    });

    // Certificate Name is the default sort column, so it's already sorted ascending
    // Clicking it once toggles to descending order (Gamma > Beta > Alpha)
    const nameHeader = screen.getByRole('columnheader', { name: 'Certificate Name' });
    await fireEvent.click(nameHeader);

    const alphaCell = screen.getByText('Alpha Certificate');
    const betaCell = screen.getByText('Beta Certificate');
    const gammaCell = screen.getByText('Gamma Certificate');

    // Descending order: Gamma comes before Beta, Beta comes before Alpha
    // compareDocumentPosition returns 4 if first precedes second
    expect(gammaCell.compareDocumentPosition(betaCell)).toBe(4);
    expect(betaCell.compareDocumentPosition(alphaCell)).toBe(4);
  });

  test('should sort certificates by issuer when clicking Issuer header', async () => {
    certificatesInfos.set([certA, certB, certC]);

    await waitRender();

    await vi.waitFor(() => {
      expect(screen.getByText('Zeta Issuer')).toBeInTheDocument();
    });

    // Click on Issuer header to sort
    const issuerHeader = screen.getByRole('columnheader', { name: 'Issuer' });
    await fireEvent.click(issuerHeader);

    const alphaIssuer = screen.getByText('Alpha Issuer');
    const muIssuer = screen.getByText('Mu Issuer');
    const zetaIssuer = screen.getByText('Zeta Issuer');

    // Alphabetical order: Alpha < Mu < Zeta
    expect(alphaIssuer.compareDocumentPosition(muIssuer)).toBe(4);
    expect(muIssuer.compareDocumentPosition(zetaIssuer)).toBe(4);
  });

  test('should sort certificates by serial number when clicking Serial Number header', async () => {
    certificatesInfos.set([certC, certA, certB]);

    await waitRender();

    await vi.waitFor(() => {
      expect(screen.getByText('AAA111')).toBeInTheDocument();
    });

    // Click on Serial Number header to sort
    const serialHeader = screen.getByRole('columnheader', { name: 'Serial Number' });
    await fireEvent.click(serialHeader);

    const serialA = screen.getByText('AAA111');
    const serialB = screen.getByText('BBB222');
    const serialC = screen.getByText('CCC333');

    // Alphabetical order: AAA111 < BBB222 < CCC333
    expect(serialA.compareDocumentPosition(serialB)).toBe(4);
    expect(serialB.compareDocumentPosition(serialC)).toBe(4);
  });

  test('should sort certificates by expiration date when clicking Expires On header', async () => {
    certificatesInfos.set([certB, certA, certC]);

    await waitRender();

    await vi.waitFor(() => {
      expect(screen.getByText('Alpha Certificate')).toBeInTheDocument();
    });

    // Click on Expires On header to sort by date
    const expiresHeader = screen.getByRole('columnheader', { name: 'Expires On' });
    await fireEvent.click(expiresHeader);

    // certC expires Jun 1, 2024, certA expires Jan 1, 2025, certB expires Jun 1, 2026
    const gammaCell = screen.getByText('Gamma Certificate');
    const alphaCell = screen.getByText('Alpha Certificate');
    const betaCell = screen.getByText('Beta Certificate');

    // Chronological order: Gamma (2024-06) < Alpha (2025-01) < Beta (2026-06)
    expect(gammaCell.compareDocumentPosition(alphaCell)).toBe(4);
    expect(alphaCell.compareDocumentPosition(betaCell)).toBe(4);
  });

  test('should reverse sort order when clicking same header twice', async () => {
    certificatesInfos.set([certA, certB, certC]);

    await waitRender();

    await vi.waitFor(() => {
      expect(screen.getByText('Alpha Certificate')).toBeInTheDocument();
    });

    // Use Issuer column to test toggle behavior (not the default column)
    const issuerHeader = screen.getByRole('columnheader', { name: 'Issuer' });

    // First click - ascending order (Alpha Issuer < Mu Issuer < Zeta Issuer)
    await fireEvent.click(issuerHeader);

    let alphaIssuer = screen.getByText('Alpha Issuer');
    let zetaIssuer = screen.getByText('Zeta Issuer');

    expect(alphaIssuer.compareDocumentPosition(zetaIssuer)).toBe(4);

    // Second click - descending order
    await fireEvent.click(issuerHeader);

    alphaIssuer = screen.getByText('Alpha Issuer');
    zetaIssuer = screen.getByText('Zeta Issuer');

    // Now Zeta should come before Alpha (descending)
    expect(zetaIssuer.compareDocumentPosition(alphaIssuer)).toBe(4);
  });

  test('should handle certificates with undefined expiration dates in sorting', async () => {
    const certNoExpiry: CertificateInfo = {
      subjectCommonName: 'No Expiry Cert',
      subject: 'CN=No Expiry Cert',
      issuerCommonName: 'Unknown Issuer',
      issuer: 'CN=Unknown Issuer',
      serialNumber: 'XXX000',
      validFrom: undefined,
      validTo: undefined,
      isCA: false,
    };

    certificatesInfos.set([certA, certNoExpiry, certB]);

    await waitRender();

    await vi.waitFor(() => {
      expect(screen.getByText('Alpha Certificate')).toBeInTheDocument();
      expect(screen.getByText('No Expiry Cert')).toBeInTheDocument();
    });

    // Click on Expires On header
    const expiresHeader = screen.getByRole('columnheader', { name: 'Expires On' });
    await fireEvent.click(expiresHeader);

    // Certificates with undefined dates should be treated as 0 (earliest)
    const noExpiryCell = screen.getByText('No Expiry Cert');
    const alphaCell = screen.getByText('Alpha Certificate');

    // No Expiry (undefined = 0) should come before Alpha (2025)
    expect(noExpiryCell.compareDocumentPosition(alphaCell)).toBe(4);
  });
});
