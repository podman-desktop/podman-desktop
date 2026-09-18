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

import * as http from 'node:http';
import * as https from 'node:https';
import * as net from 'node:net';
import * as nodeurl from 'node:url';

import type { HttpProxyAgentOptions, HttpsProxyAgentOptions } from 'hpagent';
import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent';

import type { Certificates } from './certificates.js';
import type { Proxy } from './proxy.js';

// Agents usage table
// ------------------------------------
// | Type            | Proxy | Server |
// ------------------------------------
// | HttpProxyAgent  | HTTP  | HTTP   |
// ------------------------------------
// | HttpProxyAgent  | HTTPS | HTTP   |
// ------------------------------------
// | HttpsProxyAgent | HTTP  | HTTPS  |
// ------------------------------------
// | HttpsProxyAgent | HTTPS | HTTPS  |
// ------------------------------------
// Source - https://github.com/delvedor/hpagent/tree/main#usage

function createProxyAgent(secure: boolean, proxyUrl: string, certificates: Certificates): http.Agent | https.Agent {
  const options = {
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 256,
    maxFreeSockets: 256,
    scheduling: 'lifo',
    proxy: proxyUrl,
    ca: certificates.getAllCertificates(),
  };
  return secure
    ? new HttpsProxyAgent(options as HttpsProxyAgentOptions)
    : new HttpProxyAgent(options as HttpProxyAgentOptions);
}

// Checks whether a hostname/IP should bypass the proxy.
//
// Implements the same matching algorithm as Go's net/http/httpproxy useProxy():
// https://github.com/golang/net/blob/master/http/httpproxy/proxy.go
//
// Loopback addresses (localhost, 127.0.0.1, ::1) always bypass the proxy,
// regardless of NO_PROXY contents — same as Go's behaviour.
//
// NO_PROXY is a comma-separated list. Each entry can be:
//   - "*"                → match everything
//   - IPv4 address       → exact match (e.g. 192.168.1.1)
//   - IPv6 address       → exact match (e.g. fd00::1, fe80::1)
//   - IPv4 CIDR          → range match (e.g. 10.0.0.0/8, 172.16.0.0/12)
//   - IPv6 CIDR          → range match (e.g. fd00::/8, 2001:db8::/32)
//   - domain             → matches domain and all subdomains (e.g. foo.com matches bar.foo.com)
//   - .domain            → matches subdomains only (e.g. .foo.com does NOT match foo.com)
//   - *.domain           → same as .domain
//   - any:port           → only matches when port also matches (e.g. foo.com:8080)
function isNoProxyHost(hostname: string, port?: string, noProxy?: string): boolean {
  if (!hostname) {
    return false;
  }
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
    return true;
  }
  if (!noProxy) {
    return false;
  }

  for (const raw of noProxy.split(',')) {
    const p = raw.trim().toLowerCase();
    if (!p) {
      continue;
    }
    if (p === '*') {
      return true;
    }

    // Try CIDR match (e.g. 10.0.0.0/8, fc00::/7)
    if (p.includes('/') && net.isIP(host)) {
      try {
        const slashIdx = p.indexOf('/');
        const subnet = p.slice(0, slashIdx);
        const prefix = Number(p.slice(slashIdx + 1));
        const hostFamily = net.isIPv6(host) ? 'ipv6' : 'ipv4';
        const blockList = new net.BlockList();
        blockList.addSubnet(subnet, prefix, hostFamily);
        if (blockList.check(host, hostFamily)) {
          return true;
        }
      } catch {
        console.error(`Malformed CIDR or family mismatch in NO_PROXY: ${p}`);
      }
      continue;
    }

    // Split off optional port from the noProxy entry
    let phost: string;
    let pport: string | undefined;
    const portSep = splitHostPort(p);
    if (portSep) {
      phost = portSep.host;
      pport = portSep.port;
    } else {
      phost = p;
    }

    if (!phost) {
      continue;
    }

    // Exact IP match
    if (net.isIP(phost) && net.isIP(host)) {
      if (phost === host && (!pport || pport === port)) {
        return true;
      }
      continue;
    }

    // Domain matching (Go algorithm):
    // "*.foo.com" → strip "*", becomes ".foo.com" → subdomain-only
    // ".foo.com"  → subdomain-only
    // "foo.com"   → prepend ".", set matchHost=true → domain + subdomains
    if (phost.startsWith('*.')) {
      phost = phost.slice(1);
    }
    let matchHost = false;
    if (!phost.startsWith('.')) {
      matchHost = true;
      phost = `.${phost}`;
    }

    if (host.endsWith(phost) || (matchHost && host === phost.slice(1))) {
      if (!pport || pport === port) {
        return true;
      }
    }
  }
  return false;
}

