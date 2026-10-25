import "./globals.css"; 
import Navbar from "../components/commonLayout/Navbar";
import Footer from "../components/commonLayout/Footer";
import WhatsAppLogo from "../components/commonLayout/WhatsappLogo";
import ScrollToTopButton from "../components/commonLayout/ScrollToTopButton";
import AOSProvider from "../components/provider/AOSProvider"; 

export const metadata = {
  title: "AURA Athletic Club | Elite Performance & Recovery",
  description: "European luxury athletic facility with biomechanical training and thermal recovery.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      data-color="red"
      className={` dark h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#090a0c" />
        <meta name="msapplication-TileColor" content="#090a0c" />
        <meta name="geo.region" content="EU" />
        <meta name="language" content="English" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="rating" content="general" />

      </head>

      <body> 
        <AOSProvider/>
        <Navbar/>

        <main id="main-content">
          {children} 
        </main>

        <Footer />
        <WhatsAppLogo />
        <ScrollToTopButton />
      </body>
    </html>
  );
}