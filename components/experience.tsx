"use client";

import React, { useCallback, useRef } from "react";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { useTheme } from "@/context/theme-context";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Experience() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const { ref: inViewRef } = useSectionInView("Experience");
    const sectionInView = useInView(sectionRef, { once: true, margin: "-10%" });
    const { theme } = useTheme();
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
            id='experience'
            ref={setSectionRefs}
            className='w-full scroll-mt-20'
        >
            <div className='max-w-[1440px] mx-auto px-[clamp(1.25rem,5vw,5rem)] py-[clamp(2.75rem,5.5vw,6rem)]'>
                {/* Section label */}
                <div className='flex items-center gap-4 mb-[clamp(2rem,4vw,4rem)]'>
                    <motion.span
                        initial={{ opacity: 0, x: -12 }}
                        animate={sectionInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, ease: EASE }}
                        className='text-[0.6rem] tracking-[0.22em] uppercase text-black/30 dark:text-white/40 font-medium'
                        style={{ fontFamily: "Satoshi, system-ui, sans-serif" }}
                    >
                        05 / Experience
                    </motion.span>
                    <div
                        ref={lineRef}
                        className='flex-1 h-px bg-black/10 dark:bg-white/10'
                    />
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
                        Experience
                    </span>
                </motion.h2>
                <VerticalTimeline lineColor=''>
                    {experiencesData.map((item, index) => (
                        <React.Fragment key={index}>
                            <VerticalTimelineElement
                                contentStyle={{
                                    background:
                                        theme === "light"
                                            ? "#f3f4f6"
                                            : "rgba(255, 255, 255, 0.05)",
                                    boxShadow:
                                        "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                    border: "1px solid rgba(0, 0, 0, 0.05)",
                                    textAlign: "left",
                                    padding: "1.3rem 2rem",
                                }}
                                contentArrowStyle={{
                                    borderRight:
                                        theme === "light"
                                            ? "0.4rem solid #9ca3af"
                                            : "0.4rem solid rgba(255, 255, 255, 0.5)",
                                }}
                                date={item.date}
                                icon={item.icon}
                                iconStyle={{
                                    background:
                                        theme === "light"
                                            ? "white"
                                            : "rgba(255, 255, 255, 0.15)",
                                    fontSize: "1.5rem",
                                }}
                            >
                                <h3 className='font-semibold capitalize text-xl '>
                                    {item.title}
                                </h3>
                                <p className='font-normal !mt-0'>
                                    {item.location}
                                </p>
                                <p className='!mt-1 !font-normal text-gray-700 dark:text-white/75 italic'>
                                    {item.description}
                                </p>
                                <p className='font-normal !mt-0'>
                                    {item.score}
                                </p>
                            </VerticalTimelineElement>
                        </React.Fragment>
                    ))}
                </VerticalTimeline>
            </div>
        </section>
    );
}
