import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import React from 'react';

export default function ThreeMillion(): JSX.Element {
  return (
    <>
      <Head>
        <title>3,000,000 &times; Podman Desktop</title>
        <meta
          name="description"
          content="Celebrate 3,000,000 downloads of Podman Desktop! Thank you to everyone who provides feedback and helps us improve."
        />

        <meta property="og:image" content="https://podman-desktop.io/img/3million-celebration.jpg" />
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
        <meta name="twitter:image" content="https://podman-desktop.io/img/3million-celebration.jpg" />
      </Head>

      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
      `}</style>

      <Layout
        title="3,000,000"
        description="Celebrate 3,000,000 downloads of Podman Desktop! Thank you to everyone who provides feedback and helps us improve."
        wrapperClassName="three-million-page"
        noFooter={true}
        image="img/3million-celebration.png">
        <div
          style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
          }}>
          <iframe
            src="https://my.spline.design/particles-enV3SNBPzPLQSpMKANed913N/"
            frameborder="0"
            width="100%"
            height="100%"></iframe>
        </div>
      </Layout>
    </>
  );
}
