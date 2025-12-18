import { Suspense } from "react";
import { AppHeader, AppFooter, AppMetadata } from "components";
import Loading from "./loading";
import "styles/globals.css";
import { ThemeContext } from "context";

export const metadata = { ...AppMetadata };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />

        {/* Preload critical CSS */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"
          as="style"
        />

        {/* Existing stylesheets */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css" />

        {/* Google Tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4VJLPX3JB7"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4VJLPX3JB7');
            `,
          }}
        ></script>

        {/* Google Tag Manager */}
       <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5V27ML56');`,
        }}></script>
        {/* End Google Tag Manager */}

        {/* Structured Data - Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Anthony Horner",
              "url": "https://ahorner1117.github.io",
              "image": "https://ahorner1117.github.io/headshot.jpg",
              "sameAs": [
                "https://github.com/ahorner1117"
              ],
              "jobTitle": "Software Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              },
              "description": "Highly skilled software developer with a passion for coding, proficient in Next.js and React.js. Experienced in CMS and implementing CI/CD practices.",
              "knowsAbout": [
                "Next.js",
                "React.js",
                "Shopify Plus",
                "E-commerce Development",
                "Frontend Development",
                "Full Stack Development"
              ],
              "email": "ahsoftware1997@gmail.com",
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Computer Science Program"
              }
            })
          }}
        />

        {/* Structured Data - Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Anthony Horner Portfolio",
              "url": "https://ahorner1117.github.io",
              "description": "Portfolio website showcasing software development projects, e-commerce solutions, and technical expertise in Next.js, React.js, and Shopify Plus development.",
              "author": {
                "@type": "Person",
                "name": "Anthony Horner"
              },
              "inLanguage": "en-US"
            })
          }}
        />

        {/* Structured Data - BreadcrumbList for navigation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://ahorner1117.github.io"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "About",
                  "item": "https://ahorner1117.github.io#about"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Projects",
                  "item": "https://ahorner1117.github.io#projects"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Technologies",
                  "item": "https://ahorner1117.github.io#tech"
                }
              ]
            })
          }}
        />

      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5V27ML56"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}>
          </iframe>
        </noscript>
      {/*  End Google Tag Manager (noscript) */}

        <ThemeContext>
          <AppHeader />
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <AppFooter />
        </ThemeContext>
      </body>
    </html>
  );
}
