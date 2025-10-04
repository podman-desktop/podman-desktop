import { inject, injectable } from 'inversify';

import { CONFIGURATION_DEFAULT_SCOPE, CONFIGURATION_ONBOARDING_SCOPE } from '/@api/configuration/constants.js';
import { type IConfigurationNode, IConfigurationRegistry } from '/@api/configuration/models.js';

import { ProviderRegistry } from './provider-registry.js';
import { Disposable } from './types/disposable.js';

@injectable()
export class AutostopEngine {
  private providerExtension = new Map<string, string>();

  constructor(
    @inject(IConfigurationRegistry)
    private configurationRegistry: IConfigurationRegistry,
    @inject(ProviderRegistry)
    private providerRegistry: ProviderRegistry,
  ) {}

  registerProvider(extensionId: string, extensionDisplayName: string, providerInternalId: string): Disposable {
    this.providerExtension.set(providerInternalId, extensionId);
    this.registerProviderConfiguration(extensionId, extensionDisplayName);
    return Disposable.create(() => {
      this.providerExtension.delete(providerInternalId);
    });
  }

  private registerProviderConfiguration(extensionId: string, extensionDisplayName: string): IConfigurationNode {
    const autoStopConfigurationNode: IConfigurationNode = {
      id: `preferences.${extensionId}.engine.autostop`,
      title: `Autostop ${extensionDisplayName} engine`,
      type: 'object',
      extension: {
        id: extensionId,
      },
      properties: {
        [`preferences.${extensionId}.engine.autostop`]: {
          description: `Automatically stop ${extensionDisplayName} engine when exiting Podman Desktop, even if it was started manually`,
          type: 'boolean',
          default: false,
          scope: [CONFIGURATION_DEFAULT_SCOPE, CONFIGURATION_ONBOARDING_SCOPE],
        },
      },
    };

    this.configurationRegistry.registerConfigurations([autoStopConfigurationNode]);
    return autoStopConfigurationNode;
  }

  async setConfigurationForProviders(): Promise<void> {
    this.providerExtension.forEach((extensionId, providerInternalId) => {
      const autostopConfiguration = this.configurationRegistry.getConfiguration(`preferences.${extensionId}`);

      const autostop = autostopConfiguration.get<boolean>('engine.autostop', false);

      this.providerRegistry.setAutostop(providerInternalId, autostop).catch((e: unknown) => {
        console.error(`Failed to autostop ${extensionId} container engine`, e);
      });

      // set the value if we toggle the property
      this.configurationRegistry.onDidChangeConfiguration(async e => {
        if (e.key === `preferences.${extensionId}.engine.autostop`) {
          const value = e.value as boolean;
          await this.providerRegistry.setAutostop(providerInternalId, value);
        }
      });
    });
  }
}
