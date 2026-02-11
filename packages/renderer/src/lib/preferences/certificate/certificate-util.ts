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

import type { CertificateInfo } from '@podman-desktop/core-api';

/**
 * Get display name for certificate subject (CN → Full DN → 'Unknown')
 */
export function getSubjectDisplayName(cert: CertificateInfo): string {
  return cert.subjectCommonName || cert.subject || 'Unknown';
}

/**
 * Get display name for certificate issuer (CN → Full DN → 'Unknown')
 */
function getIssuerDisplayName(cert: CertificateInfo): string {
  return cert.issuerCommonName || cert.issuer || 'Unknown';
}

/**
 * Check if certificate is self-signed (subject === issuer)
 */
function isSelfSigned(cert: CertificateInfo): boolean {
  return cert.subject === cert.issuer;
}

/**
 * Get display name for issuer with self-signed detection
 */
export function getIssuerDisplayNameWithSelfSigned(cert: CertificateInfo): string {
  if (isSelfSigned(cert)) {
    return 'Self-signed';
  }
  return getIssuerDisplayName(cert);
}

/**
 * Check if the certificate is expired
 */
export function isExpired(cert: CertificateInfo): boolean {
  if (!cert.validTo) {
    return false; // Unknown expiration, don't mark as expired
  }
  return new Date(cert.validTo) < new Date();
}

/**
 * Format a date for display, returning 'Unknown' if undefined
 */
export function formatExpirationDate(date: string | undefined): string {
  if (!date) {
    return 'Unknown';
  }
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
