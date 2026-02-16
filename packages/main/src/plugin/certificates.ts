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
import * as https from 'node:https';
import * as path from 'node:path';
import * as tls from 'node:tls';

import type { CertificateInfo } from '@podman-desktop/core-api';
import * as asn1js from 'asn1js';
import { injectable } from 'inversify';
import * as pkijs from 'pkijs';
import wincaAPI from 'win-ca/api';

import { isLinux, isMac, isWindows } from '/@/util.js';

import { spawnWithPromise } from './util/spawn-promise.js';

/**
 * X.500 Distinguished Name OID constants
 * @see https://www.alvestrand.no/objectid/2.5.4.html
 */
const OID_COMMON_NAME = '2.5.4.3';
const OID_COUNTRY = '2.5.4.6';
const OID_LOCALITY = '2.5.4.7';
const OID_STATE = '2.5.4.8';
const OID_ORGANIZATION = '2.5.4.10';
const OID_ORGANIZATIONAL_UNIT = '2.5.4.11';
const OID_EMAIL = '1.2.840.113549.1.9.1';
const OID_BASIC_CONSTRAINTS = '2.5.29.19';

/**
 * Map of OID to human-readable RDN attribute names
 */
const OID_NAME_MAP: Record<string, string> = {
  [OID_COMMON_NAME]: 'CN',
  [OID_COUNTRY]: 'C',
  [OID_LOCALITY]: 'L',
  [OID_STATE]: 'ST',
  [OID_ORGANIZATION]: 'O',
  [OID_ORGANIZATIONAL_UNIT]: 'OU',
  [OID_EMAIL]: 'E',
};

/**
 * Provides access to the certificates of the underlying platform.
 * It supports Linux, Windows and MacOS.
 */
@injectable()
export class Certificates {
  private allCertificates: string[] = [];

  /**
   * Setup all certificates globally depending on the platform.
   */
  async init(): Promise<void> {
    this.allCertificates = await this.retrieveCertificates();

    // initialize the certificates globally
    https.globalAgent.options.ca = this.allCertificates;
  }

  getAllCertificates(): string[] {
    return this.allCertificates;
  }

  async retrieveCertificates(): Promise<string[]> {
    if (isMac()) {
      return this.retrieveMacOSCertificates();
    } else if (isWindows()) {
      return this.retrieveWindowsCertificates();
    } else if (isLinux()) {
      return this.retrieveLinuxCertificates();
    }

    // else return default root certificates
    return [...tls.rootCertificates];
  }

  public extractCertificates(content: string): string[] {
    // need to create an array of text from the content starting by '-----BEGIN CERTIFICATE-----'
    // use a regexp
    return content.split(/(?=-----BEGIN CERTIFICATE-----)/g).filter(c => c.trim().length > 0);
  }

  async retrieveMacOSCertificates(): Promise<string[]> {
    const rootCertificates = await this.getMacOSCertificates(
      '/System/Library/Keychains/SystemRootCertificates.keychain',
    );
    const userCertificates = await this.getMacOSCertificates();
    return rootCertificates.concat(userCertificates);
  }

  // get the certificates from the Windows certificate store
  async retrieveWindowsCertificates(): Promise<string[]> {
    // delegate to the win-ca module
    const winCaRetrieval = new Promise<string[]>(resolve => {
      const CAs: string[] = [...tls.rootCertificates];

      if (import.meta.env.PROD) {
        const rootExePath = path.join(process.resourcesPath, 'win-ca', 'roots.exe');
        wincaAPI.exe(rootExePath);
      } else {
        wincaAPI.exe(require.resolve('win-ca/lib/roots.exe'));
      }

      wincaAPI({
        format: wincaAPI.der2.pem,
        inject: false,
        store: ['root', 'ca'],
        ondata: (ca: string) => {
          CAs.push(ca);
        },
        onend: () => {
          resolve(CAs);
        },
      });
    });

    try {
      const result = await winCaRetrieval;
      // also do the patch on tls.createSecureContext()
      wincaAPI.inject('+');
      return result;
    } catch (error) {
      console.error('Error while retrieving Windows certificates', error);
      // return default root certificates
      return [...tls.rootCertificates];
    }
  }

  // grab the certificates from the Linux certificate store
  async retrieveLinuxCertificates(): Promise<string[]> {
    // certificates on Linux are stored in /etc/ssl/certs/ folder
    // for example
    // /etc/ssl/certs/ca-certificates.crt or /etc/ssl/certs/ca-bundle.crt
    const LINUX_FILES = ['/etc/ssl/certs/ca-certificates.crt', '/etc/ssl/certs/ca-bundle.crt'];

    // read the files and parse the content
    const certificates: string[] = [];
    for (const file of LINUX_FILES) {
      // if the file exists, read it
      if (fs.existsSync(file)) {
        const content = await fs.promises.readFile(file, { encoding: 'utf8' });
        try {
          this.extractCertificates(content).forEach(certificate => certificates.push(certificate));
        } catch (error) {
          console.log(`error while extracting certificates from ${file}`, error);
        }
      }
    }
    // remove any duplicates
    return certificates.filter((value, index, self) => self.indexOf(value) === index);
  }

