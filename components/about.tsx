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
            className='mb-28 max-w-[65rem] leading-8 sm:mb-28 scroll-mt-28'
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.175 }}
            id='about'
            ref={ref}
        >
            <SectionHeading>About Me</SectionHeading>
            <div className='rounded-xl border border-black/10 bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:border-white/15 dark:bg-white/10 md:p-8'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center'>
                    <div className='text-left'>
                        <div className='mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-100'>
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
                            <span className='font-semibold'>
                                Full-stack Development
                            </span>
                            . I love solving complex problems using
                            <span className='font-semibold text-gray-950 dark:text-blue-300'>
                                {" "}
                                React, Next.js, TypeScript, and MongoDB.
                            </span>
                        </div>

                        <div className='text-lg leading-relaxed text-gray-800 dark:text-gray-100'>
                            Coding{" "}
                            <span className='italic font-medium'>
                                8+ hours daily
                            </span>
                            , I am now pursuing a{" "}
                            <span className='underline font-medium'>
                                Second Degree
                            </span>{" "}
                            at{" "}
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
                    </div>

                    <div className='flex justify-center md:justify-end'>
                        <div className='relative h-[460px] w-full max-w-[320px] md:h-[300px] md:max-w-[420px] shadow-md rounded-xl'>
                            <img
                                src='/assets/about/about.jpg'
                                alt='About me'
                                className='h-full w-full rounded-xl object-cover object-[24%_30%] md:object-[left_30%] shadow-xl'
                            />
                            <div
                                className='pointer-events-none absolute inset-0 rounded-xl opacity-35 mix-blend-soft-light dark:opacity-45'
                                style={{
                                    backgroundImage:
                                        "url(\"data:image/svg+xml;utf8,%3Csvg width='420' height='420' viewBox='0 0 420 420' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='n' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='5' stitchTiles='stitch'/%3E%3CfeGaussianBlur stdDeviation='0.35'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
                                    backgroundSize: "220px 220px",
                                }}
                            />
                        </div>
                    </div>
                </div>
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
