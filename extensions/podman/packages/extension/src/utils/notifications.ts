import type * as extensionApi from '@podman-desktop/api';

export class ExtensionNotifications {
  // Alert for setting up
  public static readonly setupPodmanNotification: extensionApi.NotificationOptions = {
    title: 'Podman needs to be set up',
    body: 'The Podman extension is installed, yet requires configuration. Some features might not function optimally.',
    type: 'info',
    markdownActions: ':button[Set up]{href=/preferences/onboarding/podman-desktop.podman title="Set up Podman"}',
    highlight: true,
    silent: true,
  };

  // Notification for if Docker Desktop has overriden the socket other tools are using it.
  public static readonly disguisedPodmanNotification: extensionApi.NotificationOptions = {
    title: 'Docker socket is not disguised correctly',
    body: 'The Docker socket (/var/run/docker.sock) is not being properly disguised by Podman. This could potentially cause docker-compatible tools to fail. Please disable any conflicting tools and re-enable Docker Compatibility.',
    markdownActions:
      ':button[Docker compatibility settings]{href=/preferences/docker-compatibility title="Docker Compatibility settings"}',
    type: 'error',
    highlight: true,
    silent: true,
  };

  // Alert for running podman-mac-helper
  // Add notification that podman-mac-helper needs setting up
  public static readonly setupMacHelperNotification: extensionApi.NotificationOptions = {
    title: 'Podman Mac Helper needs to be set up',
    body: 'The Podman Mac Helper is not set up, some features might not function optimally.',
    type: 'info',
    // Execute the "Docker Compatibility" command when the button is clicked
    markdownActions:
      ':button[Enable]{command=podman.socketCompatibilityMode} &nbsp; :button[Do not show again]{command=podman.doNotShowMacHelperNotification}',
    highlight: true,
    silent: true,
  };

  private _shouldNotifySetup = true;

  public get shouldNotifySetup(): boolean {
    return this._shouldNotifySetup;
  }

  public set shouldNotifySetup(shouldNotifySetup: boolean) {
    this._shouldNotifySetup = shouldNotifySetup;
  }
}
