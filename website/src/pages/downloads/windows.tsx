import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import { faMicrosoft, faWindows } from '@fortawesome/free-brands-svg-icons';
import { faDownload, faPaste, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TailWindThemeSelector from '@site/src/components/TailWindThemeSelector';
import { TelemetryLink } from '@site/src/components/TelemetryLink';
import type { GitHubMetadata } from '@site/src/plugins/github-metadata';
import Layout from '@theme/Layout';
import React from 'react';

export function WindowsDownloads(): JSX.Element {
  const {
    latestRelease: { windows, version },
  } = usePluginData('docusaurus-plugin-github-metadata') as GitHubMetadata;

  const copyCliInstructions = async (): Promise<void> => {
    await navigator.clipboard.writeText('winget install -e --id RedHat.Podman-Desktop');
  };

  return (
    <div className="basis-1/3 py-2 rounded-lg dark:text-gray-400 text-charcoal-300  bg-zinc-300/25 dark:bg-zinc-700/25 bg-blend-multiply text-center items-center">
      <FontAwesomeIcon size="4x" icon={faWindows} className="my-4" />
      <h2 className="w-full text-center text-4xl title-font font-medium pb-3 border-purple-500 border-b-2">Windows</h2>
      <div className="flex p-1 flex-col md:flex-col items-center align-top">
        <div className="flex flex-col align-middle items-center">
          <h3 className="mt-0">Podman Desktop for Windows</h3>
          <div className="pt-8">
            <TelemetryLink
              className="mt-auto no-underline hover:no-underline inline-flex text-white hover:text-white bg-purple-500 border-0 py-2 px-6 focus:outline-hidden hover:bg-purple-500 rounded-sm text-md font-semibold"
              eventPath="download"
              eventTitle="download-windows"
              to={windows.setupX64}>
              <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
              Download Now
            </TelemetryLink>
            <caption className="block w-full mt-1 text/50 dark:text-white/50">
              Windows installer x64, version {version}
            </caption>
          </div>
          <div className="mt-4">
            <div>Other Windows downloads:</div>

            <div className="pt-4 pb-4 flex flex-col">
              <div className="">Installer:</div>
              <div className="flex flex-row justify-center">
                <TelemetryLink
                  className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-3 font-semibold text-md"
                  eventPath="download"
                  eventTitle="download-windows"
                  to={windows.setupX64}>
                  <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
                  x64
                </TelemetryLink>
                <TelemetryLink
                  className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-3 font-semibold text-md"
                  eventPath="download"
                  eventTitle="download-windows"
                  to={windows.setupArm64}>
                  <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
                  arm64
                </TelemetryLink>
              </div>
            </div>

            <div className="pt-2 pb-4 flex flex-col">
              <div className="">Portable binary:</div>
              <div className="flex flex-row justify-center">
                <TelemetryLink
                  className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-2 font-semibold text-md"
                  eventPath="download"
                  eventTitle="download-windows"
                  to={windows.binaryX64}>
                  <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
                  x64
                </TelemetryLink>
                <TelemetryLink
                  className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-2 font-semibold text-md"
                  eventPath="download"
                  eventTitle="download-windows"
                  to={windows.binaryArm64}>
                  <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
                  arm64
                </TelemetryLink>
              </div>
            </div>

            <div className="pt-2 pb-4 flex flex-col">
              <div className="">Installer for restricted environments:</div>
              <div className="flex flex-row justify-center">
                <TelemetryLink
                  className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-6 font-semibold text-md"
                  eventPath="download"
                  eventTitle="download-windows"
                  to={windows.airgapsetupX64}>
                  <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
                  x64
                </TelemetryLink>
                <TelemetryLink
                  className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-6 font-semibold text-md"
                  eventPath="download"
                  eventTitle="download-windows"
                  to={windows.airgapsetupArm64}>
                  <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
                  arm64
                </TelemetryLink>
              </div>
            </div>

            <Link
              className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-6 font-semibold text-md"
              to="/docs/installation/windows-install">
              <FontAwesomeIcon size="1x" icon={faWindows} className="mr-2" />
              Package Managers Guide
            </Link>
          </div>
          <div className="flex flex-col align-middle items-center">
            <div className="items-center text-center pt-6">
              <p className="text-lg">
                Using <strong>winget</strong>? Install in one command:
              </p>
              <div className="flex flex-row pt-3">
                <p className="text-xl p-1">
                  <FontAwesomeIcon size="sm" icon={faMicrosoft} className="mx-1 mt-2" />
                </p>
                <div className="dark:bg-charcoal-800/50 bg-zinc-300/50 p-1 text-xl dark:text-purple-200 text-purple-600 flex flex-row">
                  <div className="w-72 truncate">
                    <FontAwesomeIcon size="xs" icon={faTerminal} className="mx-2 mt-3" />
                    winget install -e --id RedHat.Podman-Desktop
                  </div>
                  <div>
                    <button title="Copy To Clipboard" className="mr-2 p-1">
                      {' '}
                      <FontAwesomeIcon
                        size="xs"
                        icon={faPaste}
                        className="ml-3  cursor-pointer text-xl  text-white-500"
                        onClick={() => {
                          copyCliInstructions().catch((err: unknown) => {
                            console.error('unable to copy instructions', err);
                          });
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description="Downloads for Windows">
      <TailWindThemeSelector />
      <section className="container mx-auto flex justify-center flex-col">
        <div className="w-full flex flex-col">
          <h1 className="title-font sm:text-3xl text-2xl lg:text-5xl mb-10 font-medium text-charcoal-300 dark:text-white">
            Windows Downloads
          </h1>
          <main className="h-screen">
            <WindowsDownloads />
          </main>
        </div>
      </section>
    </Layout>
  );
}
