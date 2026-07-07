import { platform } from 'node:os';
import { getCACertificates, rootCertificates } from 'node:tls';

import { beforeEach, expect, test } from 'vitest';

import { Certificates } from '/@/plugin/certificates.js';

let certificates: Certificates;

beforeEach(() => {
  certificates = new Certificates();
});

function getCertificatesFromNode(): string[] {
  return [...rootCertificates, ...getCACertificates('system')];
}

test('linux', {
  skip: platform() !== 'linux',
}, async () => {
  const certs = await certificates.retrieveLinuxCertificates();

  const systemCerts = getCertificatesFromNode();

  const a = new Set(certs.map(c => c.trim()));
  const b = new Set(systemCerts.map(c => c.trim()));

  expect(a.isSubsetOf(b)).toBeTruthy();
});

test('macos', {
  skip: platform() !== 'darwin',
}, async () => {
  const certs = await certificates.retrieveMacOSCertificates();

  const systemCerts = getCertificatesFromNode();

  const a = new Set(certs.map(c => c.trim()));
  const b = new Set(systemCerts.map(c => c.trim()));

  expect(a.isSubsetOf(b)).toBeTruthy();
});

test('windows', {
  skip: platform() !== 'win32',
}, async () => {
  const certs = await certificates.retrieveWindowsCertificates();

  const systemCerts = getCertificatesFromNode();

  const a = new Set(certs.map(c => c.trim()));
  const b = new Set(systemCerts.map(c => c.trim()));

  expect(a.isSubsetOf(b)).toBeTruthy();
});
