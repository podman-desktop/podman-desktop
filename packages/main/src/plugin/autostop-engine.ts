import { inject, injectable } from 'inversify';

import { CONFIGURATION_DEFAULT_SCOPE, CONFIGURATION_ONBOARDING_SCOPE } from '/@api/configuration/constants.js';
import { type IConfigurationNode, IConfigurationRegistry } from '/@api/configuration/models.js';

import { ProviderRegistry } from './provider-registry.js';
import { Disposable } from './types/disposable.js';

@injectable()
export class AutostopEngine {
  private providerExtension = new Map<string, Set<string>>();

  constructor(
    @inject(IConfigurationRegistry)
    private configurationRegistry: IConfigurationRegistry,
    @inject(ProviderRegistry)
    private providerRegistry: ProviderRegistry,
  ) {
    // register one listener only
    this.configurationRegistry.onDidChangeConfiguration(async e => {
      const m = /^preferences\.(.+)\.engine\.autostop$/.exec(e.key);
      if (!m) return;
      const extensionId = m[1];
      const providerIds = Array.from(this.providerExtension.get(extensionId!) ?? []);
      if (providerIds.length === 0) return;
      const results = await Promise.allSettled(
        Array.from(providerIds, id => this.providerRegistry.setAutostop(id, e.value as boolean)),
      );
      results.forEach((result, idx) => {
        if (result.status === 'rejected') {
          console.log(`Failed to set autostop for provider ${providerIds[idx]}`, result.reason);
        }
      });
    });
  }

  /**
   * Registers a provider with the given extension details and handles its configuration settings.
   *
   * @param {string} extensionId - The unique identifier for the extension.
   * @param {string} extensionDisplayName - The display name of the extension.
   * @param {string} providerInternalId - The internal identifier for the provider being registered.
   * @return {Disposable} A disposable object to clean up the registered provider.
   */
  registerProvider(extensionId: string, extensionDisplayName: string, providerInternalId: string): Disposable {
    let providerIds = this.providerExtension.get(extensionId);
    if (!providerIds) {
      providerIds = new Set();
      this.providerExtension.set(extensionId, providerIds);
    }
    providerIds.add(providerInternalId);
    this.registerProviderConfiguration(extensionId, extensionDisplayName);

    // immediately apply current setting
    const cfg = this.configurationRegistry.getConfiguration(`preferences.${extensionId}`);
    const autostop = cfg.get<boolean>('engine.autostop', false);
    this.providerRegistry.setAutostop(providerInternalId, autostop).catch(console.error);

    return Disposable.create(() => {
      const providerIds = this.providerExtension.get(extensionId);
      providerIds?.delete(providerInternalId);
      if (!providerIds?.size) {
        this.providerExtension.delete(extensionId);
      }
    });
  }

  /**
   * Registers a provider-specific configuration node for the application.
   *
   * @param {string} extensionId - The unique identifier of the provider extension.
   * @param {string} extensionDisplayName - The user-friendly display name of the provider extension.
   * @return {IConfigurationNode} The configuration node that was registered.
   */
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
}
