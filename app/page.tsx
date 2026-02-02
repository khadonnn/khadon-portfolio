import About from "@/components/about";
import { Certificate } from "@/components/certification";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import SVGbg from "@/components/SVGbg";

export default function Home() {
    return (
        <>
            <header className="flex flex-col items-center px-4'">
                <Intro />
            </header>
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
