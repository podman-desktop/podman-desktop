import BrowserOnly from '@docusaurus/BrowserOnly';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EnterpriseSupportBanner } from '@site/src/components/downloads/EnterpriseSupportBanner';
import { PlatformDownloadPanel } from '@site/src/components/downloads/PlatformDownloadPanel';
import TailWindThemeSelector from '@site/src/components/TailWindThemeSelector';
import { ALL_PLATFORMS, type ClientPlatform, getClientPlatform, getPlatformFromSearch } from '@site/src/utils/platform';
import Layout from '@theme/Layout';
import React, { useEffect, useMemo, useState } from 'react';

function DownloadsContent(): JSX.Element {
  const location = useLocation();
  const detected = getClientPlatform();
  const fromQuery = getPlatformFromSearch(location.search);

  const primary: ClientPlatform | null = fromQuery ?? detected;

  const [showOtherPlatforms, setShowOtherPlatforms] = useState(!primary);

  useEffect(() => {
    setShowOtherPlatforms(!primary);
  }, [primary?.id]);

  const otherPlatforms = useMemo(
    () => (primary ? ALL_PLATFORMS.filter(platform => platform.id !== primary.id) : []),
    [primary],
  );

  return (
    <div className="container mx-auto flex flex-col pb-16 pd-downloads-page">
      <TailWindThemeSelector />

      <section className="w-full bg-hero-pattern bg-no-repeat bg-top bg-contain">
        <div className="bg-white/30 dark:bg-transparent w-full pb-8">
          <div className="w-full mb-8">
            <h1 className="pd-downloads-title title-font font-medium text-charcoal-300 dark:text-white">Downloads</h1>
          </div>

          <h2 className="pd-downloads-section-title font-bold text-charcoal-300 dark:text-white">
            Open source Podman Desktop
          </h2>
          <p className="pd-downloads-section-desc text-charcoal-300 dark:text-gray-400 max-w-3xl">
            Free and open source Podman Desktop for macOS, Windows, and Linux.
          </p>

          <div className="flex flex-col gap-2.5 w-full">
            {primary ? (
              <>
                <PlatformDownloadPanel platform={primary} highlighted />

                <div>
                  <button
                    type="button"
                    onClick={() => setShowOtherPlatforms(value => !value)}
                    className="pd-platforms-toggle inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-purple-500 text-purple-600 dark:text-purple-400 font-semibold text-sm hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white transition-colors duration-200 bg-transparent"
                    aria-expanded={showOtherPlatforms}>
                    <span className="pd-platforms-toggle__label">
                      <span className="pd-platforms-toggle__sizer" aria-hidden="true">
                        Show other platforms
                      </span>
                      <span className="pd-platforms-toggle__text">
                        {showOtherPlatforms ? 'Hide other platforms' : 'Show other platforms'}
                      </span>
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`pd-platforms-toggle__icon transition-transform ${showOtherPlatforms ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {showOtherPlatforms && (
                  <div className="flex flex-col gap-2.5 w-full">
                    {otherPlatforms.map(platform => (
                      <PlatformDownloadPanel key={platform.id} platform={platform} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-2.5 w-full">
                {ALL_PLATFORMS.map(platform => (
                  <PlatformDownloadPanel key={platform.id} platform={platform} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <EnterpriseSupportBanner />
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
