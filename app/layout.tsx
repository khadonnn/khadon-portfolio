import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

const pencerio = localFont({
    src: "./fonts/Pencerio-Hairline.woff2",
    display: "swap",
    variable: "--font-pencerio",
    weight: "100",
});

import ActiveSectionContextProvider from "@/context/active-section-context";
import ThemeContextProvider from "@/context/theme-context";
import { LoadingProvider } from "@/context/loading-context";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";
import ThemeSwitch from "@/components/theme-switch";
import BackgroundBlurs from "@/components/background-blurs";
import CertificateHoverMenu from "@/components/CertificateHoverMenu";
import SeaStormHero from "@/components/background/sea-storm";

const SITE_URL = "https://www.khadon.io.vn/";

const schemaGraph = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Khadon",
    url: SITE_URL,
    sameAs: [SITE_URL],
};

export const metadata = {
    title: "Khadondev | Personal Portfolio",
    description: "Khadon - Full-Stack Developer",
    metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en' className='!scroll-smooth dark'>
            <head>
                {/* FOUC guard: áp dụng theme trước khi paint.
                    Mặc định DARK; chỉ bỏ class 'dark' nếu user đã lưu 'light'. */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){
                            try{
                                var t = localStorage.getItem('theme');
                                if (t === 'light') document.documentElement.classList.remove('dark');
                                else document.documentElement.classList.add('dark');
                            }catch(e){
                                document.documentElement.classList.add('dark');
                            }
                        })();`,
                    }}
                />
            </head>
            <body
                className={`${inter.className} ${pencerio.variable} bg-gray-50 text-gray-950 relative dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
            >
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schemaGraph).replace(
                            /</g,
                            "\\u003c",
                        ),
                    }}
                />
                <BackgroundBlurs />
                <ThemeContextProvider>
                    <SeaStormHero />
                    <ActiveSectionContextProvider>
                        <LoadingProvider videoSrc='/assets/video_bg/galaxy.mp4'>
                            <Header />
                            <div className='pt-20 sm:pt-24 flex-grow'>
                                {children}
                            </div>
                            <Footer />
                            <Toaster position='top-right' />
                            <ThemeSwitch />
                            <CertificateHoverMenu />
                        </LoadingProvider>
                    </ActiveSectionContextProvider>
                </ThemeContextProvider>
            </body>
        </html>
    );
}
