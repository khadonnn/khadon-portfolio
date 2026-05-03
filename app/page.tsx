"use client";
import dynamic from "next/dynamic";
import About from "@/components/about";
import { Certificate } from "@/components/certification";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
const SVGbg = dynamic(() => import("../components/SVGbg"), { ssr: false });
import ScrollAnimation from "@/components/scroll-animation";
import QuoteSection from "@/components/quoteSection";
import Antigravity from "@/components/Antigravity";
import { useIsDesktop } from "@/lib/useIsDesktop";
import GalaxyHero from "@/components/background/galaxy";
import MapLayout from "@/components/map-layout";

export default function Home() {
    const isDesktop = useIsDesktop();
    return (
        <>
            <header className='relative flex flex-col items-center px-4'>
                <Intro />
            </header>
            <ScrollAnimation />
            <QuoteSection />
            <main className='relative flex flex-col items-center px-4 w-full overflow-hidden'>
                {isDesktop && <SVGbg />}
                <SectionDivider />
                <About />
                <Certificate />
                <Projects />
                <Skills />
                <Experience />
            </main>
            <Contact />
            <MapLayout />
        </>
    );
}
