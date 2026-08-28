import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getClientPlatform } from '@site/src/components/DownloadButton';
import TailWindThemeSelector from '@site/src/components/TailWindThemeSelector';
import { LinuxDownloads } from '@site/src/pages/downloads/linux';
import { MacOSDownloads } from '@site/src/pages/downloads/macos';
import { WindowsDownloads } from '@site/src/pages/downloads/windows';
import Layout from '@theme/Layout';
import React from 'react';

import { RHBPDDownload } from './RHBPD';

function DownloadsContent(): JSX.Element {
  const detectedOS = getClientPlatform();
  const [showOtherPlatforms, setShowOtherPlatforms] = React.useState(false);

  const ShowOtherPlatformsButton = (): JSX.Element => {
    return (
      <div>
        <button
          type="button"
          onClick={() => setShowOtherPlatforms(value => !value)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-purple-500 text-purple-600 dark:text-purple-400 font-semibold text-sm hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white transition-colors duration-200 bg-transparent"
          aria-expanded={showOtherPlatforms}>
          <span>{showOtherPlatforms ? 'Hide other platforms' : 'Show other platforms'}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`w-3.5 shrink-0 transition-transform ${showOtherPlatforms ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    );
  };

  // Render downloads in order: detected OS first (expanded), then others
  const renderDownloads = (): JSX.Element => {
    if (detectedOS?.os === 'Windows') {
      return (
        <>
          <WindowsDownloads defaultExpanded highlighted />

          <ShowOtherPlatformsButton />

          {showOtherPlatforms && (
            <>
              <MacOSDownloads />
              <LinuxDownloads />
            </>
          )}
        </>
      );
    } else if (detectedOS?.os === 'macOS') {
      return (
        <>
          <MacOSDownloads defaultExpanded highlighted />

          <ShowOtherPlatformsButton />

          {showOtherPlatforms && (
            <>
              <WindowsDownloads />
              <LinuxDownloads />
            </>
          )}
        </>
      );
    } else if (detectedOS?.os === 'Linux') {
      return (
        <>
          <LinuxDownloads defaultExpanded highlighted />

          <ShowOtherPlatformsButton />

          {showOtherPlatforms && (
            <>
              <WindowsDownloads />
              <MacOSDownloads />
            </>
          )}
        </>
      );
    }

    // Default order if OS cannot be detected (show all)
    return (
      <>
        <WindowsDownloads />
        <MacOSDownloads />
        <LinuxDownloads />
      </>
    );
  };

  return (
    <div className="container mx-auto flex flex-col pb-16">
      <TailWindThemeSelector />
      <section className="w-full bg-hero-pattern bg-no-repeat bg-top bg-contain">
        <div className="bg-white/30 dark:bg-transparent w-full pb-8">
          <div className="w-full mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl leading-tight m-0 title-font font-medium text-charcoal-300 dark:text-white">
              Downloads
            </h1>
          </div>
          <h2 className="text-2xl leading-tight m-0 mb-2 font-bold text-charcoal-300 dark:text-white">
            Open source Podman Desktop
          </h2>
          <p className="m-0 mb-6 text-charcoal-300 dark:text-gray-400 max-w-3xl">
            Free and open source Podman Desktop for macOS, Windows, and Linux.
          </p>
          <div className="flex flex-col gap-2.5 w-full">{renderDownloads()}</div>
          <div className="mt-12 mb-4">
            <h2 className="text-2xl leading-tight m-0 mb-2 font-bold text-charcoal-300 dark:text-white">
              Enterprise-supported build
            </h2>
            <p className="m-0 mb-6 text-charcoal-300 dark:text-gray-400 max-w-3xl">
              Prefer a commercially supported build? Download the Red Hat Build of Podman Desktop from
              developers.redhat.com.
            </p>
            {RHBPDDownload()}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="Downloads">
      <BrowserOnly fallback={<div className="container mx-auto py-16">Loading downloads…</div>}>
        {() => <DownloadsContent />}
      </BrowserOnly>
    </Layout>
  );
}
