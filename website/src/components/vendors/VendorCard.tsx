import useBaseUrl from '@docusaurus/useBaseUrl';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import type { VendorCardProps } from './vendorData';

export function VendorCard({ name, logo, logoDark, description, href }: VendorCardProps): JSX.Element {
  const resolvedLogo = useBaseUrl(logo);
  const resolvedLogoDark = useBaseUrl(logoDark ?? logo);
  return (
    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col h-full bg-white/60 dark:bg-charcoal-800/60">
      <div className="mb-4">
        <img
          src={resolvedLogo}
          alt={name}
          className={logoDark ? 'dark:hidden' : ''}
          style={{ height: '48px', objectFit: 'contain' }}
        />
        {logoDark && (
          <img
            src={resolvedLogoDark}
            alt={name}
            className="hidden dark:block"
            style={{ height: '48px', objectFit: 'contain' }}
          />
        )}
      </div>
      <p className="text-charcoal-300 dark:text-gray-400 mb-4 flex-grow">{description}</p>
      <div className="p-[2px] rounded border-gradient bg-gradient-to-r from-sky-500 to-purple-500 w-fit mt-auto">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="vendor-card-cta inline-flex items-center gap-2 px-4 py-2 rounded font-semibold text-base bg-white dark:bg-charcoal-800 text-charcoal-300 dark:text-white no-underline hover:no-underline hover:bg-purple-600 hover:text-white transition-colors duration-200">
          Learn more
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
        </a>
      </div>
    </div>
  );
}
