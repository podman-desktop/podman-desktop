/**
 * macOS installation paths for Podman binary.
 * These paths are checked to detect multiple Podman installations:
 * - '/opt/podman/bin/podman': Official DMG installer location
 * - '/opt/local/bin/podman': MacPorts installation location
 */
export const PODMAN_INSTALLATION_PATHS = ['/opt/podman/bin/podman', '/opt/local/bin/podman'];
