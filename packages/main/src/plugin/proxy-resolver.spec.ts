/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { get } from 'node:http';
import * as nodeurl from 'node:url';

import type * as hpagent from 'hpagent';
import { HttpsProxyAgent } from 'hpagent';
import { beforeEach, expect, test, vi } from 'vitest';

import type { Certificates } from './certificates.js';
import type { Proxy } from './proxy.js';
import { matchNoProxyRules, parseNoProxy } from './proxy.js';
import * as ProxyResolver from './proxy-resolver.js';

vi.mock(import('node:http'), () => {
  return {
    get: vi.fn(),
    request: vi.fn(),
  };
});

vi.mock(import('node:https'), () => {
  return {
    get: vi.fn(),
    request: vi.fn(),
  };
});

vi.mock(import('hpagent'), () => {
  return {
    HttpProxyAgent: function (): void {
      // @ts-ignore: this implicit any type
      this.https = false;
    },
    HttpsProxyAgent: function (): void {
      // @ts-ignore: this implicit any type
      this.https = true;
    },
  } as unknown as typeof hpagent;
});

function createProxy(enabled: boolean, httpsProxy?: string, httpProxy?: string, noProxy?: string): Proxy {
  const rules = parseNoProxy(noProxy);
  const proxy: {
    isEnabled: () => boolean;
    isNoProxyMatch: (hostname: string, port?: string) => boolean;
    proxy?: {
      httpProxy?: string;
      httpsProxy?: string;
      noProxy?: string;
    };
  } = {
    isEnabled: () => enabled,
    isNoProxyMatch: (hostname: string, port?: string) => matchNoProxyRules(hostname, port, rules),
  };
  if (httpProxy || httpsProxy || noProxy) {
    proxy.proxy = {
      httpProxy,
      httpsProxy,
      noProxy,
    };
  }
  return proxy as unknown as Proxy;
}

const Http = 'http';
const HttpProxyUrl = `${Http}://proxy.url`;
const HttpsProxyUrl = 'https://proxy.url';

const certificates: Certificates = {
  getAllCertificates: vi.fn(),
} as unknown as Certificates;

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================================================
// ProxyResolver.getOptions Tests
// ============================================================================

test('getOptions return options w/o agent if proxy not enabled and url is not secure', () => {
  const proxy = createProxy(false);
  const options = ProxyResolver.getOptions(proxy, false, certificates);
  expect(options.agent).toBeUndefined();
});

test('getOptions return options w/ agent for https proxy', () => {
  const proxy = createProxy(true, HttpsProxyUrl, HttpProxyUrl);
  const options = ProxyResolver.getOptions(proxy, true, certificates);
  expect(options.agent).not.toBeUndefined();
  expect(options.agent && 'https' in options.agent ? options.agent.https : false).toBeTruthy();
});

test('getOptions return options w/ https.Agent for https proxy', () => {
  const proxy = createProxy(true, undefined, HttpProxyUrl);
  const options = ProxyResolver.getOptions(proxy, false, certificates);
  expect(options.agent).not.toBeUndefined();
  expect(options.agent && 'https' in options.agent ? options.agent.https : true).toBeFalsy();
});

// ============================================================================
// Parameterized ProxyResolver.getProxyUrl Tests
// ============================================================================

interface GetProxyUrlTestCase {
  description: string;
  noProxy?: string;
  host?: string;
  port?: string;
  secure?: boolean;
  expected: string | undefined;
}