  async getMacOSCertificates(key?: string): Promise<string[]> {
    const command = '/usr/bin/security';
    const spawnArgs = ['find-certificate', '-a', '-p'];
    // do we have an extra parameter
    if (key) {
      spawnArgs.push(key);
    }

    // call the spawn command (as we've lot ot output)
    const spawnResult = await spawnWithPromise(command, spawnArgs);
    if (spawnResult.error) {
      console.log('error while executing command', command, spawnArgs, spawnResult.error);
      return [];
    } else {
      try {
        return this.extractCertificates(spawnResult.stdout);
      } catch (error) {
        console.log('error while extracting certificates', error);
        return [];
      }
    }
  }

  /**
   * Convert PEM to ArrayBuffer for PKI.js
   */
  private pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem
      .replace(/-----BEGIN CERTIFICATE-----/g, '')
      .replace(/-----END CERTIFICATE-----/g, '')
      .replace(/\s/g, '');
    const binaryString = Buffer.from(b64, 'base64').toString('binary');
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Get RDN value by type OID from RelativeDistinguishedNames
   * Common OIDs: CN=2.5.4.3, O=2.5.4.10, OU=2.5.4.11, C=2.5.4.6
   */
  private getRDNValue(rdns: pkijs.RelativeDistinguishedNames, oid: string): string {
    for (const rdn of rdns.typesAndValues) {
      if (rdn.type === oid) {
        return rdn.value.valueBlock.value?.toString() ?? '';
      }
    }
    return '';
  }

  /**
   * Format RelativeDistinguishedNames as a string
   */
  private formatDN(rdns: pkijs.RelativeDistinguishedNames): string {
    return rdns.typesAndValues
      .map((rdn: pkijs.AttributeTypeAndValue) => {
        const name = OID_NAME_MAP[rdn.type] ?? rdn.type;
        const value = rdn.value.valueBlock.value?.toString() ?? '';
        return `${name}=${value}`;
      })
      .join(', ');
  }

  /**
   * Get display name with fallback: CN → O → Full DN
   */
  private getDisplayName(rdns: pkijs.RelativeDistinguishedNames): string {
    const cn = this.getRDNValue(rdns, OID_COMMON_NAME);
    if (cn) return cn;

    const org = this.getRDNValue(rdns, OID_ORGANIZATION);
    if (org) return org;

    return this.formatDN(rdns);
  }

  /**
   * Parse a PEM-encoded certificate using PKI.js.
   * @param pem The PEM-encoded certificate string.
   * @returns The parsed certificate information (without PEM for security).
   */
  parseCertificate(pem: string): CertificateInfo {
    try {
      const asn1 = asn1js.fromBER(this.pemToArrayBuffer(pem));
      if (asn1.offset === -1) {
        throw new Error('Failed to parse ASN.1 structure');
      }
      const cert = new pkijs.Certificate({ schema: asn1.result });

      // Get basicConstraints for isCA
      let isCA = false;
      const basicConstraintsExt = cert.extensions?.find((ext: pkijs.Extension) => ext.extnID === OID_BASIC_CONSTRAINTS);
      if (basicConstraintsExt?.parsedValue) {
        // See https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.9 for the definition of cA
        isCA = (basicConstraintsExt.parsedValue as pkijs.BasicConstraints).cA ?? false;
      }

      // Convert serial number to hex string
      const serialNumber = Array.from(cert.serialNumber.valueBlock.valueHexView)
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join('');

      return {
        subjectCommonName: this.getDisplayName(cert.subject),
        subject: this.formatDN(cert.subject),
        issuerCommonName: this.getDisplayName(cert.issuer),
        issuer: this.formatDN(cert.issuer),
        serialNumber,
        validFrom: cert.notBefore.value.toISOString(),
        validTo: cert.notAfter.value.toISOString(),
        isCA,
      };
    } catch (error) {
      console.log('error while parsing certificate', error);
      return {
        subjectCommonName: 'Non parsable certificate',
        subject: 'Non parsable certificate',
        issuerCommonName: '',
        issuer: '',
        serialNumber: '',
        validFrom: undefined,
        validTo: undefined,
        isCA: false,
      };
    }
  }

  /**
   * Get all certificates as parsed CertificateInfo objects.
   * @returns An array of parsed certificate information.
   */
  getAllCertificateInfos(): CertificateInfo[] {
    return this.allCertificates.map(pem => this.parseCertificate(pem));
  }
}
