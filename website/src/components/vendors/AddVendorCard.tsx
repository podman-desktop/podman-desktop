import { faArrowUpRightFromSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const DISCUSSION_URL = 'https://github.com/podman-desktop/podman-desktop/discussions';

export function AddVendorCard(): JSX.Element {
  return (
    <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col h-full bg-white/40 dark:bg-charcoal-800/40">
      <div className="mb-4 flex items-center" style={{ height: '48px' }}>
        <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <FontAwesomeIcon icon={faPlus} className="text-xl" />
        </div>
      </div>
      <p className="text-charcoal-300 dark:text-gray-400 mb-4 flex-grow">
        If you are a vendor for Podman Desktop and would like to be added to the website, please open a GitHub
        Discussion to be added.
      </p>
      <div className="p-[2px] rounded border-gradient bg-gradient-to-r from-sky-500 to-purple-500 w-fit mt-auto">
        <a
          href={DISCUSSION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="vendor-card-cta inline-flex items-center gap-2 px-4 py-2 rounded font-semibold text-base bg-white dark:bg-charcoal-800 text-charcoal-300 dark:text-white no-underline hover:no-underline hover:bg-purple-600 hover:text-white transition-colors duration-200">
          Open a discussion
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
        </a>
      </div>
    </div>
  );
}