test.each<GetProxyUrlTestCase>([
  // Domain & Subdomain Matching
  {
    description: 'hostname matches noProxy exactly',
    noProxy: 'internal.example.com',
    host: 'internal.example.com',
    expected: undefined,
  },
  {
    description: 'hostname does not match noProxy',
    noProxy: 'internal.example.com',
    host: 'podman-desktop.io',
    expected: HttpsProxyUrl,
  },
  {
    description: '*. prefix matches subdomain',
    noProxy: '*.example.com',
    host: 'foo.example.com',
    expected: undefined,
  },
  {
    description: '*. prefix does not match main domain',
    noProxy: '*.example.com',
    host: 'example.com',
    expected: HttpsProxyUrl,
  },
  {
    description: 'leading dot matches subdomain',
    noProxy: '.example.com',
    host: 'sub.example.com',
    expected: undefined,
  },
  {
    description: 'leading dot does not match main domain',
    noProxy: '.example.com',
    host: 'example.com',
    expected: HttpsProxyUrl,
  },
  {
    description: 'no leading dot matches main domain',
    noProxy: 'example.com',
    host: 'example.com',
    expected: undefined,
  },
  {
    description: 'no leading dot matches subdomain',
    noProxy: 'example.com',
    host: 'sub.example.com',
    expected: undefined,
  },
  {
    description: 'returns proxy url when host is omitted even if noProxy set',
    noProxy: 'internal.example.com',
    host: undefined,
    expected: HttpsProxyUrl,
  },

  // Loopback Bypassing
  { description: 'bypasses proxy for localhost', noProxy: 'example.com', host: 'localhost', expected: undefined },
  { description: 'bypasses proxy for 127.0.0.1', noProxy: 'example.com', host: '127.0.0.1', expected: undefined },
  { description: 'bypasses proxy for ::1', noProxy: 'example.com', host: '::1', expected: undefined },
  { description: 'bypasses proxy for [::1]', noProxy: 'example.com', host: '[::1]', expected: undefined },
  {
    description: 'bypasses loopback when noProxy is empty string',
    noProxy: '',
    host: 'localhost',
    expected: undefined,
  },
  {
    description: 'bypasses loopback when noProxy is empty string (IPv4)',
    noProxy: '',
    host: '127.0.0.1',
    expected: undefined,
  },
  {
    description: 'bypasses loopback when noProxy is empty string (IPv6)',
    noProxy: '',
    host: '::1',
    expected: undefined,
  },
  {
    description: 'bypasses loopback when noProxy is empty string (bracketed IPv6)',
    noProxy: '',
    host: '[::1]',
    expected: undefined,
  },
  {
    description: 'bypasses loopback when noProxy is undefined',
    noProxy: undefined,
    host: 'localhost',
    expected: undefined,
  },
  {
    description: 'bypasses loopback when noProxy is undefined (IPv4)',
    noProxy: undefined,
    host: '127.0.0.1',
    expected: undefined,
  },
  {
    description: 'bypasses loopback when noProxy is undefined (IPv6)',
    noProxy: undefined,
    host: '::1',
    expected: undefined,
  },
  {
    description: 'bypasses loopback when noProxy is undefined (bracketed IPv6)',
    noProxy: undefined,
    host: '[::1]',
    expected: undefined,
  },

  // IPv4 & CIDR Matching
  {
    description: 'ignores IPv4 CIDR when target is a domain name',
    noProxy: '10.0.0.0/8',
    host: 'podman-desktop.io',
    expected: HttpsProxyUrl,
  },
  { description: 'matches IP inside IPv4 CIDR range', noProxy: '10.0.0.0/8', host: '10.1.2.3', expected: undefined },
  {
    description: 'does not match IP outside IPv4 CIDR range',
    noProxy: '10.0.0.0/8',
    host: '192.168.1.1',
    expected: HttpsProxyUrl,
  },
  { description: 'matches exact IPv4 address', noProxy: '192.168.1.100', host: '192.168.1.100', expected: undefined },
  {
    description: 'does not match different IPv4 address',
    noProxy: '192.168.1.100',
    host: '192.168.1.101',
    expected: HttpsProxyUrl,
  },
  {
    description: 'matches mixed IPv4 CIDR and domain entries',
    noProxy: '10.0.0.0/8,internal.example.com',
    host: 'internal.example.com',
    expected: undefined,
  },
  {
    description: 'matches mixed IPv4 CIDR and domain entries (CIDR match)',
    noProxy: '10.0.0.0/8,internal.example.com',
    host: '10.5.6.7',
    expected: undefined,
  },
  {
    description: 'does not match mixed IPv4 CIDR and domain entries',
    noProxy: '10.0.0.0/8,internal.example.com',
    host: 'podman-desktop.io',
    expected: HttpsProxyUrl,
  },

  // IPv6 Matching
  { description: 'matches exact IPv6 address', noProxy: '::1,fd00::1', host: 'fd00::1', expected: undefined },
  {
    description: 'does not match different exact IPv6 address',
    noProxy: '::1,fd00::1',
    host: 'fd00::2',
    expected: HttpsProxyUrl,
  },
  { description: 'matches IPv6 inside CIDR range', noProxy: 'fd00::/8', host: 'fd00::1', expected: undefined },
  {
    description: 'matches IPv6 near upper boundary of CIDR range',
    noProxy: 'fd00::/8',
    host: 'fdff::99',
    expected: undefined,
  },
  {
    description: 'does not match IPv6 outside CIDR range',
    noProxy: 'fd00::/8',
    host: 'fe80::1',
    expected: HttpsProxyUrl,
  },
  {
    description: 'handles bracketed IPv6 in target host (in-range)',
    noProxy: 'fd00::/8',
    host: '[fd00::1]',
    expected: undefined,
  },
  {
    description: 'handles bracketed IPv6 in target host (out-of-range)',
    noProxy: 'fd00::/8',
    host: '[fe80::1]',
    expected: HttpsProxyUrl,
  },
  {
    description: 'matches expanded IPv6 against compressed CIDR',
    noProxy: '2001:db8::/32',
    host: '2001:0db8:0000:0000:0000:0000:0000:0001',
    expected: undefined,
  },
  {
    description: 'matches compressed IPv6 against compressed CIDR',
    noProxy: '2001:db8::/32',
    host: '2001:db8::1',
    expected: undefined,
  },
  {
    description: 'matches zero-collapsed IPv6 against CIDR',
    noProxy: 'fe80::/10',
    host: 'fe80:0:0:0:0:0:0:1',
    expected: undefined,
  },
  {
    description: 'matches zero-collapsed IPv6 against CIDR (compressed)',
    noProxy: 'fe80::/10',
    host: 'fe80::1',
    expected: undefined,
  },
  {
    description: 'rejects IPv6 host outside range with similar prefix',
    noProxy: '2001:db8::/32',
    host: '2001:db9::1',
    expected: HttpsProxyUrl,
  },
  {
    description: 'handles /128 single-address IPv6 range (match)',
    noProxy: '::1/128',
    host: '0000:0000:0000:0000:0000:0000:0000:0001',
    expected: undefined,
  },
  {
    description: 'handles /128 single-address IPv6 range (no match)',
    noProxy: '::1/128',
    host: '::2',
    expected: HttpsProxyUrl,
  },

  // Multiple Patterns & Whitespace Trimming
  {
    description: 'matches first domain in list',
    noProxy: 'foo.com,bar.org,baz.net',
    host: 'foo.com',
    expected: undefined,
  },
  {
    description: 'matches second domain in list',
    noProxy: 'foo.com,bar.org,baz.net',
    host: 'bar.org',
    expected: undefined,
  },
  {
    description: 'matches third domain in list',
    noProxy: 'foo.com,bar.org,baz.net',
    host: 'baz.net',
    expected: undefined,
  },
  {
    description: 'matches subdomain in multi-entry list',
    noProxy: 'foo.com,bar.org,baz.net',
    host: 'sub.foo.com',
    expected: undefined,
  },
  {
    description: 'does not match unlisted domain in multi-entry list',
    noProxy: 'foo.com,bar.org,baz.net',
    host: 'other.io',
    expected: HttpsProxyUrl,
  },
  {
    description: 'matches mixed entries (CIDR)',
    noProxy: '10.0.0.0/8,.internal.corp,192.168.1.42,*.dev.local',
    host: '10.5.5.5',
    expected: undefined,
  },
  {
    description: 'matches mixed entries (subdomain)',
    noProxy: '10.0.0.0/8,.internal.corp,192.168.1.42,*.dev.local',
    host: 'app.internal.corp',
    expected: undefined,
  },
  {
    description: 'does not match parent domain for leading dot in mixed list',
    noProxy: '10.0.0.0/8,.internal.corp,192.168.1.42,*.dev.local',
    host: 'internal.corp',
    expected: HttpsProxyUrl,
  },
  {
    description: 'matches mixed entries (exact IP match)',
    noProxy: '10.0.0.0/8,.internal.corp,192.168.1.42,*.dev.local',
    host: '192.168.1.42',
    expected: undefined,
  },
  {
    description: 'does not match non-listed IP in mixed list',
    noProxy: '10.0.0.0/8,.internal.corp,192.168.1.42,*.dev.local',
    host: '192.168.1.43',
    expected: HttpsProxyUrl,
  },
  {
    description: 'matches mixed entries (*. wildcard subdomain)',
    noProxy: '10.0.0.0/8,.internal.corp,192.168.1.42,*.dev.local',
    host: 'svc.dev.local',
    expected: undefined,
  },
  {
    description: 'does not match base domain for *. wildcard in mixed list',
    noProxy: '10.0.0.0/8,.internal.corp,192.168.1.42,*.dev.local',
    host: 'dev.local',
    expected: HttpsProxyUrl,
  },
  {
    description: 'does not match unlisted domain in mixed list',
    noProxy: '10.0.0.0/8,.internal.corp,192.168.1.42,*.dev.local',
    host: 'public.example.com',
    expected: HttpsProxyUrl,
  },
  {
    description: 'trims spaces around noProxy items (entry 1)',
    noProxy: ' foo.com , bar.org , baz.net ',
    host: 'foo.com',
    expected: undefined,
  },
  {
    description: 'trims spaces around noProxy items (entry 2)',
    noProxy: ' foo.com , bar.org , baz.net ',
    host: 'bar.org',
    expected: undefined,
  },
  {
    description: 'trims spaces around noProxy items (entry 3)',
    noProxy: ' foo.com , bar.org , baz.net ',
    host: 'baz.net',
    expected: undefined,
  },
  {
    description: 'ignores empty entries in comma-separated list',
    noProxy: ',foo.com,,bar.org,',
    host: 'foo.com',
    expected: undefined,
  },
  {
    description: 'ignores empty entries and matches valid item',
    noProxy: ',foo.com,,bar.org,',
    host: 'bar.org',
    expected: undefined,
  },
  {
    description: 'ignores empty entries and falls back to proxy',
    noProxy: ',foo.com,,bar.org,',
    host: 'other.io',
    expected: HttpsProxyUrl,
  },
  {
    description: 'does not bypass when noProxy is empty string',
    noProxy: '',
    host: 'example.com',
    expected: HttpsProxyUrl,
  },
  {
    description: 'does not bypass when noProxy contains only commas and spaces',
    noProxy: ' , , , ',
    host: 'example.com',
    expected: HttpsProxyUrl,
  },

  // Global Wildcards & Literals
  {
    description: 'wildcard * bypasses all domain hosts',
    noProxy: '*',
    host: 'anything.example.com',
    expected: undefined,
  },
  { description: 'wildcard * bypasses IP targets', noProxy: '*', host: '10.0.0.1', expected: undefined },
  {
    description: 'wildcard * anywhere in list bypasses all hosts',
    noProxy: 'foo.com,*,bar.org',
    host: 'unrelated.io',
    expected: undefined,
  },
  {
    description: 'misplaced wildcard *sub.domain.com treats * as literal',
    noProxy: '*sub.domain.com',
    host: 'sub.domain.com',
    expected: HttpsProxyUrl,
  },
  {
    description: 'misplaced wildcard *sub.domain.com treats * as literal (alt prefix)',
    noProxy: '*sub.domain.com',
    host: 'xsub.domain.com',
    expected: HttpsProxyUrl,
  },
  {
    description: 'misplaced wildcard *sub.domain.com treats * as literal (base domain)',
    noProxy: '*sub.domain.com',
    host: 'domain.com',
    expected: HttpsProxyUrl,
  },
  {
    description: 'mid-string wildcard sub*.dom*in.com treats * as literal',
    noProxy: 'sub*.dom*in.com',
    host: 'sub1.domain.com',
    expected: HttpsProxyUrl,
  },
  {
    description: 'mid-string wildcard sub*.dom*in.com treats * as literal (alt string)',
    noProxy: 'sub*.dom*in.com',
    host: 'subX.domYin.com',
    expected: HttpsProxyUrl,
  },

  // Port Matching
  {
    description: 'matches domain when port matches',
    noProxy: 'example.com:8080',
    host: 'example.com',
    port: '8080',
    expected: undefined,
  },
  {
    description: 'uses proxy when port does not match',
    noProxy: 'example.com:8080',
    host: 'example.com',
    port: '9090',
    expected: HttpsProxyUrl,
  },
  {
    description: 'uses proxy when request specifies no port but entry has port',
    noProxy: 'example.com:8080',
    host: 'example.com',
    port: undefined,
    expected: HttpsProxyUrl,
  },
  {
    description: 'bypasses port regardless of request port if entry has no port (port 8080)',
    noProxy: 'example.com',
    host: 'example.com',
    port: '8080',
    expected: undefined,
  },
  {
    description: 'bypasses port regardless of request port if entry has no port (port 443)',
    noProxy: 'example.com',
    host: 'example.com',
    port: '443',
    expected: undefined,
  },
  {
    description: 'bypasses port regardless of request port if entry has no port (no port)',
    noProxy: 'example.com',
    host: 'example.com',
    port: undefined,
    expected: undefined,
  },
  {
    description: 'matches subdomain on specific port',
    noProxy: 'example.com:3000',
    host: 'api.example.com',
    port: '3000',
    expected: undefined,
  },
  {
    description: 'uses proxy for subdomain on non-matching port',
    noProxy: 'example.com:3000',
    host: 'api.example.com',
    port: '4000',
    expected: HttpsProxyUrl,
  },
  {
    description: 'matches IP with port when both match',
    noProxy: '192.168.1.1:8080',
    host: '192.168.1.1',
    port: '8080',
    expected: undefined,
  },
  {
    description: 'uses proxy when IP matches but port differs',
    noProxy: '192.168.1.1:8080',
    host: '192.168.1.1',
    port: '9090',
    expected: HttpsProxyUrl,
  },
  {
    description: 'uses proxy when IP matches but request has no port',
    noProxy: '192.168.1.1:8080',
    host: '192.168.1.1',
    port: undefined,
    expected: HttpsProxyUrl,
  },
  {
    description: 'matches domain and port in mixed list',
    noProxy: 'foo.com:8080,bar.org,10.0.0.0/8',
    host: 'foo.com',
    port: '8080',
    expected: undefined,
  },
  {
    description: 'uses proxy for domain when port differs in mixed list',
    noProxy: 'foo.com:8080,bar.org,10.0.0.0/8',
    host: 'foo.com',
    port: '443',
    expected: HttpsProxyUrl,
  },
  {
    description: 'bypasses domain without port requirement in mixed list',
    noProxy: 'foo.com:8080,bar.org,10.0.0.0/8',
    host: 'bar.org',
    port: '9999',
    expected: undefined,
  },
  {
    description: 'bypasses CIDR without port requirement in mixed list',
    noProxy: 'foo.com:8080,bar.org,10.0.0.0/8',
    host: '10.1.2.3',
    port: undefined,
    expected: undefined,
  },
  {
    description: 'wildcard * bypasses regardless of request port (port 8080)',
    noProxy: '*',
    host: 'example.com',
    port: '8080',
    expected: undefined,
  },
  {
    description: 'wildcard * bypasses regardless of request port (port 443)',
    noProxy: '*',
    host: 'example.com',
    port: '443',
    expected: undefined,
  },
  {
    description: 'wildcard * bypasses regardless of request port (no port)',
    noProxy: '*',
    host: 'example.com',
    port: undefined,
    expected: undefined,
  },
  {
    description: 'wildcard * bypasses regardless of request port for IP',
    noProxy: '*',
    host: '10.0.0.1',
    port: '3000',
    expected: undefined,
  },
  {
    description: 'does not treat *:8080 as global wildcard (with port)',
    noProxy: '*:8080',
    host: 'example.com',
    port: '8080',
    expected: HttpsProxyUrl,
  },
  {
    description: 'does not treat *:8080 as global wildcard (no port)',
    noProxy: '*:8080',
    host: 'example.com',
    port: undefined,
    expected: HttpsProxyUrl,
  },
  {
    description: 'matches *.domain:port on subdomain and matching port',
    noProxy: '*.example.com:8080',
    host: 'api.example.com',
    port: '8080',
    expected: undefined,
  },
  {
    description: 'matches *.domain:port on deep subdomain and matching port',
    noProxy: '*.example.com:8080',
    host: 'deep.sub.example.com',
    port: '8080',
    expected: undefined,
  },
  {
    description: 'uses proxy for *.domain:port on non-matching port',
    noProxy: '*.example.com:8080',
    host: 'api.example.com',
    port: '443',
    expected: HttpsProxyUrl,
  },
  {
    description: 'uses proxy for *.domain:port when request has no port',
    noProxy: '*.example.com:8080',
    host: 'api.example.com',
    port: undefined,
    expected: HttpsProxyUrl,
  },
  {
    description: 'uses proxy for *.domain:port on parent domain',
    noProxy: '*.example.com:8080',
    host: 'example.com',
    port: '8080',
    expected: HttpsProxyUrl,
  },
  {
    description: 'matches .domain:port on subdomain and matching port',
    noProxy: '.example.com:3000',
    host: 'app.example.com',
    port: '3000',
    expected: undefined,
  },
  {
    description: 'uses proxy for .domain:port on non-matching port',
    noProxy: '.example.com:3000',
    host: 'app.example.com',
    port: '4000',
    expected: HttpsProxyUrl,
  },
  {
    description: 'uses proxy for .domain:port on parent domain',
    noProxy: '.example.com:3000',
    host: 'example.com',
    port: '3000',
    expected: HttpsProxyUrl,
  },
  {
    description: 'matches domain:port on domain and matching port',
    noProxy: 'example.com:9090',
    host: 'example.com',
    port: '9090',
    expected: undefined,
  },
  {
    description: 'matches domain:port on subdomain and matching port',
    noProxy: 'example.com:9090',
    host: 'sub.example.com',
    port: '9090',
    expected: undefined,
  },
  {
    description: 'uses proxy for domain:port on non-matching port',
    noProxy: 'example.com:9090',
    host: 'example.com',
    port: '80',
    expected: HttpsProxyUrl,
  },
  {
    description: 'uses proxy for domain:port when request has no port',
    noProxy: 'example.com:9090',
    host: 'example.com',
    port: undefined,
    expected: HttpsProxyUrl,
  },
])('getProxyUrl - $description', ({ noProxy, host, port, secure = true, expected }) => {
  const proxy = createProxy(true, HttpsProxyUrl, HttpProxyUrl, noProxy);
  expect(ProxyResolver.getProxyUrl(proxy, secure, host, port)).toBe(expected);
});

