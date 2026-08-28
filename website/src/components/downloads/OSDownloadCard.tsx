/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faChevronDown, faDownload, faPaste, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TelemetryLink } from '@site/src/components/TelemetryLink';
import React from 'react';

function CopyButton({ onCopy }: { readonly onCopy: () => Promise<void> }): JSX.Element {
  const [copied, setCopied] = React.useState(false);

  React.useEffect((): (() => void) | undefined => {
    if (!copied) return undefined;
    const timeout = window.setTimeout((): void => setCopied(false), 1500);
    return (): void => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <span className="relative shrink-0 group">
      <button
        type="button"
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        className="p-1 bg-transparent border-0 cursor-pointer text-charcoal-300 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-300"
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
      <span className="pointer-events-none absolute left-1/2 bottom-full z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        {copied ? 'Copied' : 'Copy to clipboard'}
      </span>
    </span>
  );
}

function InstallCommand({ command }: { readonly command: string }): JSX.Element {
  return (
    <code className="inline-flex items-center gap-1.5 w-full max-w-full min-w-0 box-border dark:bg-charcoal-800/50 bg-zinc-300/50 px-2 py-1 text-sm dark:text-purple-200 text-purple-600">
      <FontAwesomeIcon size="xs" icon={faTerminal} className="shrink-0 mt-0.5" />
      <span className="min-w-0 flex-1 wrap-break-word text-left">{command}</span>
      <CopyButton onCopy={() => navigator.clipboard.writeText(command)} />
    </code>
  );
}

export interface InstallCommandConfig {
  readonly icon: IconProp;
  readonly label: string | React.ReactNode;
  readonly command: string;
}

export interface OSDownloadCardProps {
  readonly osName: string;
  readonly osIcon: IconProp;
  readonly defaultExpanded?: boolean;
  readonly highlighted?: boolean;
  readonly primaryDownload: {
    readonly url: string;
    readonly eventTitle: string;
    readonly caption: string;
  };
  readonly otherDownloads?: React.ReactNode;
  readonly installCommand?: InstallCommandConfig;
  readonly additionalContent?: React.ReactNode;
}

export function OSDownloadCard({
  osName,
  osIcon,
  defaultExpanded = false,
  highlighted = false,
  primaryDownload,
  otherDownloads,
  installCommand,
  additionalContent,
}: OSDownloadCardProps): JSX.Element {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const toggleExpanded = (): void => {
    setExpanded(value => !value);
  };

  return (
    <div
      className={`rounded-lg dark:text-gray-400 text-charcoal-300 bg-zinc-300/25 dark:bg-zinc-700/25 ${
        highlighted ? 'ring-2 ring-purple-500' : ''
      }`}>
      <div
        role="button"
        tabIndex={0}
        className="flex flex-col md:flex-row md:items-center gap-4 px-6 py-5 text-charcoal-300 dark:text-white cursor-pointer select-none"
        onClick={toggleExpanded}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleExpanded();
          }
        }}
        aria-expanded={expanded}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <FontAwesomeIcon size="2x" icon={osIcon} className="shrink-0 text-purple-500" />
          <div className="min-w-0 flex-1 flex flex-col gap-0.5">
            <p className="text-lg md:text-xl font-medium leading-tight m-0">{osName}</p>
            <p className="text-xs leading-tight m-0 text-charcoal-300 dark:text-gray-400">
              Podman Desktop for {osName}
            </p>
          </div>
          {/* Mobile chevron */}
          <span className="md:hidden shrink-0" aria-hidden="true">
            <FontAwesomeIcon icon={faChevronDown} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </span>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto md:shrink-0">
          <span
            className="flex flex-col items-stretch flex-1 md:flex-initial md:w-52 min-w-0"
            onClick={event => event.stopPropagation()}
            onKeyDown={event => event.stopPropagation()}>
            <TelemetryLink
              className={`w-full no-underline hover:no-underline inline-flex justify-center border py-2 px-5 focus:outline-hidden rounded-sm text-md font-semibold items-center transition-colors ${
                highlighted
                  ? 'border-purple-500 bg-purple-500 hover:bg-purple-600 hover:border-purple-600 text-white'
                  : 'border-purple-500 bg-transparent text-purple-600 dark:text-purple-500 hover:bg-purple-500 hover:text-white dark:hover:text-white'
              }`}
              eventPath="download"
              eventTitle={primaryDownload.eventTitle}
              to={primaryDownload.url}>
              <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
              Download
            </TelemetryLink>
            <p className="block w-full mt-1 text-[0.675rem] leading-tight text-center whitespace-nowrap opacity-65 m-0">
              {primaryDownload.caption}
            </p>
          </span>

          {/* Desktop chevron */}
          <span className="hidden md:flex shrink-0" aria-hidden="true">
            <FontAwesomeIcon icon={faChevronDown} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </span>
        </div>
      </div>

      {expanded && (
        <div className="px-6 md:px-16 pr-4 pb-3 flex flex-col gap-2 border-t border-purple-500/40 pt-3">
          {otherDownloads}

          {installCommand && (
            <div className="flex flex-nowrap items-center gap-2 min-w-0 max-w-full">
              <FontAwesomeIcon size="sm" icon={installCommand.icon} className="shrink-0" />
              <span className="text-sm shrink-0">{installCommand.label}:</span>
              <InstallCommand command={installCommand.command} />
            </div>
          )}

          {additionalContent}
        </div>
      )}
    </div>
  );
}
