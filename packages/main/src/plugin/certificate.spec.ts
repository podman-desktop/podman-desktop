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

import { beforeEach, describe, expect, test, vi } from 'vitest';
import wincaAPI from 'win-ca/api';

import { isLinux, isMac, isWindows } from '../util.js';
import { Certificates } from './certificates.js';
import { spawnWithPromise } from './util/spawn-promise.js';

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

vi.mock('./util/spawn-promise.js', () => {
  return {
    spawnWithPromise: vi.fn(),
  };
});

vi.mock('node:fs');

// Fake root certificates for mocking tls.rootCertificates
// These are simple fake PEM strings (not valid X.509, but sufficient for testing fallback behavior)
const FAKE_ROOT_CERTIFICATES = ['fake-cert-1', 'fake-cert-2'];

// Real valid X.509 self-signed certificate for happy path testing
// This is the GlobalSign Root CA certificate (a well-known root CA)
// Subject: C=BE, O=GlobalSign nv-sa, OU=Root CA, CN=GlobalSign Root CA
const VALID_PARSEABLE_CERT = `-----BEGIN CERTIFICATE-----
MIIDdTCCAl2gAwIBAgILBAAAAAABFUtaw5QwDQYJKoZIhvcNAQEFBQAwVzELMAkG
A1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExEDAOBgNVBAsTB1Jv
b3QgQ0ExGzAZBgNVBAMTEkdsb2JhbFNpZ24gUm9vdCBDQTAeFw05ODA5MDExMjAw
MDBaFw0yODAxMjgxMjAwMDBaMFcxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9i
YWxTaWduIG52LXNhMRAwDgYDVQQLEwdSb290IENBMRswGQYDVQQDExJHbG9iYWxT
aWduIFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDaDuaZ
jc6j40+Kfvvxi4Mla+pIH/EqsLmVEQS98GPR4mdmzxzdzxtIK+6NiY6arymAZavp
xy0Sy6scTHAHoT0KMM0VjU/43dSMUBUc71DuxC73/OlS8pF94G3VNTCOXkNz8kHp
1Wrjsok6Vjk4bwY8iGlbKk3Fp1S4bInMm/k8yuX9ifUSPJJ4ltbcdG6TRGHRjcdG
snUOhugZitVtbNV4FpWi6cgKOOvyJBNPc1STE4U6G7weNLWLBYy5d4ux2x8gkasJ
U26Qzns3dLlwR5EiUWMWea6xrkEmCMgZK9FGqkjWZCrXgzT/LCrBbBlDSgeF59N8
9iFo7+ryUp9/k5DPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8E
BTADAQH/MB0GA1UdDgQWBBRge2YaRQ2XyolQL30EzTSo//z9SzANBgkqhkiG9w0B
AQUFAAOCAQEA1nPnfE920I2/7LqivjTFKDK1fPxsnCwrvQmeU79rXqoRSLblCKOz
yj1hTdNGCbM+w6DjY1Ub8rrvrTnhQ7k4o+YviiY776BQVvnGCv04zcQLcFGUl5gE
38NflNUVyRRBnMRddWQVDf9VMOyGj/8N7yy5Y0b2qvzfvGn9LhJIZJrglfCm7ymP
AbEVtQwdpf5pLGkkeB6zpxxxYu7KyJesF12KwvhHhm4qxFYxldBniYUr+WymXUad
DKqC5JlR3XC321Y9YeRq4VzW9v493kHMB65jUr9TU/Qr6cf9tveCX4XSQRjbgbME
HMUfpIBvFSDJ3gyICh3WZlXi/EjJKSZp4A==
-----END CERTIFICATE-----`;

