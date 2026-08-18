"use client";
import dynamic from "next/dynamic";
import { Certificate } from "@/components/certification";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
const SVGbg = dynamic(() => import("../components/SVGbg"), { ssr: false });
import { useIsDesktop } from "@/lib/useIsDesktop";
import MapLayout from "@/components/map-layout";
import { Services } from "@/components/Services";
import { SmoothScroll } from "@/lib/SmoothScroll";
import { About } from "@/components/about-me";

export default function Home() {
    const isDesktop = useIsDesktop();
    return (
        <>
            <header className='relative z-20 flex w-full flex-col items-center px-4 mb-28 sm:mb-28 scroll-mt-28'>
                <Intro />
            </header>
            {/* <QuoteSection /> */}
            <SmoothScroll>
                <main className='relative flex flex-col items-center px-4 w-full overflow-hidden'>
                    {isDesktop && <SVGbg />}
                    <SectionDivider />
                    <About />
                    <Certificate />
                    <Projects />
                    <Skills />
                    <Experience />
                    <Services />
                </main>
            </SmoothScroll>
            <Contact />
            <MapLayout />
        </>
    );
}
