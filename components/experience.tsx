"use client";

import React, { useCallback, useRef } from "react";
import SectionHeading from "./section-heading";
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
            className='scroll-mt-28 mb-28 sm:mb-40'
        >
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
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
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
                            <p className='font-normal !mt-0'>{item.location}</p>
                            <p className='!mt-1 !font-normal text-gray-700 dark:text-white/75 italic'>
                                {item.description}
                            </p>
                            <p className='font-normal !mt-0'>{item.score}</p>
                        </VerticalTimelineElement>
                    </React.Fragment>
                ))}
            </VerticalTimeline>
        </section>
    );
}