// Valid X.509 certificate with Organization but no Common Name
// Subject: O=Test Organization Without CN, C=US (no CN field)
// Used to test fallback from CN to O for subjectCommonName
const CERT_WITH_ORG_NO_CN = `-----BEGIN CERTIFICATE-----
MIIDSTCCAjGgAwIBAgIUTYq6YOBIE6EWJvxGYXxcrVspfHcwDQYJKoZIhvcNAQEL
BQAwNDElMCMGA1UECgwcVGVzdCBPcmdhbml6YXRpb24gV2l0aG91dCBDTjELMAkG
A1UEBhMCVVMwHhcNMjYwMTEzMDg1MzE1WhcNMzYwMTExMDg1MzE1WjA0MSUwIwYD
VQQKDBxUZXN0IE9yZ2FuaXphdGlvbiBXaXRob3V0IENOMQswCQYDVQQGEwJVUzCC
ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJnk7qTMwFh9jJwHNXDPEuF
DwI3hv7TOh9Pkeyj0v/U4vNFjzhDHQT7e6jO171oUbJ8MQXtHaK7sJjAlTWXXhUj
D+90Y2q4DYs65eKP0aHZp7LvGbRLC9jNjmF+qPLsiZsS70HVZyKlkzw9Xu7VcCxU
5DdQdUNV6ReFGKFtlsI7X4DgRPHEUVH2FAsJWmL6oXFg2nW69XBVuL7FkX/cMKU6
XV0Wpto7b64Qtum4H2JoOH4RBu49OWscc3wcxYJPNtoxGi1KgSMHfHH/iusF8YUm
+dOyETMlA3jJ25BaGm2jvd7hinxcF8a5HjWYuFFnAbDvQKNWCH2vEy5ZJ9SBrnkC
AwEAAaNTMFEwHQYDVR0OBBYEFOT3MtuSq2izkHXW8yojn1yHNV8pMB8GA1UdIwQY
MBaAFOT3MtuSq2izkHXW8yojn1yHNV8pMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZI
hvcNAQELBQADggEBAF5CsBBlVcAG+fA0GkBqtcO/zk0UTQoA5rjjLAIPSp+bGSgP
TPyDxOgWDMoWSVqfVSCYTl1WPna+IsV5ZlAbsatPXIh37OX2WedN4Q58E9dXFjlG
YuKJNvVT05ve/Hqb/s4rPXAmOjbB4ybShpDhnZjJ67Rw/SWnbayTVkFAVI6Bxnx8
hGr4+eOAOZ82RRd3AKE1s7R0mu+I11RkoIDrkSJGL1P1NzQpLWSptyBaAXt0JrGt
CPVU/qHLN9EsrALpCK/ZTE5TKXClaORkUj0gu67MAwmVxBrtLI6NLVJVfl+x2z8J
7wafAZ2CPH0KPKCVd2BEPpjQmiOJjlPHo5nryjQ=
-----END CERTIFICATE-----`;

// Valid X.509 certificate with neither CN nor O, only C and ST
// Subject: C=US, ST=California (no CN, no O)
// Used to test fallback to full DN when both CN and O are missing
const CERT_WITH_NO_CN_NO_ORG = `-----BEGIN CERTIFICATE-----
MIIDJTCCAg2gAwIBAgIUD3lel5m4dbO/9MjT1hLbmiaXm80wDQYJKoZIhvcNAQEL
BQAwIjELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWEwHhcNMjYwMTEz
MDg1NTUyWhcNMzYwMTExMDg1NTUyWjAiMQswCQYDVQQGEwJVUzETMBEGA1UECAwK
Q2FsaWZvcm5pYTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKvjVDMg
IrJfImFWM2ZVJ778B0AfQuVdt7FitzBkjd90cKDmd6a9Naoq9p6dHWxx0EUJ35/O
ijXssIEs/cUr23jrBZ5erN7VXovpuV50x7lt0Wus7ZdnU5X1jB/PPYoga+aPHq+n
32G6suyjY+4JPXPvz5TO1gylrDZOYPw6l1vH4Yzh+mP/qCcax8L9FKBxuwRrfCSm
05qx/NvPPF8yjpAdz8XKBOv/8Sn/pPirpl2cW7WAM7nBwNC7VzRsIF/yHoqackl9
wCFwhrwjFYegF/fdWlzd5xzL8djejzZh8wHxpoP0GreOLYh7uMBO+RdD8XhAAP0G
Eb+uHaZzhcnTE1sCAwEAAaNTMFEwHQYDVR0OBBYEFFTb+ryvsSj4q4tyZvGZDxdP
3fzSMB8GA1UdIwQYMBaAFFTb+ryvsSj4q4tyZvGZDxdP3fzSMA8GA1UdEwEB/wQF
MAMBAf8wDQYJKoZIhvcNAQELBQADggEBAF4mt8ac2IOBaDKJhUwyZ2a8IAbVbe6X
IQhx8g49Sbx8Iigyyx6iENvYEPS8HesWhKbjD27W4vqdHzrsrf/HZl87lbRNVTwj
plnEFOIMQQflWovJfK5yoXCP/awi6aIJ/va5j/aQxYgPl1rGjOrprZrqYyYVmjAs
fSTChdQup6J95b/l9MCYaFBjtuIM3flwAz4bl0ZghzNP/EGaocIJs3XY4gItN7mJ
/nhkWjcxx6Ulb1GnnF+4xGSstf7QHqHR4AYA6PINPbXIji9bA11Kcrrk9RwRSo3a
B3MoPuHfS6X0iwNorrN1o9n5Wv8Gwqgtu5d4flf25sfvg96jEe4Ijgc=
-----END CERTIFICATE-----`;

