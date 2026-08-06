import useBaseUrl from '@docusaurus/useBaseUrl';
import { faArrowUpRightFromSquare, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { redHatVendor } from '../vendors/vendorData';

const DISCUSSION_URL = 'https://github.com/podman-desktop/podman-desktop/discussions';

export function EnterpriseSupportBanner(): JSX.Element {
  const logo = useBaseUrl(redHatVendor.logo);
  const logoDark = useBaseUrl(redHatVendor.logoDark ?? redHatVendor.logo);

  return (
    <section className="mt-12 mb-4 pd-downloads-page">
      <h2 className="pd-downloads-section-title font-bold text-charcoal-300 dark:text-white">
        Enterprise-supported build
      </h2>
      <p className="pd-downloads-section-desc text-charcoal-300 dark:text-gray-400 max-w-3xl">
        Prefer a commercially supported build? Download the Red Hat Build of Podman Desktop from developers.redhat.com.
      </p>

      <div className="rounded-lg dark:text-gray-400 text-charcoal-300 bg-zinc-300/25 dark:bg-zinc-700/25">
        <div className="pd-download-row px-6 py-5 gap-4 text-charcoal-300 dark:text-white">
          <div className="pd-download-row__info">
            <img src={logo} alt="Red Hat" className="dark:hidden h-10 object-contain shrink-0" />
            <img src={logoDark} alt="Red Hat" className="hidden dark:block h-10 object-contain shrink-0" />
            <div className="min-w-0 pd-platform-copy">
              <p className="pd-platform-title">Red Hat Build of Podman Desktop</p>
              <p className="pd-platform-subtitle">Free to try, with optional enterprise support</p>
            </div>
          </div>

          <div className="pd-download-row__actions">
            <span className="pd-download-cta-wrap">
              <a
                href={redHatVendor.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-download-cta pd-download-cta--primary no-underline hover:no-underline inline-flex justify-center border py-2 px-5 focus:outline-hidden rounded-sm text-md font-semibold items-center">
                <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
                Download
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-2 text-sm" />
              </a>
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-charcoal-300 dark:text-gray-400 max-w-3xl">
        To be added as an enterprise-supported download, please{' '}
        <a
          href={DISCUSSION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-purple-500 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200">
          open a discussion
        </a>
        .
      </p>
    </section>
  );
}
