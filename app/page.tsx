import About from "@/components/about";
import { Certificate } from "@/components/certification";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import SVGbg from "@/components/SVGbg";
import ScrollAnimation from "@/components/scroll-animation";
import QuoteSection from "@/components/quoteSection";
import Antigravity from "@/components/Antigravity";

export default function Home() {
    return (
        <>
            <header className='relative flex flex-col items-center px-4'>
                <div className='absolute inset-x-0 top-0 h-[60vh] -z-10 pointer-events-none'>
                    <Antigravity
                        count={500}
                        magnetRadius={10}
                        ringRadius={6}
                        waveSpeed={1.5}
                        waveAmplitude={1}
                        particleSize={0.6}
                        lerpSpeed={0.05}
                        color='#80ffff'
                        autoAnimate
                        particleVariance={1}
                        rotationSpeed={0}
                        depthFactor={0.7}
                        pulseSpeed={3}
                        particleShape='capsule'
                        fieldStrength={10}
                    />
                </div>
                <Intro />
            </header>
            <ScrollAnimation />
            <QuoteSection />
            <main className='relative flex flex-col items-center px-4 w-full overflow-hidden'>
                <SVGbg />
                <SectionDivider />
                <About />
                <Certificate />
                <Projects />
                <Skills />
                <Experience />
            </main>
            <Contact />
        </>
    );
}
