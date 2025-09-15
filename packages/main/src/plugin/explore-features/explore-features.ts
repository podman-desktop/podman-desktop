/**********************************************************************
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
 ***********************************************************************/

import { inject, injectable } from 'inversify';

import { IConfigurationNode } from '/@api/configuration/models.js';

import { ConfigurationRegistry } from '../configuration-registry.js';
import { ContainerProviderRegistry } from '../container-registry.js';
import { ExtensionLoader } from '../extension/extension-loader.js';
import { KubernetesClient } from '../kubernetes/kubernetes-client.js';
import { ProviderRegistry } from '../provider-registry.js';
import { Feature } from './explore-features-api.js';
import featuresJson from './features.json' with { type: 'json' };
import exploreKubernetes from './images/explore-kubernetes.png';
import installExtension from './images/install-extensions.png';
import manageDocker from './images/manage-docker.png';
import startAContainer from './images/start-a-container.png';

@injectable()
export class ExploreFeatures {
  private images: { [featureId: string]: string } = {};

  constructor(
    @inject(ContainerProviderRegistry)
    private containerProviderRegistry: ContainerProviderRegistry,
    @inject(ExtensionLoader)
    private extensionLoader: ExtensionLoader,
    @inject(ConfigurationRegistry)
    private configurationRegistry: ConfigurationRegistry,
    @inject(ProviderRegistry)
    private providerRegistry: ProviderRegistry,
    @inject(KubernetesClient)
    private kubernetesClient: KubernetesClient,
  ) {
    this.images['start-a-container'] = startAContainer;
    this.images['explore-kubernetes'] = exploreKubernetes;
    this.images['install-extensions'] = installExtension;
    this.images['manage-docker'] = manageDocker;
  }

  async downloadFeaturesList(): Promise<Feature[]> {
    const hiddenFeatures = this.configurationRegistry
      .getConfiguration('exploreFeatures')
      .get<string[]>('hiddenFeatures', []);

    (featuresJson.features as Feature[]).forEach(feature => {
      feature.show = !hiddenFeatures.includes(feature.id);
      feature.img = this.images[feature.id];
      return feature;
    });
    return this.checkShowRequirements(featuresJson.features);
  }

  private async checkShowRequirements(features: Feature[]): Promise<Feature[]> {
    const containerList = await this.containerProviderRegistry.listContainers();
    const installedExtensionList = (await this.extensionLoader.listExtensions()).filter(ext => ext.removable);
    const providerList = this.providerRegistry.getProviderInfos();
    const contextsStateList = this.kubernetesClient.getContextsGeneralState();
    features.forEach(feature => {
      if (feature.show && feature.id === 'start-a-container') {
        feature.show =
          containerList.length === 0 &&
          providerList
            .map(provider => provider.containerConnections)
            .flat()
            .filter(providerContainerConnection => providerContainerConnection.status === 'started').length > 0;
      } else if (feature.show && feature.id === 'explore-kubernetes') {
        feature.show =
          !providerList.find(provider => provider.kubernetesConnections.length > 0) &&
          !contextsStateList.values().some(context => context.reachable);
      } else if (feature.show && feature.id === 'install-extensions') {
        feature.show = installedExtensionList.length === 0;
      } else if (feature.show && feature.id === 'manage-docker') {
        feature.show = !this.configurationRegistry.getConfiguration('dockerCompatibility').get<boolean>('enabled');
      }
    });

    return features;
  }

  async closeFeatureCard(featureId: string): Promise<void> {
    const hiddenFeatures = this.configurationRegistry
      .getConfiguration('exploreFeatures')
      .get<string[]>('hiddenFeatures', []);
    if (!hiddenFeatures.includes(featureId)) {
      hiddenFeatures.push(featureId);
    }

    await this.configurationRegistry.updateConfigurationValue('exploreFeatures.hiddenFeatures', [...hiddenFeatures]);
  }

  init(): void {
    const exploreFeaturesConfiguration: IConfigurationNode = {
      id: 'exploreFeatures',
      title: 'Show explore features content',
      type: 'object',
      properties: {
        ['exploreFeatures.expanded']: {
          type: 'boolean',
          default: true,
          hidden: true,
        },
        ['exploreFeatures.hiddenFeatures']: {
          type: 'array',
          default: [],
          hidden: true,
        },
      },
    };

    this.configurationRegistry.registerConfigurations([exploreFeaturesConfiguration]);
  }
}
