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

import * as https from 'node:https';
import * as tls from 'node:tls';

import { injectable } from 'inversify';

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
    this.allCertificates = [...tls.rootCertificates, ...tls.getCACertificates('system')];

    // initialize the certificates globally
    https.globalAgent.options.ca = this.allCertificates;
  }

  getAllCertificates(): string[] {
    return this.allCertificates;
  }
}
