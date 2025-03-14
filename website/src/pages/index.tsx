import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faApple, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '@theme/Layout';
import React from 'react';

import CommunityBanner from '../components/CommunityBanner';
import TailWindThemeSelector from '../components/TailWindThemeSelector';
import { TelemetryLink } from '../components/TelemetryLink';

function DownloadClientLinks(): JSX.Element {
  let operatingSystem = '';
  let varIcon = undefined;
  let url = 'macos'; // Just use macos by default as the url before checking the user agent in case of an odd issue (unable to get userAgent / it's blank / etc.)
  const userAgent = navigator.userAgent;

  if (userAgent.indexOf('Windows') !== -1) {
    operatingSystem = 'Windows';
    url = 'windows';
    varIcon = 'faWindows';
  } else if (userAgent.indexOf('Mac') !== -1) {
    operatingSystem = 'macOS';
    // do not need to set url to macos as it is already set
    varIcon = 'faApple';
  } else if (userAgent.indexOf('Linux') !== -1) {
    operatingSystem = 'Linux';
    url = 'linux';
    varIcon = 'faLinux';
  }

  let mainButton;
  let otherButton;

  if (operatingSystem !== '') {
    mainButton = (
      <div>
        <TelemetryLink
          className="no-underline hover:no-underline inline-flex text-white hover:text-white bg-violet-600 border-0 py-4 px-8 mt-6 mb-1 focus:outline-hidden hover:bg-violet-700 rounded-sm text-lg"
          eventPath="landing"
          eventTitle="hero-download"
          to={'/downloads/' + url}>
          <FontAwesomeIcon size="2x" icon={varIcon as IconProp} className="px-2" /> Download Now
        </TelemetryLink>
        <caption className="block mt-0 dark:text-gray-400">
          For <strong>{operatingSystem}</strong> <em>(browser-detected)</em>
        </caption>
      </div>
    );
    otherButton = (
      <div>
        <Link
          className="basis-1/3 py-2 rounded-lg dark:text-gray-400 text-gray-900 dark:bg-zinc-700/25 text-center items-center"
          to="/downloads">
          <FontAwesomeIcon size="4x" icon={faApple} className="my-4" />
          <FontAwesomeIcon size="4x" icon={faLinux} className="my-4" />
          <FontAwesomeIcon size="4x" icon={faWindows} className="my-4" />
        </Link>
      </div>
    );
  } else {
    mainButton = (
      <div>
        <Link
          className="no-underline hover:no-underline inline-flex text-white hover:text-white bg-purple-500 border-0 py-2 px-6 mt-6 mb-1 focus:outline-hidden hover:bg-purple-600 rounded-sm text-lg"
          to="/downloads">
          Download Page
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col">
      {mainButton}
      {otherButton}
    </div>
  );
}

function DownloadGenericLinks(): JSX.Element {
  return (
    <div className="flex justify-center">
      <Link
        className="no-underline hover:no-underline inline-flex text-white hover:text-white bg-purple-500 border-0 py-2 px-6 mt-6 mb-1 focus:outline-hidden hover:bg-purple-600 rounded-sm text-lg"
        to="/downloads">
        Download Page
      </Link>
    </div>
  );
}

function Hero(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 body-font">
      <div className="container mx-auto flex px-5 pb-24 pt-4 items-center justify-center flex-col">
        <div className="text-center lg:w-2/3 w-full bg-hero-pattern bg-no-repeat bg-center">
          <div className="bg-white/30 dark:bg-transparent">
            <h1 className="title-font text-4xl leading-[3rem] lg:text-5xl lg:leading-[4rem] font-bold text-gray-900 dark:text-white mt-[80px]">
              Best Free &amp; Open Source Tool for Containers &amp; Kubernetes
            </h1>
            <p className="text-base font-medium leading-[1.9rem] md:text-lg md:leading-[1.9rem] mt-[88px]">
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
            src="img/features/homepage.png"
          />
        </div>
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

function FAQ(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 dark:bg-charcoal-800 bg-zinc-100 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <SectionTitle name="FAQ" />

          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            FAQ
          </h2>
        </div>

        <div className="flex flex-col w-full text-left">
          <h2 className="max-w-lg mb-6 font-sans text-2xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
            <span className="font-bold">Is Podman Desktop free? </span>
          </h2>
          <div className="flex flex-col items-left">
            <p className="leading-relaxed text-base">
              Yes, Podman Desktop is an open-source project released under the GNU Lesser General Public License (LGPL).
              This means that it is freely available for use, modification, and distribution by anyone, without charge
              or licensing fees. Users can download and use Podman Desktop at no cost, making it accessible to
              individuals and organizations alike.
            </p>
            <div className="flex flex-col w-full text-left">
              <h2 className="max-w-lg mb-6 font-sans text-2xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                <span className="font-bold">Is Podman Desktop suitable for enterprise use? </span>
              </h2>
              <div className="flex flex-col items-left">
                <p className="leading-relaxed text-base">
                  Yes, Podman Desktop is designed to meet the needs of enterprise users, offering several security
                  features:
                </p>
                <ul className="list-disc list-inside space-y-2 dark:text-gray-700">
                  <li>
                    <strong>VPN and Proxy Support</strong>: Supports various VPN configurations and proxy settings,
                    allowing organizations to secure their container environments by controlling network traffic and
                    enforcing access policies.
                  </li>
                  <li>
                    <strong>Image Registry Management</strong>: Provides integration with popular image registries,
                    enabling centralized management of container images and ensuring secure storage and distribution
                    practices.
                  </li>
                  <li>
                    <strong>Air-Gapped Installation</strong>: Supports isolated installations for highly secured
                    environments, allowing organizations to deploy container runtimes without direct internet access
                    while maintaining essential functionality.
                  </li>
                  <li>
                    <strong>Container Isolation</strong>: As a daemonless container engine, Podman Desktop runs
                    containers directly on the host system, reducing potential attack surfaces and improving overall
                    security posture.
                  </li>
                  <li>
                    <strong>Access Controls</strong>: Offers fine-grained control over user permissions and resource
                    allocation, ensuring that sensitive tasks are performed only by authorized users and within
                    designated constraints.
                  </li>
                </ul>
                <p>
                  These features make Podman Desktop an attractive choice for enterprises seeking a container management
                  solution that aligns with their stringent security requirements.
                </p>
                <div className="flex flex-col w-full text-left">
                  <h2 className="max-w-lg mb-6 font-sans text-2xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                    <span className="font-bold">How do I get involved in the project? </span>
                  </h2>
                  <div className="flex flex-col items-left"></div>
                  <p className="leading-relaxed text-base">You can contribute in various ways:</p>
                  <ul className="list-disc list-inside space-y-2 dark:text-gray-700">
                    <li>
                      <strong>Reporting issues</strong>: If you encounter bugs or have suggestions for improvements, you
                      can report them on the{' '}
                      <a href="https://github.com/podman-desktop/podman-desktop/issues">GitHub issue tracker</a>. Be
                      sure to provide detailed information and steps to reproduce the issue.
                    </li>
                    <li>
                      <strong>Working on issues</strong>: You can browse the{' '}
                      <a href="https://github.com/podman-desktop/podman-desktop/issues">issue tracker</a> and contribute
                      by fixing bugs or implementing new features. This involves forking the repository, making changes,
                      and submitting pull requests.
                    </li>
                    <li>
                      <strong>Contributing code</strong>: Beyond addressing existing issues, you can propose and
                      contribute entirely new features or enhancements to Podman Desktop's functionality, user
                      interface, or integrations with other tools. Learn more about{' '}
                      <a href="https://github.com/podman-desktop/podman-desktop/blob/main/CONTRIBUTING.md">
                        how to contribute
                      </a>
                      .
                    </li>
                    <li>
                      <strong>Contributing plug-ins</strong>: Feel like there is an integration missing? You can
                      contribute your own plug-in functionality for Podman Desktop.{' '}
                      <a href="https://podman-desktop.io/blog/extensions-introduction">Check out the guide</a>.
                    </li>
                    <li>
                      <strong>Improving documentation</strong>: Clear and comprehensive documentation is essential. You
                      can contribute by improving existing documentation, adding new guides, or creating tutorials.
                    </li>
                    <li>
                      <strong>Providing website contributions</strong>: The Podman Desktop website{' '}
                      <a href="https://podman-desktop.io/">Podman Desktop website</a> is also open source. You can
                      contribute to its content, design, or translations.
                    </li>
                    <li>
                      <strong>Becoming an Adopter</strong>: If you are a happy user, we’d love to know and share the
                      word. Consider adding yourself or your organization to the{' '}
                      <a href="https://github.com/podman-desktop/podman-desktop/blob/main/ADOPTERS.md">
                        list of adopters
                      </a>{' '}
                      with a pull request.
                    </li>
                  </ul>
                  <p>
                    Before you start contributing, it's helpful to familiarize yourself with the{' '}
                    <a href="https://github.com/podman-desktop/podman-desktop/blob/main/CONTRIBUTING.md">
                      project's contribution guidelines
                    </a>{' '}
                    and code architecture. These resources provide valuable information on coding style, testing
                    procedures, and the overall development process. You can also join #podman-desktop on the Kubernetes
                    Slack to connect with other contributors and get help.
                  </p>
                </div>
                <div className="flex flex-col w-full text-left">
                  <h2 className="max-w-lg mb-6 font-sans text-2xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                    <span className="font-bold">Does Podman Desktop support Compose? </span>
                  </h2>
                  <div className="flex flex-col items-left"></div>
                  <p className="leading-relaxed text-base">
                    Yes, Podman Desktop supports Compose files, allowing users to manage multi-container applications
                    using familiar tools and workflows. By leveraging the `podman compose` command or integrating with
                    existing Docker Compose setups, developers can seamlessly transition between Docker and Podman
                    environments without sacrificing productivity. This compatibility ensures a smooth learning curve
                    for those accustomed to working with Compose while taking advantage of the benefits offered by
                    Podman Desktop. We recommend developers leverage Podman's native support for Kubernetes objects,
                    such as Pods, Deployments, and Services, to ease their transition into the Kubernetes ecosystem
                    while still enjoying the simplicity and benefits of a container management solution like Podman.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feedback(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 dark:bg-charcoal-600 bg-zinc-200 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <SectionTitle name="feedback" />

          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            What People Are Saying ✨
          </h2>
        </div>

        <div className="container px-5 pb-5 mx-auto">
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            <div className="p-4 md:w-1/4 flex">
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  @johnt, John T
                </h2>
                <p className="leading-relaxed text-base">
                  Podman Desktop has completely changed the way I manage containers on my dev machine. No more Docker
                  daemon headaches—just smooth, lightweight container management. Love it! 🚀 #Podman #Containers
                </p>
              </div>
            </div>

            <div className="p-4 md:w-1/4 flex">
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  @mariam, Mariam P
                </h2>
                <p className="leading-relaxed text-base">
                  Switched to #PodmanDesktop for local container development, and wow—so much easier to manage than
                  expected. Seamless UI, great integration, and no root daemon. A game-changer!
                </p>
              </div>
            </div>

            <div className="p-4 md:w-1/4 flex">
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  @Tonyb, Tony B
                </h2>
                <p className="leading-relaxed text-base">
                  Tried #PodmanDesktop and was surprised at how easy it was to transition from Docker. The UI is
                  intuitive, and the ability to run rootless containers is a massive win for security!
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 flex">
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  @saurabh, Saurabh J
                </h2>
                <p className="leading-relaxed text-base">
                  Finally, a container tool that respects system resources! Podman Desktop gives me full control without
                  the bloat. Love how well it integrates with Kubernetes too. 🔥 #K8s #Containers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Manymorefeatures(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 dark:bg-charcoal-800 bg-zinc-100 body-font py-24">
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            And Many More Features ✨
          </h2>
        </div>

        <div className="container px-5 pb-5 mx-auto">
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            <div className="p-4 md:w-1/5 flex">
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Learning Center
                </h2>
                <p className="leading-relaxed text-base">
                  Demystify complex topics and expand knowledge of crucial technologies and components, through
                  tutorials, videos, and documentation resources.
                </p>
              </div>
            </div>

            <div className="p-4 md:w-1/5 flex">
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Extensions
                </h2>
                <p className="leading-relaxed text-base">
                  Podman Desktop extends its capabilities through extensions, allowing developers to tailor the tool to
                  their unique needs and eventually build their own solutions.
                </p>
              </div>
            </div>

            <div className="p-4 md:w-1/6 flex">
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  GPU Acceleration
                </h2>
                <p className="leading-relaxed text-base">
                  To support any of your local AI development workflows, Podman Desktop enables GPU acceleration and
                  optimizes performance when running models with containers locally.
                </p>
              </div>
            </div>

            <div className="p-4 md:w-1/5 flex">
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Multi-arch Support
                </h2>
                <p className="leading-relaxed text-base">
                  Cross-platform multi-architecture support, to build and run containers for multiple hardware
                  platforms, from ARM to x86_64.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/5 flex">
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Enterprise Ready
                </h2>
                <p className="leading-relaxed text-base">
                  Extensive integrations, including VPN and Proxy support for secure networking configurations,
                  streamlined image registry management, and options for air-gapped installations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JoinCommunity(): JSX.Element {
  return (
    <section className="flex rounded-lg mx-auto text-gray-900 dark:text-gray-400 dark:bg-charcoal-600 bg-zinc-200 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-light leading-none tracking-tight text-gray-900 dark:text-white sm:text-3xl md:mx-auto">
            A Community-Driven Project Designed for Developers
          </h2>
          <p className="text-base text-gray-900 md:text-lg dark:text-gray-400">
            Built by a community of developers and shaped by user feedback, Podman Desktop offers a vendor-neutral
            platform that empowers Containers and Kubernetes workflows without lock-in. Trusted as part of the CNCF, it
            delivers flexibility, reliability, and innovation tailored for developers.
          </p>
        </div>
        <div className="flex flex-wrap w-full justify-center">
          <Link
            title="Join community"
            className="p-4 w-11/12 md:w-1/2 lg:w-1/2 no-underline hover:no-underline hover:text-white text-gray-900 dark:text-white"
            to="/community">
            <div className="flex rounded-lg h-full bg-zinc-100  hover:bg-purple-500 dark:hover:bg-purple-700 dark:bg-charcoal-800 bg-opacity-60 p-8 flex-col">
              <div className="grow">
                <div className="grow w-full">
                  <p className="text-base text-center">Interested to join the Tribe?</p>
                </div>
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
          <SectionTitle name="Essential features for containers" />

          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            Simplify Container Management and Boost Developer Productivity
          </h2>
          <p className="text-base font-normal font-bold text-gray-900 md:text-lg dark:text-gray-400">
            Podman Desktop enhances developer productivity by integrating with popular container runtime, registries,
            and developer tools, making it easier to handle containeriozed applications locally. Whether you are
            building, debugging, or deploying, Podman Desktop provides robust features and seamless controls, empowering
            you to work smarter and faster with containers.
          </p>
        </div>
        <div className="container px-5 mx-auto flex flex-wrap">
          <div className="flex flex-col text-left w-full mb-5">
            <Link
              title="Read the Docs"
              className="no-underline hover:no-underline text-gray-900 dark:text-white dark:hover:text-violet-600 "
              to="/docs/containers">
              <div className="mt-3 text-purple-800 dark:text-purple-400 inline-flex items-center">
                Read the Docs
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </div>
            </Link>
          </div>
        </div>
        <div className="container px-5 pb-5 mx-auto">
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            <div className="p-4 md:w-1/2 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-purple-700 mb-4 shrink-0">
                <img className="w-12 h-12 " src="../img/features/graphical.svg"></img>
              </div>
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Intuitive Graphical Interface
                </h2>
                <p className="leading-relaxed text-base list-disc">
                  Podman Desktop provides a simple and user-friendly interface for managing Podman Desktop provides a
                  simple and user-friendly interface for managing manually handling container configurations.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/2 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-purple-700 mb-4 shrink-0">
                <img className="w-12 h-12 " src="../img/features/container.svg"></img>
              </div>
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Containers with Security
                </h2>
                <p className="leading-relaxed text-base list-disc">
                  Podman is a secure container runtime through its focus on daemonless, rootless containers, SELinux
                  support, network policy enforcement, immutable containers. This ensures robust security foundations
                  for running Linux containers and Kubernetes workloads.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/2 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-purple-800 mb-4 shrink-0">
                <img className="w-12 h-12 " src="../img/features/platforms.svg"></img>
              </div>
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Cross-Platform Support
                </h2>
                <p className="leading-relaxed text-base list-disc">
                  Available on Linux®, macOS, and Windows, Podman Desktop lets developers create, manage, and delete
                  containers without the need for complex scripting or manual intervention.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/2 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-purple-800 mb-4 shrink-0">
                <img className="w-12 h-12 " src="../img/features/certified container.svg"></img>
              </div>
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Built with Container Standards
                </h2>
                <p className="leading-relaxed text-base list-disc">
                  Podman supports industry-standard container technologies like OCI and Compose. This compatibility
                  ensures a smooth transition without disrupting existing workflows or requiring extensive retooling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pods(): JSX.Element {
  return (
    <section className="text-gray-900 dark:text-gray-400 dark:bg-charcoal-600 bg-zinc-200 body-font py-24">
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="flex flex-col text-center w-full mb-5">
          <SectionTitle name="Crafted for Kubernetes" />

          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mx-auto">
            Streamline Kubernetes workflows
          </h2>
          <p className="text-base font-normal font-bold text-gray-900 md:text-lg dark:text-gray-400">
            Podman Desktop isn't just a container manager; it's built with Kubernetes at its core. This deep integration
            means seamless workflows for developers. Work with Podman's native Kubernetes support or effortlessly spin
            up local Kind or Minikube clusters, bridge to remote environments, and manage your Kubernetes deployments
            directly through Podman Desktop's intuitive graphical interface. Inspect, configure, and orchestrate your
            pods, services, and deployments with ease, making Kubernetes management both powerful and user-friendly.
          </p>
          <div className="container px-5 mx-auto flex flex-wrap">
            <div className="flex flex-col text-right w-full mb-5">
              <Link
                title="Read the Docs"
                className="no-underline hover:no-underline text-gray-900 dark:text-white dark:hover:text-violet-600 "
                to="/docs/kubernetes">
                <div className="mt-3 text-purple-800 dark:text-purple-400 inline-flex items-center">
                  Read the Docs
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="container px-5 pb-5 mx-auto">
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-purple-700 mb-4 shrink-0">
                <img className="w-12 h-12 " src="../img/features/developtest.svg"></img>
              </div>
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Develop and Test
                </h2>
                <p className="leading-relaxed text-base list-disc">
                  Iterate faster with streamlined workflows enabling developers to develop locally and reducing
                  turnarounds cycles.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-purple-700 mb-4 shrink-0">
                <img className="w-12 h-12 " src="../img/features/grow.svg"></img>
              </div>
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Grow Your Skills at Your Pace
                </h2>
                <p className="leading-relaxed text-base list-disc">
                  Start with containers and seamlessly transition to Kubernetes concepts with Podman capabilities.
                  Podman Desktop makes learning and adopting Kubernetes easy.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-purple-700 mb-4 shrink-0">
                <img className="w-12 h-12 " src="../img/features/troubleshoot1.svg"></img>
              </div>
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Manage your clusters
                </h2>
                <p className="leading-relaxed text-base list-disc">
                  Whether working natively with Kubernetes objects or managing local or remote clusters, Podman Desktop
                  streamlines your workflows with its intuitive graphical interface.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-purple-700 mb-4 shrink-0">
                <img className="w-12 h-12 " src="../img/features/troubleshoot2.svg"></img>
              </div>
              <div className="grow pl-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white sm:text-2xl md:mx-auto">
                  Troubleshoot with Ease
                </h2>
                <p className="leading-relaxed text-base list-disc">
                  Directly access logs, metrics and debug tools with Podman Desktop intuitive graphical interface to
                  resolve issues efficiently.
                </p>
              </div>
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
      <JoinCommunity />
      <MainFeatures />
      <Pods />
      <Manymorefeatures />
      <Feedback />
      <FAQ />
    </Layout>
  );
}
