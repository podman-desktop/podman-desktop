import { ProviderRegistry } from '../provider-registry';
import type {
  ProviderContainerConnectionInfo,
  ProviderKubernetesConnectionInfo,
  ProviderVmConnectionInfo,
} from '@podman-desktop/api';

describe('ProviderRegistry.getMatchingConnectionFromProvider', () => {
  let registry: ProviderRegistry;

  beforeEach(() => {
    registry = new ProviderRegistry();
    jest.spyOn(registry, 'getMatchingContainerConnectionFromProvider').mockReturnValue('container-match' as any);
    jest.spyOn(registry, 'getMatchingKubernetesConnectionFromProvider').mockReturnValue('k8s-match' as any);
    jest.spyOn(registry, 'getMatchingVmConnectionFromProvider').mockReturnValue('vm-match' as any);
  });

  it('should match container connections', () => {
    const info: ProviderContainerConnectionInfo = {
      connectionType: 'container',
      // minimal required fields...
    } as any;
    const result = registry.getMatchingConnectionFromProvider('id', info);
    expect(result).toBe('container-match');
  });

  it('should match kubernetes connections', () => {
    const info: ProviderKubernetesConnectionInfo = {
      connectionType: 'kubernetes',
      // minimal required fields...
    } as any;
    const result = registry.getMatchingConnectionFromProvider('id', info);
    expect(result).toBe('k8s-match');
  });

  it('should match vm connections', () => {
    const info: ProviderVmConnectionInfo = {
      connectionType: 'vm',
      name: 'vm1',
      status: 'started',
    } as any;
    const result = registry.getMatchingConnectionFromProvider('id', info);
    expect(result).toBe('vm-match');
  });

  it('should throw on unsupported connection type', () => {
    const info = { connectionType: 'unknown' } as any;
    expect(() => registry.getMatchingConnectionFromProvider('id', info)).toThrow(
      /Unsupported provider connection type/,
    );
  });
});