import { platform } from 'node:os';
import { getCACertificates } from 'node:tls';

import { beforeEach, expect, test } from 'vitest';

import { Certificates } from '/@/plugin/certificates.js';

let certificates: Certificates;

beforeEach(() => {
  certificates = new Certificates();
});

test('linux', {
  skip: platform() !== 'linux',
}, async () => {
  const certs = await certificates.retrieveLinuxCertificates();

  const systemCerts = getCACertificates('system');

  const a = new Set(certs.map(c => c.trim()));
  const b = new Set(systemCerts.map(c => c.trim()));

  expect(a.isSubsetOf(b)).toBeTruthy();
});

test('macos', {
  skip: platform() !== 'darwin',
}, async () => {
  const certs = await certificates.retrieveMacOSCertificates();

  const systemCerts = getCACertificates('system');

  const a = new Set(certs.map(c => c.trim()));
  const b = new Set(systemCerts.map(c => c.trim()));

  expect(a.isSubsetOf(b)).toBeTruthy();
});

test('windows', {
  skip: platform() !== 'win32',
}, async () => {
  const certs = await certificates.retrieveWindowsCertificates();

  const systemCerts = getCACertificates('system');

  const a = new Set(certs.map(c => c.trim()));
  const b = new Set(systemCerts.map(c => c.trim()));

  expect(a.isSubsetOf(b)).toBeTruthy();
});
