"use client";

import React from "react";

import { motion } from "framer-motion";
import SectionHeading from "@/components/section-heading";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
    const { ref } = useSectionInView("About");
    return (
        <motion.section
            className='mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28'
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.175 }}
            id='about'
            ref={ref}
        >
            <SectionHeading>About Me</SectionHeading>
            <p className='mb-3'>
                After graduating with a degree in{" "}
                <span className='font-medium'>Busines Administration at</span>{" "}
                <span className='underline'>TDTU</span>. I decided to pursue my
                passion for programming. I enrolled in a coding bootcamp and
                learned{" "}
                <span className='font-medium'>full-stack web development</span>.{" "}
                <span className='italic'>My favorite part of programming</span>{" "}
                is the problem-solving aspect. I{" "}
                <span className='underline'>love</span> the feeling of finally
                figuring out a solution to a problem. My core stack is{" "}
                <span className='font-medium'>
                    React, Next.js, Typescript and MongoDB
                </span>
                . I am also familiar with TypeScript and Prisma. I am always
                looking to learn new technologies. I am currently looking for a{" "}
                <span className='font-medium'>full-time position</span> as a
                software developer.
            </p>

            <p>
                Every day,{" "}
                <span className='italic'>
                    I dedicate over 8 hours to coding and expanding my skills.{" "}
                </span>
                Currently, I am pursuing a{" "}
                <span className='underline'>Second degree</span>, where I focus
                on deepening my knowledge and honing my expertise in the field.
                I am enrolled at the{" "}
                <span className='font-medium underline'>
                    University of Information Technology - CITD
                </span>
                , actively learning and embracing new concepts to grow as a
                developer.
            </p>
        </motion.section>
    );
}