vi.mock('node:tls', () => {
  return {
    rootCertificates: ['fake-cert-1', 'fake-cert-2'],
  };
});

vi.mock(import('/@/util.js'));

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

  test('should return tls.rootCertificates when wincaAPI.inject throws', async () => {
    vi.mocked(wincaAPI).mockImplementation((options: WincaAPIOptions) => {
      if (options.onend) options.onend();
    });
    // Mock inject to throw an error - using vi.mocked() so it's properly restored by vi.clearAllMocks()
    vi.mocked((wincaAPI as unknown as WincaProcedure).inject).mockImplementationOnce(() => {
      throw new Error('inject failed');
    });

    const certificates = await certificate.retrieveWindowsCertificates();

    // Should fallback to tls.rootCertificates (mocked as FAKE_ROOT_CERTIFICATES)
    expect(certificates).toEqual(FAKE_ROOT_CERTIFICATES);
  });

  test('should return tls.rootCertificates when wincaAPI throws', async () => {
    vi.mocked(wincaAPI).mockImplementation(() => {
      throw new Error('wincaAPI failed');
    });

    const certificates = await certificate.retrieveWindowsCertificates();

    // Should fallback to tls.rootCertificates (mocked as FAKE_ROOT_CERTIFICATES)
    expect(certificates).toEqual(FAKE_ROOT_CERTIFICATES);
  });
});

// Self-signed test certificate for parsing tests
// Subject: CN=Test Cert, O=Test Org, C=US
const TEST_CERTIFICATE_PEM = `-----BEGIN CERTIFICATE-----
MIIDSTCCAjGgAwIBAgIULZH3WmSt3Ah7a1CAj/9u4vWIZqIwDQYJKoZIhvcNAQEL
BQAwNDESMBAGA1UEAwwJVGVzdCBDZXJ0MREwDwYDVQQKDAhUZXN0IE9yZzELMAkG
A1UEBhMCVVMwHhcNMjYwMTEzMDkxNjUxWhcNMzYwMTExMDkxNjUxWjA0MRIwEAYD
VQQDDAlUZXN0IENlcnQxETAPBgNVBAoMCFRlc3QgT3JnMQswCQYDVQQGEwJVUzCC
ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKhlXy5EAW63AAfgCPoCynWa
UzJlEL3AtL/XxbcOWf7E1li8/4IaZkOgwkTwaz5vW25ERn4YD5S/JYR+4AJR5qaI
rAlXGCJje+UOlERfZX1A5XjjAYRJNSYrxqIAy4GzZE6pGpVD8bY6Vo0ea49bhbgX
vFAPUavp1CXTXiOLibeL/7LAGvpNC4wHLOJRUwp6OGGJZQ3eK71Studx/VJovGXU
zgZycl6V/VtzMYHIEsceUSgPRz4LFYHPaIubVRcJKxSGChcC6mxxMYf+/+Y7BJ4F
e7isUMLqzUz0Pqtk/wqVHzsTuqeZpbF95aUEx2XPNiF1S8OZhwotgztDXwaU7rMC
AwEAAaNTMFEwHQYDVR0OBBYEFBjw9dgDAblPVG4TytoA6FAS8T5hMB8GA1UdIwQY
MBaAFBjw9dgDAblPVG4TytoA6FAS8T5hMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZI
hvcNAQELBQADggEBAHQ3kHtVuZDI0nL1LnD7KDwA4Dnh1Kregvm1+P7q1F2qVurr
EeX6paghYbuFv3erU1VmB09GDWCCVTa80cZ9PI+wxtSLtMyIf8K3Y99kkpjRohJM
N4W3i2g4GB6C3fKLJFtXIujjcxbbONoJcngTmPCcwVng5IypbQVvS/E1b4Ph1vJx
5llcmRdU0tHPa1aI9sT9mRgc9G42sfS8pA5jrmpBrd16jHIgi16nWXx09dIDCYvC
EkuJiCpBBr7moF7Ag27eus5EtVw6bKbp+/pstaKuh+2484cGnDHOwlxlAu3Cg6wI
hdejn9Lz3SrislM3JmPEnev7kYjj2tJ6IC6hg1U=
-----END CERTIFICATE-----`;

