import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import ActiveSectionContextProvider from "@/context/active-section-context";
import ThemeContextProvider from "@/context/theme-context";
import { LoadingProvider } from "@/context/loading-context";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";
import ThemeSwitch from "@/components/theme-switch";
import BackgroundBlurs from "@/components/background-blurs";
import CertificateHoverMenu from "@/components/CertificateHoverMenu";

export const metadata = {
    title: "Khadondev | Personal Portfolio",
    description: "Khadon - Frontend Developer about Web application",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en' className='!scroll-smooth'>
            <body
                className={`${inter.className} bg-gray-50 text-gray-950 relative dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90 `}
            >
                <BackgroundBlurs />
                <ThemeContextProvider>
                    <LoadingProvider>
                        <ActiveSectionContextProvider>
                            <Header />
                            <div className='pt-28 sm:pt-36'>{children}</div>
                            <Footer />
                            <Toaster position='top-right' />
                            <ThemeSwitch />
                            <CertificateHoverMenu />
                        </ActiveSectionContextProvider>
                    </LoadingProvider>
                </ThemeContextProvider>
            </body>
        </html>
    );
}
