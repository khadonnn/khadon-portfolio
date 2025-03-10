"use client";

import React, { useRef } from "react";
import SectionHeading from "./section-heading";
import { projectsData } from "@/lib/data";
import Project from "./project";
import { useScroll } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function Projects() {
    const { ref } = useSectionInView("Projects", 0.5);
    // const ref = useRef(null);
    // useScroll({ target: ref, offset: ["0 1", "1.33 1"] });
    return (
        <section ref={ref} id='projects' className='scroll-mt-28 mb-28'>
            <SectionHeading>My projects</SectionHeading>
            <div>
                {projectsData.map((project, index) => (
                    <React.Fragment key={index}>
                        <Project {...project} />
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
}