function splitHostPort(value: string): { host: string; port: string } | undefined {
  // [IPv6]:port
  const bracketIdx = value.lastIndexOf(']');
  if (bracketIdx !== -1) {
    const colonAfter = value.indexOf(':', bracketIdx);
    if (colonAfter !== -1) {
      return {
        host: value.slice(0, colonAfter).replace(/^\[|\]$/g, ''),
        port: value.slice(colonAfter + 1),
      };
    }
    return undefined;
  }
  // host:port — only if exactly one colon (not IPv6)
  const first = value.indexOf(':');
  const last = value.lastIndexOf(':');
  if (first !== -1 && first === last) {
    return { host: value.slice(0, first), port: value.slice(first + 1) };
  }
  return undefined;
}

export function getProxyUrl(proxy: Proxy, secure: boolean, hostname?: string, port?: string): string | undefined {
  if (proxy.isEnabled()) {
    if (hostname && isNoProxyHost(hostname, port, proxy.proxy?.noProxy)) {
      return undefined;
    }
    return secure ? proxy.proxy?.httpsProxy : proxy.proxy?.httpProxy;
  }
  return undefined;
}

type ProxyOptions = { agent?: http.Agent | https.Agent };

export function getOptions(proxy: Proxy, secure: boolean, certificates: Certificates): ProxyOptions {
  const options: ProxyOptions = {};
  const proxyUrl = getProxyUrl(proxy, secure);
  if (proxyUrl) {
    options.agent = createProxyAgent(secure, proxyUrl, certificates);
  } else if (secure) {
    options.agent = new https.Agent({
      ca: certificates.getAllCertificates(),
    });
  }
  return options;
}

function createHttpPatch(
  originals: typeof http | typeof https,
  proxy: Proxy,
  certificates: Certificates,
): { get: typeof http.get; request: typeof http.get } {
  return {
    get: patch(originals.get, certificates),
    request: patch(originals.request, certificates),
  };

  function patch(original: typeof http.get, certificates: Certificates): typeof http.get {
    function patched(
      url?: string | nodeurl.URL | http.RequestOptions,
      options?: http.RequestOptions | ((res: http.IncomingMessage) => void),
      callback?: (res: http.IncomingMessage) => void,
    ): http.ClientRequest {
      if (proxy?.isEnabled()) {
        if (
          (url instanceof nodeurl.URL && !url?.searchParams) ||
          (typeof url !== 'string' && typeof url === 'object' && !(url instanceof nodeurl.URL))
        ) {
          callback = options as (res: http.IncomingMessage) => void;
          options = url;
          url = undefined;
        }
        if (typeof options === 'function') {
          callback = options;
          options = undefined;
        }

        options ??= {};

        if (options.socketPath) {
          return original(options, callback);
        }

        if (options.agent === true) {
          throw new Error('Unexpected agent option: true');
        }

        if (url) {
          const parsed = typeof url === 'object' && url instanceof nodeurl.URL ? url : new nodeurl.URL(url);
          const urlOptions = {
            protocol: parsed.protocol,
            hostname: parsed.hostname.lastIndexOf('[', 0) === 0 ? parsed.hostname.slice(1, -1) : parsed.hostname,
            port: parsed.port,
            path: `${parsed.pathname}${parsed.search}`,
          };
          if (parsed.username || parsed.password) {
            options.auth = `${parsed.username}:${parsed.password}`;
          }
          options = { ...urlOptions, ...options };
        } else {
          options = { ...options };
        }

        const host = options.hostname ?? options.host;
        const isLocalhost = !host || host === 'localhost' || host === '127.0.0.1';
        if (!isLocalhost) {
          options = { ...options, ...getOptions(proxy, options.protocol === 'https:', certificates) };
        }

        return original(options, callback);
      }
      return original.apply(null, arguments as any); // eslint-disable-line
    }
    return patched;
  }
}

export function createHttpPatchedModules(
  proxy: Proxy,
  certificates: Certificates,
): { http: typeof http; https: typeof https; 'node:http': typeof http; 'node:https': typeof https } {
  const res = {
    http: { ...http, ...createHttpPatch(http, proxy, certificates) },
    https: { ...https, ...createHttpPatch(https, proxy, certificates) },
  };
  return { ...res, 'node:https': res.https, 'node:http': res.http };
}