// Complex Combined Rule Scenarios
test('getProxyUrl with complex noProxy containing wildcard, valid, and malformed entries', () => {
  const noProxy = [
    'internal.corp',
    '.private.net',
    '*.staging.io',
    '10.0.0.0/8',
    'fd00::/8',
    '192.168.1.42',
    'api.example.com:8080',
    '',
    '   ',
    '///bad-cidr',
    '999.999.999.999/33',
    'not-a-cidr/abc',
    ':8080',
    '..double-dot.com',
    '*',
    'after-wildcard.should-not-matter',
  ].join(',');
  const proxy = createProxy(true, HttpsProxyUrl, HttpProxyUrl, noProxy);

  // valid entries matched before "*" is reached
  expect(ProxyResolver.getProxyUrl(proxy, true, 'internal.corp')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'deep.sub.internal.corp')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'app.private.net')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'v2.staging.io')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, '10.255.0.1')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'fdff::99')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, '192.168.1.42')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'api.example.com', '8080')).toBeUndefined();

  // "*" catches everything — hosts that would NOT match earlier entries still bypass
  expect(ProxyResolver.getProxyUrl(proxy, true, 'private.net')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'staging.io')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, '11.0.0.1')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'fe80::1')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'api.example.com', '443')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'random.external.org')).toBeUndefined();

  // malformed entries before "*" do not cause errors
  expect(ProxyResolver.getProxyUrl(proxy, true, 'garbage')).toBeUndefined();

  // loopback always bypasses regardless
  expect(ProxyResolver.getProxyUrl(proxy, true, 'localhost')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, '127.0.0.1')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, '::1')).toBeUndefined();
});

