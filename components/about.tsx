"use client";

import React from "react";

import { motion } from "framer-motion";
import SectionHeading from "@/components/section-heading";
import { useSectionInView } from "@/lib/hooks";
import { ScrollAnimatedTooltip } from "@/components/ui/scroll-animated-tooltip";
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
            <div className='mb-4 text-lg leading-relaxed'>
                After a degree in{" "}
                <ScrollAnimatedTooltip content={<FirstDegree />}>
                    <b className='underline font-semibold'>
                        Business Administration
                    </b>
                </ScrollAnimatedTooltip>{" "}
                at{" "}
                <ScrollAnimatedTooltip
                    containerClassName='underline'
                    content={<TDTCard />}
                >
                    <b className='underline'>TDTU</b>
                </ScrollAnimatedTooltip>
                , I pivoted to{" "}
                <span className='font-semibold'>Full-stack Development</span>. I
                love solving complex problems using
                <span className='font-semibold text-blue-600'>
                    {" "}
                    React, Next.js, TypeScript, and MongoDB.
                </span>
            </div>

            <div className='text-lg leading-relaxed'>
                Coding{" "}
                <span className='italic font-medium'>8+ hours daily</span>, I am
                now pursuing a{" "}
                <span className='underline font-medium'>Second Degree</span> at{" "}
                <ScrollAnimatedTooltip content={<UITCard />}>
                    <b className='underline'>UIT</b>
                </ScrollAnimatedTooltip>{" "}
                to deepen my expertise. I am seeking a
                <span className='font-bold'>
                    {" "}
                    full-time software developer{" "}
                </span>{" "}
                role to contribute and grow.
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
