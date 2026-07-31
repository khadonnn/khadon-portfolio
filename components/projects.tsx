"use client";

import React, { useCallback, useRef } from "react";
import SectionHeading from "./section-heading";
import { projectsData } from "@/lib/data";
import Project from "./project";
import { motion, useInView } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import ProjectsButton from "./projects-button";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Projects() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const { ref: inViewRef } = useSectionInView("Projects", 0.5);
    const sectionInView = useInView(sectionRef, { once: true, margin: "-10%" });

    const setSectionRefs = useCallback(
        (node: HTMLElement | null) => {
            sectionRef.current = node;
            inViewRef(node);
        },
        [inViewRef],
    );

    return (
        <section
            ref={setSectionRefs}
            id='projects'
            className='scroll-mt-28 mb-28'
        >
            {/* Header + See more */}
            <motion.h2
                initial={{ opacity: 0, y: 32 }}
                animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
                className='font-black text-left text-gray-950 tracking-tighter leading-[0.88] mb-[clamp(3rem,6vw,7rem)] mt-5 dark:text-gray-50'
                style={{
                    fontFamily: "Satoshi, system-ui, sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(3rem, 7vw, 7rem)",
                }}
            >
                My{" "}
                <span
                    style={{
                        fontFamily: "var(--font-instrument), Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: 400,
                    }}
                    className='text-gray-950/30 dark:text-gray-50/40'
                >
                    Projects
                </span>
            </motion.h2>

            {/* Projects list */}
            <div>
                {projectsData.map((project, index) => (
                    <React.Fragment key={index}>
                        <Project {...project} />
                    </React.Fragment>
                ))}
            </div>
            <div className='flex justify-center mt-12 mb-4'>
                <ProjectsButton />
            </div>
        </section>
    );
}