test('getProxyUrl with complex noProxy without wildcard and malformed entries', () => {
  const noProxy = [
    'corp.example.com:443',
    '.intranet.local',
    '172.16.0.0/12',
    '2001:db8::/32',
    '10.99.99.99',
    '',
    '   ',
    '///garbage',
    'bad-cidr/not-a-number',
    ':',
    ':1234',
    '..leading-dots.org',
    '*.dev.test',
  ].join(',');
  const proxy = createProxy(true, HttpsProxyUrl, HttpProxyUrl, noProxy);

  // "corp.example.com:443" — domain + port
  expect(ProxyResolver.getProxyUrl(proxy, true, 'corp.example.com', '443')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'corp.example.com', '80')).toBe(HttpsProxyUrl);
  expect(ProxyResolver.getProxyUrl(proxy, true, 'corp.example.com')).toBe(HttpsProxyUrl);

  // ".intranet.local" — subdomains only
  expect(ProxyResolver.getProxyUrl(proxy, true, 'wiki.intranet.local')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'intranet.local')).toBe(HttpsProxyUrl);

  // "172.16.0.0/12" — IPv4 CIDR (172.16.0.0 – 172.31.255.255)
  expect(ProxyResolver.getProxyUrl(proxy, true, '172.16.0.1')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, '172.31.255.254')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, '172.32.0.1')).toBe(HttpsProxyUrl);

  // "2001:db8::/32" — IPv6 CIDR
  expect(ProxyResolver.getProxyUrl(proxy, true, '2001:db8::1')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, '2001:db9::1')).toBe(HttpsProxyUrl);

  // "10.99.99.99" — exact IP
  expect(ProxyResolver.getProxyUrl(proxy, true, '10.99.99.99')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, '10.99.99.100')).toBe(HttpsProxyUrl);

  // "*.dev.test" — subdomains only
  expect(ProxyResolver.getProxyUrl(proxy, true, 'my.dev.test')).toBeUndefined();
  expect(ProxyResolver.getProxyUrl(proxy, true, 'dev.test')).toBe(HttpsProxyUrl);

  // malformed entries should not match or throw errors
  expect(ProxyResolver.getProxyUrl(proxy, true, 'garbage')).toBe(HttpsProxyUrl);
  expect(ProxyResolver.getProxyUrl(proxy, true, 'bad-cidr')).toBe(HttpsProxyUrl);
  expect(ProxyResolver.getProxyUrl(proxy, true, 'leading-dots.org')).toBe(HttpsProxyUrl);

  // unrelated host uses proxy (no wildcard in this list)
  expect(ProxyResolver.getProxyUrl(proxy, true, 'public.example.com')).toBe(HttpsProxyUrl);
});

