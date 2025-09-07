import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import React from 'react';

declare module 'react' {
  interface IntrinsicElements {
    'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      url?: string;
    };
  }
}

export default function ThreeMillion(): JSX.Element {
  const celebrationImageUrl = useBaseUrl('/img/3million-celebration.jpg');
  const splineSceneUrl = useBaseUrl('/spline/scene.splinecode');

  return (
    <>
      <Head>
        <title>3,000,000 &times; Podman Desktop</title>
        <meta
          name="description"
          content="Celebrate 3,000,000 downloads of Podman Desktop! Thank you to everyone who provides feedback and helps us improve."
        />

        <meta property="og:image" content={`https://podman-desktop.io${celebrationImageUrl}`} />
        <meta property="og:image:alt" content="Podman Desktop celebrates 3,000,000 downloads" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content="3,000,000 &times; Podman Desktop" />
        <meta
          property="og:description"
          content="Celebrate 3,000,000 downloads of Podman Desktop! Thank you to everyone who provides feedback and helps us improve."
        />
        <meta property="og:url" content="https://podman-desktop.io/3million" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Podman Desktop" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="3,000,000 &times; Podman Desktop" />
        <meta
          name="twitter:description"
          content="Celebrate 3,000,000 downloads of Podman Desktop! Thank you to everyone who provides feedback and helps us improve."
        />
        <meta name="twitter:image" content={`https://podman-desktop.io${celebrationImageUrl}`} />
        <meta name="twitter:image:alt" content="Podman Desktop celebrates 3,000,000 downloads" />

        <link rel="canonical" href="https://podman-desktop.io/3million" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="" />

        <script
          type="module"
          crossOrigin="anonymous"
          integrity="<fill-with-SHA384>"
          src="https://unpkg.com/@splinetool/viewer@1.10.56/build/spline-viewer.js"
        />
      </Head>

      <Layout
        title="3,000,000"
        description="Celebrate 3,000,000 downloads of Podman Desktop! Thank you to everyone who provides feedback and helps us improve."
        wrapperClassName="three-million-page"
        noFooter={true}
        image="img/3million-celebration.jpg">
        <div
          style={{
            width: '100vw',
            height: '100dvh',
            minHeight: '100vh',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 'var(--ifm-z-index-overlay, 9999)',
          }}>
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => {
              return <spline-viewer url={splineSceneUrl} />;
            }}
          </BrowserOnly>
        </div>
      </Layout>
    </>
  );
}