describe('parseCertificate', () => {
  test('should return default info for invalid PEM', () => {
    const result = certificate.parseCertificate('invalid-pem-content');

    expect(result.subjectCommonName).toBe('Non parsable certificate');
    expect(result.subject).toBe('Non parsable certificate');
    expect(result.issuerCommonName).toBe('');
    expect(result.issuer).toBe('');
    expect(result.serialNumber).toBe('');
    expect(result.validFrom).toBeUndefined();
    expect(result.validTo).toBeUndefined();
    expect(result.isCA).toBe(false);
  });

  test('should return default info for malformed certificate', () => {
    const malformedPem = `${BEGIN_CERTIFICATE}${CR}not-valid-base64!@#$%${CR}${END_CERTIFICATE}`;
    const result = certificate.parseCertificate(malformedPem);

    expect(result.subjectCommonName).toBe('Non parsable certificate');
    expect(result.validFrom).toBeUndefined();
    expect(result.validTo).toBeUndefined();
  });

  test('should parse valid certificate and extract subject common name', () => {
    const result = certificate.parseCertificate(TEST_CERTIFICATE_PEM);

    expect(result.subjectCommonName).toBe('Test Cert');
  });
});

describe('getAllCertificateInfos', () => {
  test('should return empty array when no certificates', async () => {
    vi.spyOn(certificate, 'retrieveCertificates').mockResolvedValue([]);
    await certificate.init();

    const result = certificate.getAllCertificateInfos();

    expect(result).toEqual([]);
  });

  test('should parse all certificates and return CertificateInfo array', async () => {
    const invalidCert1 = `${BEGIN_CERTIFICATE}${CR}InvalidCert1${CR}${END_CERTIFICATE}`;
    const invalidCert2 = `${BEGIN_CERTIFICATE}${CR}InvalidCert2${CR}${END_CERTIFICATE}`;

    vi.spyOn(certificate, 'retrieveCertificates').mockResolvedValue([invalidCert1, invalidCert2]);
    await certificate.init();

    const result = certificate.getAllCertificateInfos();

    expect(result.length).toBe(2);
    // Both should be unparsable
    expect(result[0]?.subjectCommonName).toBe('Non parsable certificate');
    expect(result[1]?.subjectCommonName).toBe('Non parsable certificate');
  });

  test('should handle mixed valid and invalid certificates', async () => {
    const invalidCert = `${BEGIN_CERTIFICATE}${CR}InvalidCert${CR}${END_CERTIFICATE}`;

    vi.spyOn(certificate, 'retrieveCertificates').mockResolvedValue([invalidCert, TEST_CERTIFICATE_PEM]);
    await certificate.init();

    const result = certificate.getAllCertificateInfos();

    expect(result.length).toBe(2);
    // First should be unparsable
    expect(result[0]?.subjectCommonName).toBe('Non parsable certificate');
    // Second should be parsed correctly
    expect(result[1]?.subjectCommonName).toBe('Test Cert');
  });
});

