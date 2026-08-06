import { usePluginData } from '@docusaurus/useGlobalData';
import { faApple, faLinux, faMicrosoft, faWindows } from '@fortawesome/free-brands-svg-icons';
import { faBeer, faCheck, faChevronDown, faDownload, faPaste, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TelemetryLink } from '@site/src/components/TelemetryLink';
import type { GitHubMetadata } from '@site/src/plugins/github-metadata';
import type { ClientOs, ClientPlatform } from '@site/src/utils/platform';
import React from 'react';

interface PlatformDownloadPanelProps {
  readonly platform: ClientPlatform;
  readonly highlighted?: boolean;
  readonly defaultExpanded?: boolean;
}

function CopyButton({ onCopy }: { readonly onCopy: () => Promise<void> }): JSX.Element {
  const [copied, setCopied] = React.useState(false);

  React.useEffect((): (() => void) | undefined => {
    if (!copied) return undefined;
    const timeout = window.setTimeout((): void => setCopied(false), 1500);
    return (): void => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <span className="relative shrink-0 group/copy pd-copy">
      <button
        type="button"
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        className="pd-copy__button p-1 bg-transparent border-0 cursor-pointer text-charcoal-300 dark:text-gray-300"
        onClick={event => {
          event.stopPropagation();
          onCopy()
            .then(() => setCopied(true))
            .catch((err: unknown) => {
              console.error('unable to copy instructions', err);
            });
        }}>
        <FontAwesomeIcon size="xs" icon={copied ? faCheck : faPaste} className="text-xl" />
      </button>
      <span role="tooltip" className="pd-copy-tooltip">
        {copied ? 'Copied' : 'Copy to clipboard'}
      </span>
    </span>
  );
}

function InstallCommand({ command }: { readonly command: string }): JSX.Element {
  return (
    <code className="pd-install-command dark:bg-charcoal-800/50 bg-zinc-300/50 px-2 py-1 text-sm dark:text-purple-200 text-purple-600">
      <FontAwesomeIcon size="xs" icon={faTerminal} className="pd-install-command__prompt shrink-0" />
      <span className="pd-install-command__text">{command}</span>
      <CopyButton onCopy={() => navigator.clipboard.writeText(command)} />
    </code>
  );
}

function usePrimaryDownload(os: ClientOs): { url: string; eventTitle: string; caption: string } {
  const {
    latestRelease: { linux, macos, windows, version },
  } = usePluginData('docusaurus-plugin-github-metadata') as GitHubMetadata;

  if (os === 'macOS') {
    return {
      url: macos.universal,
      eventTitle: 'download-mac',
      caption: `Universal *.dmg, version ${version}`,
    };
  }
  if (os === 'Windows') {
    return {
      url: windows.setupX64,
      eventTitle: 'download-windows',
      caption: `Windows installer x64, version ${version}`,
    };
  }
  return {
    url: linux.flatpak,
    eventTitle: 'download-linux',
    caption: `Linux *.flatpak, version ${version}`,
  };
}

function MacDetails(): JSX.Element {
  const {
    latestRelease: { macos },
  } = usePluginData('docusaurus-plugin-github-metadata') as GitHubMetadata;

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="text-charcoal-300 dark:text-gray-400">Other:</span>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-mac"
          to={macos.x64}>
          Intel
        </TelemetryLink>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-mac"
          to={macos.arm64}>
          Apple silicon
        </TelemetryLink>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-mac"
          to={macos.airgapsetupX64}>
          Air-gapped Intel
        </TelemetryLink>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-mac"
          to={macos.airgapsetupArm64}>
          Air-gapped Apple silicon
        </TelemetryLink>
      </div>
      <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
        <FontAwesomeIcon size="sm" icon={faBeer} className="shrink-0" />
        <span className="text-sm shrink-0">Brew:</span>
        <InstallCommand command="brew install --cask podman-desktop" />
      </div>
    </>
  );
}

function WindowsDetails(): JSX.Element {
  const {
    latestRelease: { windows },
  } = usePluginData('docusaurus-plugin-github-metadata') as GitHubMetadata;

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="text-charcoal-300 dark:text-gray-400">Other:</span>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-windows"
          to={windows.setupArm64}>
          Arm64 installer
        </TelemetryLink>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-windows"
          to={windows.binaryX64}>
          Portable x64
        </TelemetryLink>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-windows"
          to={windows.binaryArm64}>
          Portable arm64
        </TelemetryLink>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-windows"
          to={windows.airgapsetupX64}>
          Air-gapped x64
        </TelemetryLink>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-windows"
          to={windows.airgapsetupArm64}>
          Air-gapped arm64
        </TelemetryLink>
      </div>
      <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
        <FontAwesomeIcon size="sm" icon={faMicrosoft} className="shrink-0" />
        <span className="text-sm shrink-0">winget:</span>
        <InstallCommand command="winget install -e --id RedHat.Podman-Desktop" />
      </div>
      <div>
        <a
          className="underline inline-flex items-center dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 py-1 font-semibold text-sm"
          href="https://podman-desktop.io/docs/installation/windows-install"
          target="_blank"
          rel="noopener noreferrer"
          onClick={event => event.stopPropagation()}>
          <FontAwesomeIcon size="1x" icon={faWindows} className="mr-2" />
          Package Managers Guide
        </a>
      </div>
    </>
  );
}