// ============================================================================
// Module Patching Tests
// ============================================================================

test('patched http get calls original with the original parameters when proxy is not enabled', () => {
  const proxy = createProxy(false, HttpsProxyUrl, HttpProxyUrl);
  const patched = ProxyResolver.createHttpPatchedModules(proxy, certificates);
  const http = patched['http'];
  if (http && 'get' in http && typeof http.get === 'function') {
    http.get(`${Http}://site.url`);
  }
  expect(get).toBeCalledWith(`${Http}://site.url`);
});

test('patched http get calls original method with the original parameters when proxy is enabled and socketPath is requested', () => {
  const proxy = createProxy(true, HttpsProxyUrl, HttpProxyUrl);
  const patched = ProxyResolver.createHttpPatchedModules(proxy, certificates);
  const socketOptions = { socketPath: '/var/socket/path' };
  const http = patched['http'];
  if (http && 'get' in http && typeof http.get === 'function') {
    http.get(socketOptions);
  }

  expect(get).toBeCalledWith(socketOptions, undefined);
});

test('patched http get when called with url and callback calls original with options and callback', () => {
  const proxy = createProxy(true, HttpsProxyUrl, HttpProxyUrl);
  const patched = ProxyResolver.createHttpPatchedModules(proxy, certificates);
  const colon = ':';
  const url = `https://[fe80${colon}${colon}1802${colon}20ff${colon}fe8d${colon}d4ce]`;
  const callback = vi.fn();
  const http = patched['http'];
  if (http && 'get' in http && typeof http.get === 'function') {
    http.get(url, callback);
    http.get(new nodeurl.URL(url), callback);
  }
  expect(get).toHaveBeenCalledTimes(2);
  expect(get).toBeCalledWith(
    {
      agent: new HttpsProxyAgent({} as hpagent.HttpsProxyAgentOptions),
      hostname: `fe80${colon}${colon}1802${colon}20ff${colon}fe8d${colon}d4ce`,
      path: '/',
      port: '',
      protocol: 'https:',
    },
    callback,
  );
});