describe('init', () => {
  test('should populate allCertificates from retrieveCertificates', async () => {
    const testCerts = ['cert1', 'cert2'];
    vi.spyOn(certificate, 'retrieveCertificates').mockResolvedValue(testCerts);

    await certificate.init();

    expect(certificate.getAllCertificates()).toEqual(testCerts);
  });

  test('should set empty array when no certificates retrieved', async () => {
    vi.spyOn(certificate, 'retrieveCertificates').mockResolvedValue([]);

    await certificate.init();

    expect(certificate.getAllCertificates()).toEqual([]);
  });
});

describe('getAllCertificates', () => {
  test('should return empty array before init', () => {
    expect(certificate.getAllCertificates()).toEqual([]);
  });

  test('should return certificates after init', async () => {
    const testCerts = ['cert1', 'cert2', 'cert3'];
    vi.spyOn(certificate, 'retrieveCertificates').mockResolvedValue(testCerts);

    await certificate.init();

    expect(certificate.getAllCertificates()).toEqual(testCerts);
    expect(certificate.getAllCertificates().length).toBe(3);
  });
});

describe('retrieveCertificates', () => {
  test('should call retrieveMacOSCertificates on macOS', async () => {
    vi.mocked(isMac).mockReturnValue(true);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(false);

    const macCerts = ['mac-cert'];
    vi.spyOn(certificate, 'retrieveMacOSCertificates').mockResolvedValue(macCerts);

    const result = await certificate.retrieveCertificates();

    expect(result).toEqual(macCerts);
  });

  test('should call retrieveLinuxCertificates on Linux', async () => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(true);

    const linuxCerts = ['linux-cert'];
    vi.spyOn(certificate, 'retrieveLinuxCertificates').mockResolvedValue(linuxCerts);

    const result = await certificate.retrieveCertificates();

    expect(result).toEqual(linuxCerts);
  });

  test('should return default root certificates on unknown platform', async () => {
    vi.mocked(isMac).mockReturnValue(false);
    vi.mocked(isWindows).mockReturnValue(false);
    vi.mocked(isLinux).mockReturnValue(false);

    const result = await certificate.retrieveCertificates();

    // Should return tls.rootCertificates (array)
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('retrieveLinuxCertificates', () => {
  test('should read certificates from ca-certificates.crt when it exists', async () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath: fs.PathLike) => {
      return filePath === '/etc/ssl/certs/ca-certificates.crt';
    });
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(`${BEGIN_CERTIFICATE}${CR}LinuxCert${CR}${END_CERTIFICATE}`);

    const result = await certificate.retrieveLinuxCertificates();

    expect(result.length).toBe(1);
    expect(result[0]).toContain('LinuxCert');
  });

  test('should read certificates from ca-bundle.crt when it exists', async () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath: fs.PathLike) => {
      return filePath === '/etc/ssl/certs/ca-bundle.crt';
    });
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(`${BEGIN_CERTIFICATE}${CR}BundleCert${CR}${END_CERTIFICATE}`);

    const result = await certificate.retrieveLinuxCertificates();

    expect(result.length).toBe(1);
    expect(result[0]).toContain('BundleCert');
  });

  test('should return empty array when no certificate files exist', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    const result = await certificate.retrieveLinuxCertificates();

    expect(result).toEqual([]);
  });

  test('should remove duplicate certificates', async () => {
    const duplicateCert = `${BEGIN_CERTIFICATE}${CR}DuplicateCert${CR}${END_CERTIFICATE}`;
    // Both files exist and contain the same certificate
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(duplicateCert);

    const result = await certificate.retrieveLinuxCertificates();

    // Same certificate from both files should be deduplicated to 1
    expect(result.length).toBe(1);
  });

  test('should handle extractCertificates errors gracefully', async () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath: fs.PathLike) => {
      return filePath === '/etc/ssl/certs/ca-certificates.crt';
    });
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue('some content');
    vi.spyOn(certificate, 'extractCertificates').mockImplementation(() => {
      throw new Error('Extraction error');
    });

    const result = await certificate.retrieveLinuxCertificates();

    expect(result).toEqual([]);
  });
});

