import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { faBeer, faDownload, faPaste, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TailWindThemeSelector from '@site/src/components/TailWindThemeSelector';
import { TelemetryLink } from '@site/src/components/TelemetryLink';
import type { GitHubMetadata } from '@site/src/plugins/github-metadata-plugin'; // Adjust path if needed
import Layout from '@theme/Layout';
import React from 'react';

export function MacOSDownloads(): JSX.Element {
  const { macosDownloads } = usePluginData('docusaurus-plugin-github-metedata') as GitHubMetadata;

  const copyBrewInstructions = async (): Promise<void> => {
    await navigator.clipboard.writeText('brew install podman-desktop');
  };

  return (
    <div className="basis-1/3 py-2 rounded-lg dark:text-gray-400 text-charcoal-300 bg-zinc-300/25 dark:bg-zinc-700/25 bg-blend-multiply text-center items-center">
      <FontAwesomeIcon size="4x" icon={faApple} className="my-4" />
      <h2 className="w-full text-center text-4xl title-font font-medium pb-3 border-purple-500 border-b-2">macOS</h2>
      <div className="flex p-1 flex-col md:flex-col items-center align-top">
        <div className="flex flex-col align-middle items-center">
          <h3 className="mt-0">Podman Desktop for macOS</h3>
          <div className="pt-8">
            <TelemetryLink
              className="mt-auto no-underline hover:no-underline inline-flex text-white hover:text-white bg-purple-500 border-0 py-2 px-6 focus:outline-hidden hover:bg-purple-500 rounded-sm text-md font-semibold"
              eventPath="download"
              eventTitle="download-mac"
              to={macosDownloads.universal}>
              <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
              Download Now
            </TelemetryLink>
            <caption className="block w-full mt-1 text/50 dark:text-white/50">
              Universal *.dmg, version v{macosDownloads.version}
            </caption>
          </div>
          <div className="mt-4">
            <div>Other macOS downloads:</div>
            <TelemetryLink
              className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-6 font-semibold text-md"
              eventPath="download"
              eventTitle="download-mac"
              to={macosDownloads.x64}>
              <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
              Intel
            </TelemetryLink>
            <TelemetryLink
              className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-6 text-md font-semibold"
              eventPath="download"
              eventTitle="download-mac"
              to={macosDownloads.arm64}>
              <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
              Apple silicon
            </TelemetryLink>
          </div>
          <div className="pt-2 pb-4 flex flex-col">
            <div className="">Installer for restricted environments:</div>
            <div className="flex flex-row justify-center">
              <TelemetryLink
                className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-6 font-semibold text-md"
                eventPath="download"
                eventTitle="download-mac"
                to={macosDownloads.airgapsetupX64}>
                <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
                Intel
              </TelemetryLink>
              <TelemetryLink
                className="underline inline-flex dark:text-white text-purple-500 hover:text-purple-200 py-2 px-6 font-semibold text-md"
                eventPath="download"
                eventTitle="download-mac"
                to={macosDownloads.airgapsetupArm64}>
                <FontAwesomeIcon size="1x" icon={faDownload} className="mr-2" />
                Apple silicon
              </TelemetryLink>
            </div>
          </div>

          <div className="flex flex-col align-middle items-center">
            <div className="items-center text-center pt-6">
              <p className="text-lg">
                Using <strong>Brew</strong>? Install in one command:
              </p>
              <div className="flex flex-row pt-3">
                <p className="text-xl p-1">
                  <FontAwesomeIcon size="sm" icon={faBeer} className="mx-1 mt-2" />
                </p>
                <div className="dark:bg-charcoal-800/50 bg-zinc-300/50 p-1 truncate">
                  <p className="text-xl dark:text-purple-200 text-purple-600">
                    <FontAwesomeIcon size="xs" icon={faTerminal} className="mx-2 mt-3" />
                    brew install podman-desktop
                    <button title="Copy To Clipboard" className="mr-2 p-1">
                      {' '}
                      <FontAwesomeIcon
                        size="xs"
                        icon={faPaste}
                        className="ml-3  cursor-pointer text-xl  text-white-500"
                        onClick={() => {
                          copyBrewInstructions().catch((err: unknown) => {
                            console.error('unable to copy instructions', err);
                          });
                        }}
                      />
                    </button>
                  </p>
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
    <Layout title={siteConfig.title} description="Downloads for macOS">
      <TailWindThemeSelector />
      <section className="container mx-auto flex justify-center flex-col">
        <div className="w-full flex flex-col">
          <h1 className="title-font sm:text-3xl text-2xl lg:text-5xl mb-10 font-medium text-charcoal-300 dark:text-white">
            macOS Downloads
          </h1>
          <main className="h-screen">
            <MacOSDownloads />
          </main>
        </div>
      </section>
    </Layout>
  );
}
