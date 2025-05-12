import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { faApple, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import {
  faCertificate,
  faCloudArrowDown,
  faCogs,
  faDiagramProject,
  faGaugeHigh,
  faGears,
  faRocket,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';
import React from 'react';

import { CNCFCommunityBanner } from '../components/CNCFCommunityBanner';
import CommunityBanner from '../components/CommunityBanner';
import { DownloadClientLinks, DownloadGenericLinks } from '../components/DownloadButton';
import { ReadTheDocsButton } from '../components/ReadTheDocsButton';
import TailWindThemeSelector from '../components/TailWindThemeSelector';

function Hero(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 body-font">
      <div className="container mx-auto flex px-5 pb-24 pt-4 items-center justify-center flex-col">
        <div className="text-center lg:w-3/4 w-full bg-hero-pattern bg-no-repeat bg-center">
          <div className="bg-white/30 dark:bg-transparent">
            <h1 className="title-font text-4xl leading-[3rem] lg:text-5xl lg:leading-[4rem] font-extrabold text-gray-900 dark:text-white mt-[80px] lg:w-3/4 mx-auto">
              Best Free &amp; Open Source Tool for Containers &amp; Kubernetes
            </h1>
            <p className="text-base font-bold leading-[1.9rem] md:text-lg md:leading-[1.9rem] mt-[88px]">
              The best free and open source tool for developers to work with containers and Kubernetes. Simplify
              container management, streamline Kubernetes workflows, and transition from local development to production
              with ease.
            </p>
            <div className="flex-none">
              {/* With client mode, provides the link to the client browser */}
              <BrowserOnly fallback={<DownloadGenericLinks></DownloadGenericLinks>}>
                {() => {
                  return <DownloadClientLinks />;
                }}
              </BrowserOnly>
            </div>
          </div>
        </div>
        <div className="sm:pl-8 md:pl-12 lg:pl-36 text-center w-full">
          <img
            className="sm:w-full md:w-full lg:w-10/12"
            alt="Podman Desktop home page"
            src="img/features/homepage.webp"
          />
        </div>
        <CNCFCommunityBanner />
      </div>
    </section>
  );
}

function SectionTitle(props: Readonly<{ name: string }>): JSX.Element {
  return (
    <div>
      <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-purple-800 uppercase rounded-full dark:bg-purple-400 bg-purple-400">
        {props.name}
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionLabel(props: Readonly<{ name: string }>): JSX.Element {
  return (
    <div className="text-right p-[2px] rounded-full border-gradient bg-gradient-to-r from-sky-500 to-purple-500 w-fit mb-5">
      <p className="inline-block bg-white dark:bg-charcoal-400 text-gray-900 dark:text-white px-3 py-1 rounded-full transition-colors duration-200 mb-0 text-sm">
        {props.name}
      </p>
    </div>
  );
}

function KeepUpToDate(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 dark:bg-charcoal-800 bg-zinc-100 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <SectionTitle name="update" />

          <h2 className="max-w-lg mb-6 font-sans text-3xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            Install and keep up to date <span className="font-bold">Podman</span>
          </h2>
        </div>

        <div className="flex flex-col w-full text-center">
          <div className="mx-10">
            <FontAwesomeIcon size="3x" icon={faRotateRight} className="ml-2 mb-4 text-gray-900 dark:text-gray-300" />
          </div>
          <div className="flex flex-col items-center">
            <p className="leading-relaxed text-base">
              Install Podman and other dependencies directly from Podman Desktop if not yet installed.
            </p>
            <p className="leading-relaxed text-base">Check for updates and get notified about new changes.</p>
            <p className="leading-relaxed text-base">
              Available on{' '}
              <a href="/downloads/windows" className="text-purple-600 dark:text-purple-400" target="_blank">
                Windows
              </a>{' '}
              and{' '}
              <a href="/downloads/macos" className="text-purple-600 dark:text-purple-400" target="_blank">
                macOS
              </a>
              !
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Extensibility(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 dark:bg-charcoal-600 bg-zinc-200 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <SectionTitle name="extensibility" />

          <h2 className="max-w-lg mb-6 font-sans text-3xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            Bring new features to Podman Desktop with extensions
          </h2>
        </div>

        <div className="flex flex-col w-full text-center">
          <div className="flex flex-col items-center">
            <p className="text-base lg:w-2/3 text-center mx-auto">
              Podman Desktop is built around extension points. You can easily create a new extension using our pre-made
              templates, easy-to-use API and UI components. Integrate your own tools into Podman Desktop with ease to
              enrich with your own developer tools and experiences.
            </p>
            <ul className="list-disc list-inside text-center">
              <li>
                Explore our{' '}
                <Link title="catalog of extensions" to="/extensions">
                  catalog of extensions
                </Link>
                .
              </li>
              <li>
                Learn to{' '}
                <Link title="develop your own extensions" to="/docs/extensions/developing">
                  develop your own extensions
                </Link>
                .
              </li>
              <li>
                Want to use a Docker Desktop extension? Extensions such as{' '}
                <Link title="trivy" to="https://github.com/aquasecurity/trivy-docker-extension">
                  Trivy
                </Link>{' '}
                work out of the box with Podman Desktop.
              </li>
            </ul>
          </div>

          <ThemedImage
            className="sm:w-full md:w-full lg:w-10/12 sm:pl-8 md:pl-12 lg:pl-24 text-center"
            alt="Reuse Docker Desktop extensions"
            sources={{
              light: useBaseUrl('img/ddextensions/dd-support.png'),
              dark: useBaseUrl('img/ddextensions/dd-support.png'),
            }}
          />

          <div className="flex flex-col items-center">
            <Link
              title="Extend Podman Desktop"
              className="no-underline hover:no-underline text-gray-900 dark:text-white dark:hover:text-violet-600 "
              to="/extend">
              <div className="mt-3 text-purple-800 dark:text-purple-400 inline-flex items-center">
                Learn More
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Configure(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 dark:bg-charcoal-800 bg-zinc-100 body-font py-24">
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <SectionTitle name="Configure" />

          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            Multiple configuration options
          </h2>
        </div>

        <div className="container px-5 pb-5 mx-auto">
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-700 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faCogs} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-lg title-font font-medium mb-2">Registries</h2>
                <p className="leading-relaxed text-base">
                  <a href="/docs/containers/registries">Manage OCI registries. Add/edit/delete registries.</a>
                </p>
              </div>
            </div>

            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-700 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faCogs} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-lg title-font font-medium mb-2">Proxy</h2>
                <p className="leading-relaxed text-base">
                  <a href="/docs/proxy">Configure your proxy settings.</a>
                </p>
              </div>
            </div>

            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-700 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faCogs} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-lg title-font font-medium mb-2">
                  Resources Utilization
                </h2>
                <p className="leading-relaxed text-base">Configure CPU/Memory/Disk of Podman machines.</p>
              </div>
            </div>

            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-700 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faCogs} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-lg title-font font-medium mb-2">
                  Container Engines
                </h2>
                <p className="leading-relaxed text-base">
                  <a href="/docs/onboarding/containers">
                    Handle multiple container engines at the same time: Podman, Docker.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EnterpriseReady(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 dark:bg-charcoal-600 bg-zinc-200 body-font py-24">
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <SectionTitle name="enterprise" />

          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            Enterprise ready
          </h2>
        </div>
        <div className="container px-5 pb-5 mx-auto">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900 dark:text-gray-100 mb-20">
            Match configuration options.
          </h1>
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            <div className="p-4 md:w-1/3 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-700 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faCertificate} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-lg title-font font-medium mb-2">Code signing</h2>

                <p className="leading-relaxed text-base">
                  <a href="/downloads">Signed binaries for both macOS and Windows</a>
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/3 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-800 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faCloudArrowDown} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100  text-lg title-font font-medium mb-2">Proxy</h2>
                <p className="leading-relaxed text-base">
                  <a href="/docs/proxy">Configure proxy within the tool. Avoid any painful files to edit.</a>
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/3 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-800 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faCogs} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-lg title-font font-medium mb-2">Registries</h2>
                <p className="leading-relaxed text-base">
                  <a href="/docs/proxy">Manage OCI registries. Add/edit/delete registries.</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RunAnywhere(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 dark:bg-charcoal-600 bg-zinc-200 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            Available on Windows, Mac and Linux
          </h2>
          <p className="text-base text-gray-900 md:text-lg dark:text-gray-400">
            Use the same UI across different operating systems
          </p>
        </div>
        <div className="flex flex-wrap w-full justify-center">
          <Link
            title="Download for Windows"
            className="p-4 w-11/12 md:w-1/2 lg:w-1/3 no-underline hover:no-underline hover:text-white text-gray-900 dark:text-white"
            to="/downloads/windows">
            <div className="flex rounded-lg h-full bg-zinc-100  hover:bg-purple-500 dark:hover:bg-purple-700 dark:bg-charcoal-800 bg-opacity-60 p-8 flex-col">
              <div className="flex items-center mb-3 flex-col">
                <FontAwesomeIcon size="4x" icon={faWindows} />
                <div className="inline-flex items-center justify-center rounded-full text-gray-900 dark:text-gray-400 shrink-0"></div>
                <h2 className=" text-lg title-font font-medium"> Windows</h2>
              </div>

              <div className="grow">
                <div className="grow w-full">
                  <p className="text-base text-center">exe or setup.exe</p>
                </div>
              </div>
            </div>
          </Link>
          <Link
            title="Download for macOS"
            className="no-underline hover:no-underline hover:text-white text-gray-900 dark:text-white p-4 w-11/12 md:w-1/2 lg:w-1/3"
            to="/downloads/macos">
            <div className="flex rounded-lg h-full bg-zinc-100  hover:bg-purple-500 dark:hover:bg-purple-700 dark:bg-charcoal-800 bg-opacity-60 p-8 flex-col">
              <div className="flex items-center mb-3 flex-col">
                <FontAwesomeIcon size="4x" icon={faApple} />
                <div className="inline-flex items-center justify-center rounded-full text-gray-900 dark:text-gray-400 shrink-0"></div>
                <h2 className=" text-lg title-font font-medium"> macOS</h2>
              </div>
              <div className="grow w-full">
                <p className="text-base text-center">arm64, x64 or unified dmg</p>
              </div>
            </div>
          </Link>
          <Link
            title="Download for Linux"
            className="no-underline hover:no-underline hover:text-white text-gray-900 dark:text-white p-4 w-11/12 md:w-1/2 lg:w-1/3"
            to="/downloads/linux">
            <div className="flex rounded-lg h-full bg-zinc-100  hover:bg-purple-500 dark:hover:bg-purple-700 dark:bg-charcoal-800 bg-opacity-60 p-8 flex-col">
              <div className="flex items-center mb-3 flex-col">
                <FontAwesomeIcon size="4x" icon={faLinux} />
                <div className="inline-flex items-center justify-center rounded-full text-gray-900 dark:text-gray-400 shrink-0"></div>
                <h2 className=" text-lg title-font font-medium"> Linux</h2>
              </div>
              <div className="grow">
                <p className="text-base text-center">Flatpak or AMD64 binary (tar.gz)</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function MainFeatures(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 dark:bg-charcoal-800 bg-zinc-100 body-font py-24">
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <SectionTitle name="features" />

          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            Build, run and manage containers
          </h2>
        </div>
        <div className="container px-5 pb-5 mx-auto">
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-700 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faGears} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-lg title-font font-medium mb-2">Build</h2>
                <p className="leading-relaxed text-base list-disc">
                  <a href="/docs/containers/images/building-an-image">
                    <FontAwesomeIcon icon={faGaugeHigh} className="text-purple-700 w-3 h-3 mt-1 mr-2" />
                    Build images from Containerfile or Dockerfile
                  </a>
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-700 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faRocket} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-lg title-font font-medium mb-2">Run</h2>

                <p className="leading-relaxed text-base list-disc">
                  <a href="/docs/containers/images/pulling-an-image">
                    <FontAwesomeIcon icon={faDiagramProject} className="text-purple-700 w-3 h-3 mt-1 mr-2" />
                    Pull images from remote registries
                  </a>
                </p>
                <p className="leading-relaxed text-base list-disc">
                  <a href="/docs/containers/starting-a-container">
                    <FontAwesomeIcon icon={faGaugeHigh} className="text-purple-700 w-3 h-3 mt-1 mr-2" />
                    Start / Stop / Restart containers
                  </a>
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-800 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faGaugeHigh} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-lg title-font font-medium mb-2">Inspect</h2>
                <p className="leading-relaxed text-base list-disc">
                  <FontAwesomeIcon icon={faRocket} className="text-purple-700 w-3 h-3 mt-1 mr-2" />
                  Get a terminal in your container
                </p>
                <p className="leading-relaxed text-base list-disc">
                  <FontAwesomeIcon icon={faRocket} className="text-purple-700 w-3 h-3 mt-1 mr-2" />
                  Inspect logs
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-700 text-purple-800 mb-4 shrink-0">
                <FontAwesomeIcon size="2x" icon={faDiagramProject} className="w-6 h-6 " />
              </div>
              <div className="grow pl-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-lg title-font font-medium mb-2">Push</h2>
                <p className="leading-relaxed text-base list-disc">
                  <a href="/docs/containers/images/pushing-an-image-to-a-registry">
                    <FontAwesomeIcon icon={faRocket} className="text-purple-700 w-3 h-3 mt-1 mr-2" />
                    Push images to OCI registries
                  </a>
                </p>
                <p className="leading-relaxed text-base list-disc">
                  <FontAwesomeIcon icon={faRocket} className="text-purple-700 w-3 h-3 mt-1 mr-2" />
                  Deploy & Test images on Kubernetes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <Link
            title="Discover More"
            className="no-underline hover:no-underline text-gray-900 dark:text-white dark:hover:text-violet-600 "
            to="/features">
            <div className="mt-3 text-purple-800 dark:text-purple-400 inline-flex items-center">
              Discover More
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Pods(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 bg-gradient-to-tr dark:from-black dark:to-purple-700 from-purple-300 to-gray-200 body-font py-24">
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="flex flex-col text-right w-full mb-5">
          <div className="flex md:flex-row flex-col-reverse items-center space-x-10 xl:space-x-44">
            <ThemedImage
              className="py-4 w-full md:w-1/2 mb-10 md:mb-0"
              alt="Streamline Kubernetes workflows"
              sources={{
                light: useBaseUrl('img/features/kubernetes.png'),
                dark: useBaseUrl('img/features/kubernetes.png'),
              }}
            />
            <div className="lg:grow md:w-1/2 flex flex-col md:items-end md:text-right items-center text-center">
              <SectionLabel name="Crafted for Kubernetes" />
              <h1 className="title-font text-3xl leading-[3rem] lg:text-4xl lg:leading-[4rem] font-extrabold text-gray-900 dark:text-white">
                Streamline Kubernetes workflows
              </h1>
              <p className="leading-relaxed py-5 dark:text-gray-300 text-gray-900">
                Podman Desktop isn't just a container manager; it's built with Kubernetes at its core. This deep
                integration means seamless workflows for developers. Work with Podman's native Kubernetes support or
                effortlessly spin up local Kind or Minikube clusters, bridge to remote environments, and manage your
                Kubernetes deployments directly through Podman Desktop's intuitive graphical interface. Inspect,
                configure, and orchestrate your pods, services, and deployments with ease, making Kubernetes management
                both powerful and user-friendly.
              </p>
              <ReadTheDocsButton />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 space-x-4 pt-16">
            <div className="flex flex-col md:items-start md:text-left items-center text-center">
              <ThemedImage
                className="py-4 w-1/4"
                alt="Develop and Test"
                sources={{
                  light: useBaseUrl('img/developtest.svg'),
                  dark: useBaseUrl('img/developtest.svg'),
                }}
              />
              <h2 className="title-font sm:text-3xl text-2xl py-3 font-bold text-gray-900 dark:text-white mb-0">
                Develop and Test
              </h2>
              <p className="leading-relaxed py-3 dark:text-gray-300 text-gray-900">
                Iterate faster with streamlined workflows enabling developers to develop locally and reducing
                turnarounds cycles.
              </p>
            </div>
            <div className="flex flex-col md:items-start md:text-left items-center text-center">
              <ThemedImage
                className="py-4 w-1/4"
                alt="Grow Your Skills at Your Pace"
                sources={{
                  light: useBaseUrl('img/grow.svg'),
                  dark: useBaseUrl('img/grow.svg'),
                }}
              />
              <h2 className="title-font sm:text-3xl text-2xl py-3 font-bold text-gray-900 dark:text-white mb-0">
                Grow Skills at Your Pace
              </h2>
              <p className="leading-relaxed py-3 dark:text-gray-300 text-gray-900">
                Start with containers and seamlessly transition to Kubernetes concepts with Podman capabilities. Podman
                Desktop makes learning and adoption Kubernetes easy.
              </p>
            </div>
            <div className="flex flex-col md:items-start md:text-left items-center text-center">
              <ThemedImage
                className="py-4 w-1/4"
                alt="Troubleshoot with Ease"
                sources={{
                  light: useBaseUrl('img/troubleshoot1.svg'),
                  dark: useBaseUrl('img/troubleshoot1.svg'),
                }}
              />
              <h2 className="title-font sm:text-3xl text-2xl py-3 font-bold text-gray-900 dark:text-white mb-0">
                Troubleshoot with Ease
              </h2>
              <p className="leading-relaxed py-3 dark:text-gray-300 text-gray-900">
                Whether working natively with Kubernetes objects or managing local or remote clusters, Podman Desktop
                streamlines your workflows with its intuitive graphical interface.
              </p>
            </div>
            <div className="flex flex-col md:items-start md:text-left items-center text-center">
              <ThemedImage
                className="py-4 w-1/4"
                alt="Troubleshoot with Ease"
                sources={{
                  light: useBaseUrl('img/troubleshoot2.svg'),
                  dark: useBaseUrl('img/troubleshoot2.svg'),
                }}
              />
              <h2 className="title-font sm:text-3xl text-2xl py-3 font-bold text-gray-900 dark:text-white mb-0">
                Troubleshoot with Ease
              </h2>
              <p className="leading-relaxed py-3 dark:text-gray-300 text-gray-900">
                Directly access logs, metrics and debug tools with Podman Desktop intuitive graphical interface to
                resolve issues efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Podman Desktop - Containers and Kubernetes"
      description="Podman Desktop - An open source graphical tool for developing on containers and Kubernetes">
      <TailWindThemeSelector />
      <CommunityBanner />
      <Hero />
      <RunAnywhere />
      <MainFeatures />
      <Pods />
      <Configure />
      <Extensibility />
      <KeepUpToDate />
      <EnterpriseReady />
    </Layout>
  );
}