describe('getMacOSCertificates', () => {
  test('should return certificates when spawn succeeds', async () => {
    const certContent = `${BEGIN_CERTIFICATE}${CR}MacCert${CR}${END_CERTIFICATE}`;
    vi.mocked(spawnWithPromise).mockResolvedValue({
      stdout: certContent,
      exitCode: 0,
    });

    const result = await certificate.getMacOSCertificates();

    expect(result.length).toBe(1);
    expect(result[0]).toContain('MacCert');
  });

  test('should pass key parameter when provided', async () => {
    vi.mocked(spawnWithPromise).mockResolvedValue({
      stdout: `${BEGIN_CERTIFICATE}${CR}KeychainCert${CR}${END_CERTIFICATE}`,
      exitCode: 0,
    });

    await certificate.getMacOSCertificates('/System/Library/Keychains/SystemRootCertificates.keychain');

    expect(spawnWithPromise).toHaveBeenCalledWith('/usr/bin/security', [
      'find-certificate',
      '-a',
      '-p',
      '/System/Library/Keychains/SystemRootCertificates.keychain',
    ]);
  });

  test('should return empty array when spawn has error', async () => {
    vi.mocked(spawnWithPromise).mockResolvedValue({
      stdout: '',
      exitCode: 1,
      error: 'spawn error',
    });

    const result = await certificate.getMacOSCertificates();

    expect(result).toEqual([]);
  });

  test('should return empty array when certificate extraction throws', async () => {
    vi.mocked(spawnWithPromise).mockResolvedValue({
      stdout: 'some content',
      exitCode: 0,
    });
    vi.spyOn(certificate, 'extractCertificates').mockImplementation(() => {
      throw new Error('Extraction error');
    });

    const result = await certificate.getMacOSCertificates();

    expect(result).toEqual([]);
  });
});

describe('retrieveMacOSCertificates', () => {
  test('should combine root and user certificates', async () => {
    const rootCert = `${BEGIN_CERTIFICATE}${CR}RootCert${CR}${END_CERTIFICATE}`;
    const userCert = `${BEGIN_CERTIFICATE}${CR}UserCert${CR}${END_CERTIFICATE}`;

    vi.mocked(spawnWithPromise)
      .mockResolvedValueOnce({ stdout: rootCert, exitCode: 0 })
      .mockResolvedValueOnce({ stdout: userCert, exitCode: 0 });

    const result = await certificate.retrieveMacOSCertificates();

    expect(result.length).toBe(2);
    expect(result[0]).toContain('RootCert');
    expect(result[1]).toContain('UserCert');
  });
});

describe('extractCertificates', () => {
  test('should return empty array for empty content', () => {
    const result = certificate.extractCertificates('');

    expect(result).toEqual([]);
  });

  test('should return empty array for whitespace only content', () => {
    const result = certificate.extractCertificates('   \n\t  ');

    expect(result).toEqual([]);
  });

  test('should extract single certificate', () => {
    const content = `${BEGIN_CERTIFICATE}${CR}SingleCert${CR}${END_CERTIFICATE}`;

    const result = certificate.extractCertificates(content);

    expect(result.length).toBe(1);
  });

  test('should handle certificates without trailing newline', () => {
    const content = `${BEGIN_CERTIFICATE}${CR}Cert1${CR}${END_CERTIFICATE}${BEGIN_CERTIFICATE}${CR}Cert2${CR}${END_CERTIFICATE}`;

    const result = certificate.extractCertificates(content);

    expect(result.length).toBe(2);
  });
});

