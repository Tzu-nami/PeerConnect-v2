import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Marcellus&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
                rel="stylesheet"/>
            <link rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
        </Head>
        <body className="antialiased">
            <Main/>
            <NextScript/>
        </body>
    </Html>
  );
}