function LinuxDetails(): JSX.Element {
  const {
    latestRelease: { linux },
  } = usePluginData('docusaurus-plugin-github-metadata') as GitHubMetadata;

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="text-charcoal-300 dark:text-gray-400">Other:</span>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-linux"
          to={linux.amd64}>
          AMD64 binary
        </TelemetryLink>
        <TelemetryLink
          className="underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          eventPath="download"
          eventTitle="download-linux"
          to={linux.arm64}>
          ARM64 binary
        </TelemetryLink>
      </div>
      <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
        <FontAwesomeIcon size="sm" icon={faLinux} className="shrink-0" />
        <span className="text-sm shrink-0">
          <a
            className="underline text-purple-500 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
            href="https://flathub.org/apps/details/io.podman_desktop.PodmanDesktop"
            target="_blank"
            rel="noopener noreferrer"
            onClick={event => event.stopPropagation()}>
            Flathub
          </a>
          :
        </span>
        <InstallCommand command="flatpak install flathub io.podman_desktop.PodmanDesktop" />
      </div>
    </>
  );
}

function PlatformDetails({ os }: { readonly os: ClientOs }): JSX.Element {
  if (os === 'macOS') return <MacDetails />;
  if (os === 'Windows') return <WindowsDetails />;
  return <LinuxDetails />;
}

export function PlatformDownloadPanel({
  platform,
  highlighted = false,
  defaultExpanded = false,
}: PlatformDownloadPanelProps): JSX.Element {
  const primary = usePrimaryDownload(platform.os);
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [ctaHovered, setCtaHovered] = React.useState(false);
  const icon = platform.os === 'macOS' ? faApple : platform.os === 'Windows' ? faWindows : faLinux;

  const toggleExpanded = (): void => {
    setExpanded(value => !value);
  };

  const ctaClassName = [
    'pd-download-cta',
    highlighted ? 'pd-download-cta--primary' : 'pd-download-cta--secondary',
    ctaHovered ? 'pd-download-cta--hovered' : '',
    'no-underline hover:no-underline inline-flex justify-center border py-2 px-5 focus:outline-hidden rounded-sm text-md font-semibold items-center',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`rounded-lg dark:text-gray-400 text-charcoal-300 bg-zinc-300/25 dark:bg-zinc-700/25 ${
        highlighted ? 'ring-2 ring-purple-500' : ''
      }`}>
      <div
        role="button"
        tabIndex={0}
        className="pd-download-row px-6 py-5 gap-4 text-charcoal-300 dark:text-white cursor-pointer select-none"
        onClick={toggleExpanded}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleExpanded();
          }
        }}
        aria-expanded={expanded}>
        <div className="pd-download-row__info">
          <FontAwesomeIcon size="2x" icon={icon} className="shrink-0 text-purple-500" />
          <div className="min-w-0 flex-1 pd-platform-copy">
            <p className="pd-platform-title">{platform.os}</p>
            <p className="pd-platform-subtitle">Podman Desktop for {platform.os}</p>
          </div>
          {/* Mobile: chevron by the OS name, away from Download to avoid mis-taps */}
          <span className="pd-download-chevron-slot pd-download-chevron-slot--mobile" aria-hidden="true">
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </span>
        </div>

        <div className="pd-download-row__actions">
          <span
            className="pd-download-cta-wrap"
            onClick={event => event.stopPropagation()}
            onKeyDown={event => event.stopPropagation()}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}>
            <TelemetryLink
              className={ctaClassName}
              eventPath="download"
              eventTitle={primary.eventTitle}
              to={primary.url}>
              <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
              Download
            </TelemetryLink>
            <p className="pd-download-caption">{primary.caption}</p>
          </span>

          {/* Desktop: chevron beside Download */}
          <span className="pd-download-chevron-slot pd-download-chevron-slot--desktop" aria-hidden="true">
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </span>
        </div>
      </div>

      {expanded && (
        <div className="pd-download-details pl-6 pr-4 pb-3 flex flex-col gap-2 border-t border-purple-500/40 pt-3">
          <PlatformDetails os={platform.os} />
        </div>
      )}
    </div>
  );
}
