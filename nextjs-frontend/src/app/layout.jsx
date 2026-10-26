import "./globals.css";
import Navbar from "../components/commonLayout/Navbar";
import Footer from "../components/commonLayout/Footer";
import WhatsAppLogo from "../components/commonLayout/WhatsappLogo";
import ScrollToTopButton from "../components/commonLayout/ScrollToTopButton";
import AOSProvider from "../components/provider/AOSProvider";
import {
  SITE_NAME,
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TWITTER_HANDLE,
  SITE_OG_IMAGE,
} from "../data/siteInfo";

const TITLE = SITE_TITLE || SITE_NAME;
const DESCRIPTION =
  SITE_DESCRIPTION ||
  `${SITE_NAME}: coached training, quality equipment and a crew that pushes you further.`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: SITE_KEYWORDS || undefined,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_TWITTER_HANDLE,
    creator: SITE_TWITTER_HANDLE,
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090a0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-color="red"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className="antialiased"
    >
      <head>
        <meta name="msapplication-TileColor" content="#090a0c" />
        <meta name="geo.region" content="GB" />
        <meta name="language" content="English" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="rating" content="general" />
      </head>

      <body className="flex min-h-svh flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-secondary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-white"
        >
          Skip to main content
        </a>

        <AOSProvider />
        <Navbar />

        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>

        <Footer />
        <WhatsAppLogo />
        <ScrollToTopButton />
      </body>
    </html>
  );
}