describe('parseCertificate with valid certificates', () => {
  test('should successfully parse valid X.509 certificate', () => {
    const result = certificate.parseCertificate(VALID_PARSEABLE_CERT);

    // Should have extracted the GlobalSign Root CA details
    expect(result.subjectCommonName).toBe('GlobalSign Root CA');
    expect(result.subject).toContain('CN=GlobalSign Root CA');
    expect(result.subject).toContain('O=GlobalSign nv-sa');
    expect(result.subject).toContain('C=BE');

    // Self-signed: issuer should match subject
    expect(result.issuerCommonName).toBe('GlobalSign Root CA');
    expect(result.issuer).toContain('CN=GlobalSign Root CA');

    // Should have valid dates as ISO 8601 strings
    expect(typeof result.validFrom).toBe('string');
    expect(typeof result.validTo).toBe('string');
    expect(result.validFrom).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(result.validTo).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

    // Should have serial number as hex
    expect(result.serialNumber).toMatch(/^[0-9A-F]+$/);
    expect(result.serialNumber.length).toBeGreaterThan(0);

    // Root CA should have isCA = true
    expect(result.isCA).toBe(true);
  });

  test('should use CN as subjectCommonName when present', () => {
    const result = certificate.parseCertificate(VALID_PARSEABLE_CERT);

    // subjectCommonName should be CN, not O or full DN
    expect(result.subjectCommonName).toBe('GlobalSign Root CA');
    expect(result.subjectCommonName).not.toBe('GlobalSign nv-sa'); // Not O
    expect(result.subjectCommonName).not.toContain('='); // Not full DN
  });

  test('should use CN as issuerCommonName when present', () => {
    const result = certificate.parseCertificate(VALID_PARSEABLE_CERT);

    // issuerCommonName should be CN, not O or full DN
    expect(result.issuerCommonName).toBe('GlobalSign Root CA');
    expect(result.issuerCommonName).not.toBe('GlobalSign nv-sa'); // Not O
    expect(result.issuerCommonName).not.toContain('='); // Not full DN
  });

  test('should fallback to Organization when CN is not present', () => {
    const result = certificate.parseCertificate(CERT_WITH_ORG_NO_CN);

    // subjectCommonName should fallback to O since there's no CN
    expect(result.subjectCommonName).toBe('Test Organization Without CN');
    expect(result.subject).not.toContain('CN='); // No CN in subject
    expect(result.subject).toContain('O=Test Organization Without CN');
    expect(result.subject).toContain('C=US');

    // issuerCommonName should also fallback to O (self-signed)
    expect(result.issuerCommonName).toBe('Test Organization Without CN');
  });

  test('should fallback to full DN when neither CN nor O is present', () => {
    const result = certificate.parseCertificate(CERT_WITH_NO_CN_NO_ORG);

    // subjectCommonName should fallback to full DN since no CN and no O
    expect(result.subject).not.toContain('CN='); // No CN
    expect(result.subject).not.toContain('O='); // No O
    expect(result.subject).toContain('C=US');
    expect(result.subject).toContain('ST=California');

    // subjectCommonName should be the full DN
    expect(result.subjectCommonName).toContain('C=US');
    expect(result.subjectCommonName).toContain('ST=California');

    // issuerCommonName should also be the full DN (self-signed)
    expect(result.issuerCommonName).toContain('C=US');
    expect(result.issuerCommonName).toContain('ST=California');
  });
});

describe('parseCertificate fallback behavior', () => {
  test('should return fallback name for unparseable certificates', () => {
    const result = certificate.parseCertificate('invalid-pem');

    expect(result.subjectCommonName).toBe('Non parsable certificate');
    expect(result.subject).toBe('Non parsable certificate');
    expect(result.issuerCommonName).toBe('');
    expect(result.issuer).toBe('');
  });

  test('should set undefined dates for unparseable certificates', () => {
    const result = certificate.parseCertificate('invalid-pem');

    expect(result.validFrom).toBeUndefined();
    expect(result.validTo).toBeUndefined();
  });

  test('should set isCA to false for unparseable certificates', () => {
    const result = certificate.parseCertificate('invalid-pem');

    expect(result.isCA).toBe(false);
  });

  test('should set empty serial number for unparseable certificates', () => {
    const result = certificate.parseCertificate('invalid-pem');

    expect(result.serialNumber).toBe('');
  });
});
