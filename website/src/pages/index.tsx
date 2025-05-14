import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { faApple, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import { faCertificate, faCloudArrowDown, faCogs, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';
import React from 'react';

import { CNCFCommunityBanner } from '../components/CNCFCommunityBanner';
import CommunityBanner from '../components/CommunityBanner';
import { DownloadClientLinks, DownloadGenericLinks } from '../components/DownloadButton';
import { ReadTheDocsButton } from '../components/ReadTheDocsButton';
import TailWindThemeSelector from '../components/TailWindThemeSelector';
import { TestimonialCard } from '../components/TestimonialCard';

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

function Testimonials(): JSX.Element {
  return (
    <section className="relative text-gray-900 dark:text-white body-font py-24 dark:bg-fuschia-900 bg-purple-200">
      <div className="absolute bg-white/50 dark:bg-black/70 top-0 bottom-0 right-0 left-0 z-0"></div>
      <div className="container mx-auto flex flex-col">
        <h2 className="text-4xl/[1.5] font-bold mb-6 text-gray-900 dark:text-white pb-11 z-10">
          What People Are Saying ✨
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
          <TestimonialCard
            username="Ayush Pande"
            source="XDA Developers"
            userImage="https://static1.xdaimages.com/wordpress%2Fwp-content%2Fauthors%2F66963136cc077-ayush-pande.jpg?q=50&fit=crop&w=360&h=360&dpr=1.5"
            date="April 20 2025"
            text="Unlike its rival, Podman Desktop not only supports multiple container runtimes (including Docker Desktop), but also includes a ton of extensions to boost your workstation's capabilities."
          />
          <TestimonialCard
            username="DonSchenck"
            userImage="https://pbs.twimg.com/profile_images/1774956557161115648/Y_GLSoGT_400x400.jpg"
            source="X"
            date="April 25 2025"
            text="Dude ... podman. And Podman Desktop. Seriously. Open Source and doesn't run as root."
          />
          <TestimonialCard
            username="anonymous"
            source="GitHub discussions"
            date="April 5 2024"
            text="I have spent a lot of hours trying out various projects in the past few months for my homelab to test some custom workloads.... OpenStack (Devstack), k3s, rancher, portainer, minikube, docker desktop, etc. and I have found what I needed with your Podman Desktop."
          />
          <TestimonialCard
            username="José Bayoán Santiago Calderón"
            userImage="https://media.licdn.com/dms/image/v2/D5635AQG6ohtsrwtWFA/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1737612334868?e=1747674000&v=beta&t=EruTwnMCgArUXZfCBwBZzWQJUbbQMaUB-whOPJag6QU"
            source="LinkedIn"
            text="I'm pleasantly surprised by how well Podman Desktop integrates with the Visual Studio Code Dev Containers extension. #dev #opensource #containers"
          />
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
    <section className="text-gray-900 dark:text-gray-400 bg-gradient-to-bl dark:from-black dark:to-purple-700 from-purple-300 to-gray-200 body-font py-24">
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="flex flex-col text-left w-full mb-5">
          <div className="flex md:flex-row flex-col items-center space-x-10 xl:space-x-44">
            <div className="lg:grow md:w-1/2 flex flex-col md:items-start md:text-left items-center text-center">
              <SectionLabel name="Essential Features for Containers" />
              <h1 className="title-font text-3xl leading-[3rem] lg:text-4xl lg:leading-[4rem] font-extrabold text-gray-900 dark:text-white">
                Simplify Container Management and Boost Developer Productivity
              </h1>
              <p className="leading-relaxed py-5 dark:text-gray-300 text-gray-900">
                Podman Desktop enhances developer productivity by integrating with popular container runtimes,
                registries, and developer tools, making it easier to handle containerized applications locally. Whether
                you're building, debugging, or deploying, Podman Desktop provides robust features and seamless controls,
                empowering you to work smarter and faster with containers.
              </p>
              <ReadTheDocsButton to="/docs/containers" />
            </div>
            <ThemedImage
              className="py-4 w-full md:w-1/2 mb-10 md:mb-0"
              alt="Essential Features for Containers"
              sources={{
                light: useBaseUrl('img/features/containers.png'),
                dark: useBaseUrl('img/features/containers.png'),
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 space-x-10 xl:space-x-44 pt-16">
            <div className="flex flex-col md:items-start md:text-left items-center text-center">
              <ThemedImage
                className="py-4 w-1/8"
                alt="Intuitive Graphical Interface"
                sources={{
                  light: useBaseUrl('img/graphical.svg'),
                  dark: useBaseUrl('img/graphical.svg'),
                }}
              />
              <h2 className="title-font sm:text-3xl text-2xl py-3 font-medium text-gray-900 dark:text-white font-bold">
                Intuitive Graphical Interface
              </h2>
              <p className="leading-relaxed py-3 dark:text-gray-300 text-gray-900">
                Podman Desktop provides a simple and user-friendly interface for managing containers, making it easier
                for developers to focus on writing code rather than manually handling container configurations.
              </p>
            </div>

            <div className="flex flex-col md:items-start md:text-left items-center text-center">
              <ThemedImage
                className="py-4 w-1/8"
                alt="Container with Security"
                sources={{
                  light: useBaseUrl('img/secured_container.svg'),
                  dark: useBaseUrl('img/secured_container.svg'),
                }}
              />
              <h2 className="title-font sm:text-3xl text2xl py-3 font-medium text-gray-900 dark:text-white font-bold">
                Containers with Security
              </h2>
              <p className="leading-relaxed py-3 dark:text-gray-300 text-gray-900">
                Podman is a secure container runtime through its focus on daemonless, rootless containers, SELinux
                support, network policy enforcement, immutable containers. This ensures robust security foundations for
                running Linux containers and Kubernetes workloads.
              </p>
            </div>

            <div className="flex flex-col md:items-start md:text-left items-center text-center">
              <ThemedImage
                className="py-4 w-1/8"
                alt="Cross-Platform Support"
                sources={{
                  light: useBaseUrl('img/platforms.svg'),
                  dark: useBaseUrl('img/platforms.svg'),
                }}
              />
              <h2 className="title-font sm:text-3xl text-2xl py-3 font-medium text-gray-900 dark:text-white font-bold">
                Cross-Platform Support
              </h2>
              <p className="leading-relaxed py-3 dark:text-gray-300 text-gray-900">
                Available on Linux®, macOS, and Windows, Podman Desktop lets developers create, manage, and delete
                containers without the need for complex scripting or manual intervention.
              </p>
            </div>

            <div className="flex flex-col md:items-start md:text-left items-center text-center">
              <ThemedImage
                className="py-4 w-1/8 "
                alt="Built with Container Standards"
                sources={{
                  light: useBaseUrl('img/certified_container.svg'),
                  dark: useBaseUrl('img/certified_container.svg'),
                }}
              />
              <h2 className="title-font sm:text-3xl text-2xl py-3 font-medium text-gray-900 dark:text-white font-bold">
                Built with Container Standards
              </h2>
              <p className="leading-relaxed py-3 dark:text-gray-300 text-gray-900">
                Podman supports industry-standard container technologies like OCI, and Compose. This compatibility
                ensures a smooth transition without disrupting existing workflows or requiring extensive retooling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdditionalFeatures(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-white bg-white dark:bg-black bg-gradient-to-b from-purple-300 to-transparent dark:from-transparent dark:to-purple-700/40  py-24 body-font md:w-full">
      <div className="container mx-auto flex flex-col flex-wrap">
        <h2 className="text-4xl/[1.5] font-bold mb-6 text-gray-900 dark:text-white pb-11 ">
          And Many More Features ✨
        </h2>
        <div className="flex flex-row flex-wrap items-stretch justify-center gap-7">
          <div className="flex flex-col grow w-11/12 md:w-1/3 lg:w-1/6 items-start justify-start gap-1 bg-purple-100 dark:bg-purple-800 dark:grayscale-75 rounded-lg p-6">
            <p className="text-lg font-semibold leading-[1.5]">Learning center</p>
            <p className="text-xs leading-[1.5]">
              Demystify complex topics and expand knowledge of crucial technologies and components, through tutorials,
              videos and documentation resources.
            </p>
          </div>
          <div className="flex flex-col grow w-11/12 md:w-1/3 lg:w-1/6 items-start justify-start gap-1 bg-purple-100 dark:bg-purple-800 dark:grayscale-75 rounded-lg p-6">
            <p className="text-lg font-semibold leading-[1.5]">Extensions</p>
            <p className="text-xs leading-[1.5]">
              Podman Desktop extends its capabilities through extensions, allowing developers to tailor the tool to
              their unique needs and eventually build their own solutions.
            </p>
          </div>
          <div className="flex flex-col grow w-11/12 md:w-1/3 lg:w-1/6 items-start justify-start gap-1 bg-purple-100 dark:bg-purple-800 dark:grayscale-75 rounded-lg p-6">
            <p className="text-lg font-semibold leading-[1.5]">GPU Acceleration</p>
            <p className="text-xs leading-[1.5]">
              To support any of your local AI development workflows, Podman Desktop enables GPU acceleration and
              optimizes performance when running models with containers locally.
            </p>
          </div>
          <div className="flex flex-col grow w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/6 items-start justify-start gap-1 bg-purple-100 dark:bg-purple-800 dark:grayscale-75 rounded-lg p-6">
            <p className="text-lg font-semibold leading-[1.5]">Multi-arch Support</p>
            <p className="text-xs leading-[1.5]">
              Cross-platform multi-architecture support, to build and run containers for multiple hardware platforms,
              from ARM to x86_64.
            </p>
          </div>
          <div className="flex flex-col grow w-11/12 md:w-1/3 lg:w-1/6 items-start justify-start gap-1 bg-purple-100 dark:bg-purple-800 dark:grayscale-75 rounded-lg p-6">
            <p className="text-lg font-semibold leading-[1.5]">Enterprise Ready</p>
            <p className="text-xs leading-[1.5]">
              Extensive integrations, including VPN and Proxy support for secure networking configurations, streamlined
              image registry management, and options for air-gapped installations.
            </p>
          </div>
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
              <ReadTheDocsButton to="docs/kubernetes" />
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
      <AdditionalFeatures />
      <Testimonials />
      <Configure />
      <Extensibility />
      <KeepUpToDate />
      <EnterpriseReady />
    </Layout>
  );
}
