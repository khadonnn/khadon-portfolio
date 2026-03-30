"use client";

import React, { useCallback, useRef } from "react";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "@/components/section-heading";
import { useSectionInView } from "@/lib/hooks";
import { ScrollAnimatedTooltip } from "@/components/ui/scroll-animated-tooltip";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const imageCardRef = useRef<HTMLDivElement>(null);
    const { ref: inViewRef } = useSectionInView("About", 0.5);

    const setSectionRefs = useCallback(
        (node: HTMLElement | null) => {
            sectionRef.current = node;
            inViewRef(node);
        },
        [inViewRef],
    );

    useGSAP(
        () => {
            if (
                !panelRef.current ||
                !textRef.current ||
                !imageRef.current ||
                !imageCardRef.current ||
                !sectionRef.current
            ) {
                return;
            }

            const copyLines = textRef.current.querySelectorAll(".about-copy");

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                gsap.set(
                    [panelRef.current, textRef.current, imageRef.current],
                    {
                        clearProps: "all",
                        autoAlpha: 1,
                    },
                );
                gsap.set([copyLines, imageCardRef.current], {
                    clearProps: "all",
                });
                return;
            }

            const tl = gsap.timeline({
                paused: true,
                defaults: {
                    ease: "power3.out",
                },
            });

            tl.fromTo(
                panelRef.current,
                {
                    autoAlpha: 0,
                    y: 34,
                    clipPath: "inset(8% 0% 14% 0% round 24px)",
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    clipPath: "inset(0% 0% 0% 0% round 16px)",
                    duration: 1.05,
                },
                0,
            )
                .fromTo(
                    copyLines,
                    {
                        autoAlpha: 0,
                        yPercent: 70,
                        rotateX: 12,
                        filter: "blur(6px)",
                        transformOrigin: "50% 100%",
                    },
                    {
                        autoAlpha: 1,
                        yPercent: 0,
                        rotateX: 0,
                        filter: "blur(0px)",
                        duration: 0.95,
                        stagger: 0.14,
                    },
                    0.24,
                )
                .fromTo(
                    imageRef.current,
                    {
                        autoAlpha: 0,
                        xPercent: 12,
                        rotateY: -8,
                    },
                    {
                        autoAlpha: 1,
                        xPercent: 0,
                        rotateY: 0,
                        duration: 1.15,
                    },
                    0.18,
                )
                .fromTo(
                    imageCardRef.current,
                    {
                        clipPath: "inset(18% 10% 18% 10% round 20px)",
                        scale: 0.9,
                    },
                    {
                        clipPath: "inset(0% 0% 0% 0% round 12px)",
                        scale: 1,
                        duration: 1.1,
                    },
                    0.12,
                );

            const entranceTrigger = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 86%",
                end: "bottom 20%",
                invalidateOnRefresh: true,
                onEnter: () => tl.play(),
                onEnterBack: () => tl.play(),
                onLeaveBack: () => tl.progress(0).pause(),
            });

            ScrollTrigger.refresh();

            return () => {
                entranceTrigger.kill();
                tl.kill();
            };
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={setSectionRefs}
            className='mb-28 max-w-[65rem] leading-8 sm:mb-28 scroll-mt-28'
            id='about'
        >
            <SectionHeading>About Me</SectionHeading>
            <div
                ref={panelRef}
                className='rounded-2xl border border-black/[0.08] bg-gradient-to-br from-white/85 via-white/70 to-white/45 p-6 shadow-[0_36px_80px_-34px_rgba(0,0,0,0.55)] backdrop-blur-md dark:border-white/15 dark:from-white/12 dark:via-white/8 dark:to-white/5 md:p-8'
            >
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center'>
                    <div
                        ref={textRef}
                        className='relative z-20 overflow-visible text-left will-change-transform will-change-opacity'
                    >
                        <div className='about-copy-wrap mb-4'>
                            <div className='about-copy text-lg leading-relaxed text-gray-800 dark:text-gray-100'>
                                After a degree in{" "}
                                <ScrollAnimatedTooltip
                                    content={<FirstDegree />}
                                >
                                    <b className='underline font-semibold'>
                                        Business Administration
                                    </b>
                                </ScrollAnimatedTooltip>{" "}
                                at{" "}
                                <ScrollAnimatedTooltip
                                    containerClassName='relative z-[1200] underline'
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
                        </div>

                        <div className='about-copy-wrap'>
                            <div className='about-copy text-lg leading-relaxed text-gray-800 dark:text-gray-100'>
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
                    </div>

                    <div
                        ref={imageRef}
                        className='relative z-10 flex justify-center md:justify-end will-change-transform will-change-opacity'
                    >
                        <div
                            ref={imageCardRef}
                            className='relative h-[460px] w-full max-w-[320px] overflow-hidden shadow-md rounded-xl md:h-[300px] md:max-w-[420px]'
                        >
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
        </section>
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
