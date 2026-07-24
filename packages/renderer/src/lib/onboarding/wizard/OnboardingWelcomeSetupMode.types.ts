export type SetupMode = 'recommended' | 'advanced';
export const CONTAINER_ENGINES = ['podman', 'docker'] as const;
export type ContainerEngine = (typeof CONTAINER_ENGINES)[number];

export interface SetupSelection {
  setupMode: SetupMode;
  selectedEngine: ContainerEngine;
  installKubectl: boolean;
  installCompose: boolean;
}

export const DEFAULT_SETUP_SELECTION: SetupSelection = {
  setupMode: 'recommended',
  selectedEngine: 'podman',
  installKubectl: true,
  installCompose: true,
};

export function isContainerEngine(value: string): value is ContainerEngine {
  return (CONTAINER_ENGINES as readonly string[]).includes(value);
}
