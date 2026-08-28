import { faArrowUpRightFromSquare, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TelemetryLink } from '../TelemetryLink';

export function RHBPDDownload(): JSX.Element {
  return (
    <div className={'rounded-lg dark:text-gray-400 text-charcoal-300 bg-zinc-300/25 dark:bg-zinc-700/25'}>
      <div
        tabIndex={0}
        className="flex flex-col md:flex-row md:items-center gap-4 px-6 py-5 text-charcoal-300 dark:text-white cursor-pointer select-none">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img src="/img/redhat-logo.svg" alt="Red Hat" className="dark:hidden h-10 object-contain shrink-0" />
          <img
            src="/img/redhat-logo-dark.svg"
            alt="Red Hat"
            className="hidden dark:block h-10 object-contain shrink-0"
          />
          <div className="min-w-0 flex-1 flex flex-col gap-0.5">
            <p className="text-lg md:text-xl font-medium leading-tight m-0">Red Hat Build of Podman Desktop</p>
            <p className="text-xs leading-tight m-0 text-charcoal-300 dark:text-gray-400">
              Free to try, with optional enterprise support
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto md:shrink-0">
          <span
            className="flex flex-col items-stretch flex-1 md:flex-initial md:w-52 min-w-0"
            onClick={event => event.stopPropagation()}
            onKeyDown={event => event.stopPropagation()}>
            <TelemetryLink
              className={
                'w-full no-underline hover:no-underline inline-flex justify-center border py-2 px-5 focus:outline-hidden rounded-sm text-md font-semibold items-center transition-colors border-purple-500 bg-purple-500 hover:bg-purple-600 hover:border-purple-600 text-white'
              }
              eventPath="download"
              eventTitle="open-RHBPD"
              to="https://red.ht/redhatbuildofpodmandesktopdownload">
              <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
              Download
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-2 text-sm" />
            </TelemetryLink>
          </span>
        </div>
      </div>
    </div>
  );
}
