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

/**
 * Represents X.509 certificate information extracted from PEM-encoded certificates.
 */
export interface CertificateInfo {
  /**
   * The certificate subject's common name (CN).
   */
  subjectCommonName: string;

  /**
   * The full subject distinguished name (DN).
   * Example: "CN=example.com,O=Example Inc,C=US"
   */
  subject: string;

  /**
   * The certificate issuer's common name (CN).
   */
  issuerCommonName: string;

  /**
   * The full issuer distinguished name (DN).
   * Example: "CN=DigiCert Global Root CA,O=DigiCert Inc,C=US"
   */
  issuer: string;

  /**
   * The certificate serial number in hexadecimal format.
   */
  serialNumber: string;

  /**
   * The date from which the certificate is valid (notBefore).
   * Undefined if the certificate could not be parsed.
   */
  validFrom?: Date;

  /**
   * The date until which the certificate is valid (notAfter).
   * Undefined if the certificate could not be parsed.
   */
  validTo?: Date;

  /**
   * SHA-256 fingerprint of the certificate.
   */
  fingerprint256: string;

  /**
   * SHA-1 fingerprint of the certificate (legacy, for compatibility).
   */
  fingerprint: string;

  /**
   * Indicates whether this is a Certificate Authority (CA) certificate.
   */
  isCA: boolean;

  /**
   * Subject Alternative Names (SANs), if present.
   * Example: "DNS:example.com, DNS:www.example.com, IP Address:192.168.1.1"
   */
  subjectAltName?: string;

  /**
   * Key usage extensions, if present.
   * Example: ["digitalSignature", "keyEncipherment"]
   */
  keyUsage?: string[];

  /**
   * The raw PEM-encoded certificate string.
   */
  pem: string;
}
