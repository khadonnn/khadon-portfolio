"use client";

import React, { useCallback, useRef } from "react";
import { skillsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeInAnimationVariants = {
    initial: {
        opacity: 0,
        y: -100,
    },
    animate: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.1 * index,
        },
    }),
};

export default function Skills() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const { ref: inViewRef } = useSectionInView("Skills");
    const sectionInView = useInView(sectionRef, { once: true, margin: "-10%" });
    const lineRef = useRef<HTMLDivElement>(null);
    const setSectionRefs = useCallback(
        (node: HTMLElement | null) => {
            sectionRef.current = node;
            inViewRef(node);
        },
        [inViewRef],
    );

    return (
        <section
            id='skills'
            ref={setSectionRefs}
            className='w-full scroll-mt-20 mb-20 sm:mb-28'
        >
            <div className='max-w-[1440px] mx-auto px-[clamp(1.25rem,5vw,5rem)] py-[clamp(2.75rem,5.5vw,6rem)]'>
                {/* Section label */}
                <div className='flex items-center gap-4 mb-[clamp(2rem,4vw,4rem)]'>
                    <motion.span
                        initial={{ opacity: 0, x: -12 }}
                        animate={sectionInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, ease: EASE }}
                        className='text-[0.6rem] tracking-[0.22em] uppercase text-black/30 font-medium'
                        style={{ fontFamily: "Satoshi, system-ui, sans-serif" }}
                    >
                        04 / Skills
                    </motion.span>
                    <div ref={lineRef} className='flex-1 h-px bg-black/10' />
                </div>
                <motion.h2
                    initial={{ opacity: 0, y: 32 }}
                    animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
                    className='font-black text-black tracking-tighter leading-[0.88] mb-[clamp(3rem,6vw,7rem)] dark:text-gray-50'
                    style={{
                        fontFamily: "Satoshi, system-ui, sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(3rem, 7vw, 7rem)",
                    }}
                >
                    My{" "}
                    <span
                        style={{
                            fontFamily:
                                "var(--font-instrument), Georgia, serif",
                            fontStyle: "italic",
                            fontWeight: 400,
                        }}
                        className='text-gray-950/30 dark:text-gray-50/40'
                    >
                        Skills
                    </span>
                </motion.h2>
                <ul className='flex flex-wrap justify-center gap-2 text-lg text-gray-800'>
                    {skillsData.map((skill, index) => (
                        <motion.li
                            className='bg-white borderBlack rounded-xl px-5 py-3 dark:bg-white/10 dark:text-white/80'
                            key={index}
                            variants={fadeInAnimationVariants}
                            initial='initial'
                            whileInView='animate'
                            viewport={{
                                once: true,
                            }}
                            custom={index}
                        >
                            {skill}
                        </motion.li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
