import Link from '@docusaurus/Link';
import { faApple, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import { faDownload, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { MouseEventHandler } from 'react';

import { TelemetryLink } from '../components/TelemetryLink';

function getClientPlatform(): {
  os: string;
  id: string;
  icon: typeof faApple;
} | null {
  const ua = navigator.userAgent;

  if (ua.includes('Windows')) {
    return { os: 'Windows', id: 'windows', icon: faWindows };
  }
  if (ua.includes('Mac')) {
    return { os: 'macOS', id: 'macos', icon: faApple };
  }
  if (ua.includes('Linux')) {
    return { os: 'Linux', id: 'linux', icon: faLinux };
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

  return (
    <div>
      <TelemetryLink
        className="inline-flex font-semibold no-underline hover:no-underline items-center text-white hover:text-white bg-gradient-to-b from-violet-500 to-violet-600 border-0 py-3 px-6 focus:outline-hidden hover:from-violet-600 hover:to-violet-700 rounded-lg text-base mt-4 mb-0 ml-4"
        eventPath="landing"
        eventTitle="hero-download"
        to={`/downloads?os=${platform.id}`}>
        <FontAwesomeIcon size="1x" icon={faDownload} className="px-2 py-1" /> Download Now
      </TelemetryLink>
      <caption className="block mt-2 dark:text-gray-400">
        For <strong>{platform.os}</strong> <em>(browser detected)</em>
      </caption>
    </div>
  );
}

export function HeaderDownloadButton({
  mobile = false,
  onClick,
}: {
  readonly mobile?: boolean;
  readonly onClick?: MouseEventHandler<HTMLAnchorElement>;
}): JSX.Element {
  if (mobile) {
    return (
      <li className="menu__list-item pd-mobile-nav-download">
        <TelemetryLink
          className="pd-mobile-nav-download__btn menu__link no-underline hover:no-underline"
          eventPath="landing"
          eventTitle="nav-download"
          to="/downloads"
          onClick={onClick}>
          <FontAwesomeIcon icon={faDownload} />
          Download
        </TelemetryLink>
      </li>
    );
  }

  return (
    <div className="pd-desktop-only">
      <TelemetryLink
        className="flex font-semibold no-underline hover:no-underline items-center text-white hover:text-white bg-gradient-to-b from-violet-500 to-violet-600 border-0 py-3 px-6 focus:outline-hidden hover:from-violet-600 hover:to-violet-700 rounded-lg text-base mt-0 mb-0 ml-4 mr-2"
        eventPath="landing"
        eventTitle="nav-download"
        to="/downloads">
        Download
      </TelemetryLink>
    </div>
  );
}

function OtherDownloadLink(): JSX.Element {
  const platforms = [
    { name: 'macOS', icon: faApple, url: '/downloads?os=macos' },
    { name: 'Linux', icon: faLinux, url: '/downloads?os=linux' },
    { name: 'Windows', icon: faWindows, url: '/downloads?os=windows' },
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
