"use strict";
import Script from "next/script";

const GoogleAnalytics = () => {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-L0CHT26L87"></script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-L0CHT26L87');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
