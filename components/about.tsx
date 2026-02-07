"use client";

import React from "react";

import { motion } from "framer-motion";
import SectionHeading from "@/components/section-heading";
import { useSectionInView } from "@/lib/hooks";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
export default function About() {
    const { ref } = useSectionInView("About");
    return (
        <motion.section
            className='mb-28 max-w-[45rem] text-center leading-8 sm:mb-28 scroll-mt-28'
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.175 }}
            id='about'
            ref={ref}
        >
            <SectionHeading>About Me</SectionHeading>
            <div className='mb-3'>
                After graduating with my first degree in{" "}
                <AnimatedTooltip
                    items={[
                        {
                            id: 1,
                            name: "Busines Administration",
                            designation: "First Degree",
                            content: <FirstDegree />,
                        },
                    ]}
                    autoActivateOnScroll
                />{" "}
                at the{" "}
                <AnimatedTooltip
                    items={[
                        {
                            id: 2,
                            name: "TDT",
                            designation: "TDTU",
                            content: <TDTCard />,
                        },
                    ]}
                    autoActivateOnScroll
                />{" "}
                University . I decided to pursue my passion for programming. I
                enrolled in a coding bootcamp and learned{" "}
                <span className='font-medium'>full-stack web development</span>.{" "}
                <span className='italic'>My favorite part of programming</span>{" "}
                is the problem-solving aspect. I love the feeling of finally
                figuring out a solution to a problem. My core stack is{" "}
                <span className='font-medium'>
                    React, Next.js, Typescript and MongoDB
                </span>
                . I am also familiar with TypeScript and Prisma. I am always
                looking to learn new technologies. I am currently looking for a{" "}
                <span className='font-medium'>full-time position</span> as a
                software developer.
            </div>

            <div>
                Every day,{" "}
                <span className='italic'>
                    I dedicate over 8 hours to coding and expanding my
                    skills.{" "}
                </span>
                Currently, I am pursuing a{" "}
                <span className='underline'>Second degree</span>, where I focus
                on deepening my knowledge and honing my expertise in the field.
                I am enrolled at the{" "}
                <AnimatedTooltip
                    items={[
                        {
                            id: 3,
                            name: "University of Information Technology - CITD",
                            designation: "UIT",
                            content: <UITCard />,
                        },
                    ]}
                    autoActivateOnScroll
                />
                , actively learning and embracing new concepts to grow as a
                developer.
            </div>
        </motion.section>
    );
}
const TDTCard = () => {
    return (
        <div>
            <img
                src='/TDT_logo.png'
                alt='TDTU Logo'
                className='aspect-3/4 w-full rounded-sm'
            />
            <div className='my-4 flex flex-col'>
                <p className='text-lg font-bold'>TDTU</p>
                <p className='mt-1 text-xs text-neutral-600 dark:text-neutral-400'>
                    A well-known university in Vietnam, offering a variety of
                    programs and degrees.{" "}
                    <span className='italic'>
                        Adr: 19 Nguyễn Hữu Thọ, Phường, Quận 7, Thành phố Hồ Chí
                        Minh
                    </span>
                </p>
            </div>
        </div>
    );
};
const UITCard = () => {
    return (
        <div>
            <img
                src='/UIT_logo.jpg'
                alt='UIT Logo'
                className='aspect-3/4 w-full rounded-sm'
            />
            <div className='my-4 flex flex-col'>
                <p className='text-lg font-bold'>UIT</p>
                <p className='mt-1 text-xs text-neutral-600 dark:text-neutral-400'>
                    University of Information Technology - VNUHCM, specializing
                    in information technology education and research.{" "}
                    <span className='italic'>
                        Adr: P. Linh Xuân, TP. Hồ Chí Minh
                    </span>
                </p>
            </div>
        </div>
    );
};

const FirstDegree = () => {
    return (
        <div>
            <img
                src='/Certificate.jpg'
                alt='tdtd certificate'
                className='w-full h-auto object-cover block'
            />
        </div>
    );
};
