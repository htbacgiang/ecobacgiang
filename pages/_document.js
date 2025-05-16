// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Các meta tag toàn cục chung */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

