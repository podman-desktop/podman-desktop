/*********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
 ********************************************************************/
import {
  Disposable,
  Provider,
  provider,
  ProviderDetectionCheck,
  ProviderOptions,
  ProviderStatus,
} from '@podman-desktop/api';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';

import { getDetectionChecks } from '/@/checks/detection-checks';
import { PodmanBinary } from '/@/utils/podman-binary';

@injectable()
export class PodmanProvider implements Disposable {
  #provider: Provider | undefined;

  constructor(
    @inject(PodmanBinary)
    private readonly podmanBinary: PodmanBinary,
  ) {}

  @preDestroy()
  dispose(): void {
    this.#provider?.dispose();
    this.#provider = undefined;
  }

  get provider(): Provider {
    if (!this.#provider) throw new Error('Podman provider not initialized');
    return this.#provider;
  }

  @postConstruct()
  async init(): Promise<void> {
    const installedPodman = await this.podmanBinary.getBinaryInfo();
    const version: string | undefined = installedPodman?.version;

    const detectionChecks: ProviderDetectionCheck[] = [];
    let status: ProviderStatus = 'not-installed';
    if (version) {
      status = 'installed';
    }

    // update detection checks
    detectionChecks.push(...getDetectionChecks(installedPodman));

    const providerOptions: ProviderOptions = {
      name: 'Podman',
      id: 'podman',
      detectionChecks,
      status,
      version,
    };

    // add images
    providerOptions.images = {
      icon: './icon.png',
      logo: './logo.png',
    };

    // Empty connection descriptive message
    providerOptions.emptyConnectionMarkdownDescription =
      'Podman is a lightweight, open-source container runtime and image management tool that enables users to run and manage containers without the need for a separate daemon.\n\nMore information: [podman.io](https://podman.io/)';

    const corePodmanEngineLinkGroup = 'Core Podman Engine';

    // add links
    providerOptions.links = [
      {
        title: 'Website',
        url: 'https://podman.io/',
      },
      {
        title: 'Installation guide',
        url: 'https://podman.io/getting-started/installation',
      },
      {
        title: 'Docker compatibility guide',
        url: 'https://podman-desktop.io/docs/migrating-from-docker/managing-docker-compatibility',
      },
      {
        title: 'Join the community',
        url: 'https://podman.io/community/',
      },
      {
        title: 'Getting started with containers',
        url: 'https://podman.io/getting-started/',
        group: corePodmanEngineLinkGroup,
      },
      {
        title: 'View podman commands',
        url: 'https://docs.podman.io/en/latest/Commands.html',
        group: corePodmanEngineLinkGroup,
      },
      {
        title: 'Set up podman',
        url: 'https://podman.io/getting-started/installation',
        group: corePodmanEngineLinkGroup,
      },
      {
        title: 'View all tutorials',
        url: 'https://docs.podman.io/en/latest/Tutorials.html',
        group: corePodmanEngineLinkGroup,
      },
    ];

    this.#provider = provider.createProvider(providerOptions);
  }
}
