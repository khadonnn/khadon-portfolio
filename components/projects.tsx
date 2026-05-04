"use client";

import React, { useRef } from "react";
import SectionHeading from "./section-heading";
import { projectsData } from "@/lib/data";
import Project from "./project";
import { useScroll } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Projects() {
    const { ref } = useSectionInView("Projects", 0.5);
    // const ref = useRef(null);
    // useScroll({ target: ref, offset: ["0 1", "1.33 1"] });
    return (
        <section ref={ref} id='projects' className='scroll-mt-28 mb-28'>
            {/* Header + See more */}
            <div className='flex items-center justify-between mb-6'>
                <SectionHeading>My projects</SectionHeading>
            </div>

            {/* Projects list */}
            <div>
                {projectsData.map((project, index) => (
                    <React.Fragment key={index}>
                        <Project {...project} />
                    </React.Fragment>
                ))}
            </div>
            <div className='flex justify-end mt-6 '>
                <Link
                    href='/projects'
                    className='group flex items-center gap-1 cursor-pointer text-lg font-medium underline underline-offset-4'
                >
                    See more projects
                    <ArrowUpRight
                        className='transition-transform duration-300  group-hover:rotate-45'
                        size={18}
                    />
                </Link>
            </div>
        </section>
    );
}
