import Link from '@docusaurus/Link';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faApple, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import { faDownload, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TelemetryLink } from '../components/TelemetryLink';

// Utility to detect platform
function getClientPlatform(): {
  os: string;
  url: string;
  icon: IconProp;
} | null {
  const ua = navigator.userAgent;

  if (ua.includes('Windows')) {
    return { os: 'Windows', url: 'windows', icon: faWindows };
  }
  if (ua.includes('Mac')) {
    return { os: 'macOS', url: 'macos', icon: faApple };
  }
  if (ua.includes('Linux')) {
    return { os: 'Linux', url: 'linux', icon: faLinux };
  }
  return null;
}

function MainDownloadButton(): JSX.Element {
  const platform = getClientPlatform();

  if (!platform) {
    return (
      <div>
        <Link
          className="no-underline hover:no-underline inline-flex text-white hover:text-white bg-purple-500 border-0 py-2 px-4 mt-6 mb-1 focus:outline-hidden hover:bg-purple-600 rounded-sm text-lg"
          to="/downloads">
          Download Page
        </Link>
      </div>
    );
  }

  const { os, url } = platform;

  return (
    <div>
      <TelemetryLink
        className="inline-flex font-semibold no-underline hover:no-underline items-center text-white hover:text-white bg-gradient-to-b from-violet-500 to-violet-600 border-0 py-3 px-6 focus:outline-hidden hover:from-violet-600 hover:to-violet-700 rounded-lg text-base mt-4 mb-0 ml-4"
        eventPath="landing"
        eventTitle="hero-download"
        to={`/downloads/${url}`}>
        <FontAwesomeIcon size="1x" icon={faDownload} className="px-2 py-1" /> Download Now
      </TelemetryLink>
      <caption className="block mt-2 dark:text-gray-400">
        For <strong>{os}</strong> <em>(browser detected)</em>
      </caption>
    </div>
  );
}

// Same as MainDownloadButton but instead it's "Download" and has no fontawesome icon
export function HeaderDownloadButton(): JSX.Element {
  const platform = getClientPlatform();

  // If we cannot get the platform, make the link just go to downloads.
  if (!platform) {
    return (
      <div>
        <Link
          className="hidden xl:flex font-semibold no-underline hover:no-underline items-center text-white hover:text-white bg-gradient-to-b from-violet-500 to-violet-600 border-0 py-3 px-6 focus:outline-hidden hover:from-violet-600 hover:to-violet-700 rounded-lg text-base mt-0 mb-0 ml-4 mr-2"
          to="/downloads">
          Download
        </Link>
      </div>
    );
  }

  const { url } = platform;

  return (
    <div>
      <TelemetryLink
        className="hidden xl:flex font-semibold no-underline hover:no-underline items-center text-white hover:text-white bg-gradient-to-b from-violet-500 to-violet-600 border-0 py-3 px-6 focus:outline-hidden hover:from-violet-600 hover:to-violet-700 rounded-lg text-base mt-0 mb-0 ml-4 mr-2"
        eventPath="landing"
        eventTitle="hero-download"
        to={`/downloads/${url}`}>
        Download
      </TelemetryLink>
    </div>
  );
}

function OtherDownloadLink(): JSX.Element {
  const platforms = [
    { name: 'macOS', icon: faApple, url: '/downloads/macos' },
    { name: 'Linux', icon: faLinux, url: '/downloads/linux' },
    { name: 'Windows', icon: faWindows, url: '/downloads/windows' },
    { name: 'Other', icon: faEllipsis, url: '/downloads' },
  ];

  return (
    <div className="flex justify-center gap-6 my-4 pt-4">
      {platforms.map(({ name, icon, url }) => (
        <Link
          key={name}
          to={url}
          className="text-black dark:text-white hover:text-purple-600 text-3xl p-1"
          title={`Download for ${name}`}>
          <FontAwesomeIcon size="2x" icon={icon} />
        </Link>
      ))}
    </div>
  );
}

export function DownloadClientLinks(): JSX.Element {
  const platform = getClientPlatform();

  return (
    <div className="flex justify-center flex-col">
      <MainDownloadButton />
      {platform && <OtherDownloadLink />}
    </div>
  );
}

export function DownloadGenericLinks(): JSX.Element {
  return (
    <div className="flex justify-center">
      <Link
        className="no-underline hover:no-underline inline-flex text-white hover:text-white bg-purple-500 border-0 py-2 px-6 mt-6 mb-1 focus:outline-hidden hover:bg-purple-600 rounded-sm text-lg"
        to="/downloads">
        Download Page
      </Link>
    </div>
  );
}