test('patched http get translates username@password in url to auth option', () => {
  const proxy = createProxy(true, HttpsProxyUrl, HttpProxyUrl);
  const patched = ProxyResolver.createHttpPatchedModules(proxy, certificates);
  const url = 'https://usr:pass@rest.url';
  const callback = vi.fn();
  const http = patched['http'];
  if (http && 'get' in http && typeof http.get === 'function') {
    http.get(url, callback);
    http.get(new nodeurl.URL(url), callback);
  }
  expect(get).toHaveBeenCalledTimes(2);
  expect(get).toBeCalledWith(
    {
      agent: new HttpsProxyAgent({} as hpagent.HttpsProxyAgentOptions),
      hostname: 'rest.url',
      path: '/',
      port: '',
      protocol: 'https:',
      auth: 'usr:pass',
    },
    callback,
  );
});

test('patched http get works when url passed as protocol and hostname in options', () => {
  const proxy = createProxy(true, HttpsProxyUrl, HttpProxyUrl);
  const patched = ProxyResolver.createHttpPatchedModules(proxy, certificates);
  const callback = vi.fn();
  const options = {
    hostname: 'rest.url',
    path: '/',
    port: '',
    protocol: 'https:',
  };
  const http = patched['http'];
  if (http && 'get' in http && typeof http.get === 'function') {
    http.get(options, callback);
  }
  expect(get).toBeCalledWith(
    {
      agent: new HttpsProxyAgent({} as hpagent.HttpsProxyAgentOptions),
      ...options,
    },
    callback,
  );
});
