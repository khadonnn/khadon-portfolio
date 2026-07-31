"use client";

import { useRef, useState, useEffect } from "react";
import {
    motion,
    AnimatePresence,
    useInView,
    useMotionValue,
    useSpring,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/context/theme-context";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

const SERVICES = [
    {
        index: "01",
        title: "Microservices & System Architecture",
        short: "Scalable and event-driven backends.",
        body: "Designing distributed systems using event-driven architecture, the Outbox pattern, and Saga pattern for strict data consistency. I structure scalable codebases using Turborepo monorepos to streamline cross-service deployment and containerization with Docker.",
        keywords: [
            "System Design",
            "Microservices",
            "Event-Driven",
            "Kafka",
            "Turborepo",
        ],
    },
    {
        index: "02",
        title: "Modern Full-Stack Development",
        short: "Responsive UIs with robust backends.",
        body: "Building high-performance web applications from end to end. Utilizing Next.js, React, and Tailwind CSS for dynamic interfaces, securely integrated with Node.js backends and robust databases using Prisma ORM.",
        keywords: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma ORM"],
    },
    {
        index: "03",
        title: "AI Integration & Data Processing",
        short: "Smarter applications with AI capabilities.",
        body: "Developing Hybrid Recommendation Systems combining Collaborative Filtering with NLP sentiment analysis. Integrating RAG/AI agents and ensuring fast API responses by offloading heavy AI workloads to background processing queues.",
        keywords: ["RAG / AI Agents", "Python", "BullMQ", "Redis"],
    },
    {
        index: "04",
        title: "Real-Time Systems & Collaboration",
        short: "Live video, chat, and instant updates.",
        body: "Architecting interactive platforms featuring live video calling, shared coding environments, and real-time messaging. Using WebSockets, Socket.IO, and Stream to deliver low-latency, seamless user experiences.",
        keywords: ["Socket.IO", "Stream", "Real-time", "Zustand"],
    },
    {
        index: "05",
        title: "Database & API Engineering",
        short: "Optimized architecture for reliability.",
        body: "Designing scalable database structures with PostgreSQL and MongoDB. Improving system performance by implementing caching strategies, secure authentication (JWT, OAuth 2.0, Clerk), and managing asynchronous background jobs seamlessly.",
        keywords: [
            "PostgreSQL",
            "MongoDB",
            "Authentication",
            "Background Jobs",
        ],
    },
];

/* ─── Toggle icon: two lines that morph into × ─────────────────────────── */
function ToggleIcon({ open }: { open: boolean }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const lineColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(10,10,10,0.7)";

    return (
        <div className='relative w-5 h-5 shrink-0'>
            <motion.span
                className='absolute left-0 top-1/2 block w-5 h-px origin-center'
                style={{ backgroundColor: lineColor, translateY: "-50%" }}
                animate={{ rotate: open ? 45 : 0, y: open ? 0 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
            />
            <motion.span
                className='absolute left-0 top-1/2 block w-5 h-px origin-center'
                style={{ backgroundColor: lineColor, translateY: "-50%" }}
                animate={{ rotate: open ? -45 : 90 }}
                transition={{ duration: 0.3, ease: EASE }}
            />
        </div>
    );
}

/* ─── Individual service row ─────────────────────────────────────────────── */
function ServiceRow({
    service,
    index,
    isOpen,
    hasOpenSibling,
    onToggle,
}: {
    service: (typeof SERVICES)[0];
    index: number;
    isOpen: boolean;
    hasOpenSibling: boolean;
    onToggle: () => void;
}) {
    const { theme } = useTheme();
    const rowRef = useRef<HTMLDivElement>(null);
    const inView = useInView(rowRef, { once: true, margin: "-8%" });
    const [hovered, setHovered] = useState(false);

    const rawX = useMotionValue(0);
    const springX = useSpring(rawX, { stiffness: 380, damping: 32 });
    const isDark = theme === "dark";
    const borderColor = isDark ? "border-white/8" : "border-black/10";
    const titleColor = isDark ? "text-white" : "text-black";
    const mutedText = isDark ? "text-white/35" : "text-black/45";
    const mutedBody = isDark ? "text-white/50" : "text-black/65";
    const keywordText = isDark ? "text-white/35" : "text-black/55";
    const accentBorder = isDark ? "border-white/15" : "border-black/10";
    const hoverLine = isDark ? "bg-white/30" : "bg-black/15";

    return (
        <motion.div
            ref={rowRef}
            animate={{ opacity: hasOpenSibling ? 0.35 : 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className={`relative overflow-hidden border-b ${borderColor}`}
        >
            {/* Hover sweep background */}
            <motion.div
                className='absolute inset-0 pointer-events-none'
                style={{
                    background: isDark
                        ? "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, transparent 60%)"
                        : "linear-gradient(90deg, rgba(10,10,10,0.03) 0%, transparent 60%)",
                }}
                animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -16 }}
                transition={{ duration: 0.35 }}
            />

            {/* Left accent bar — clips in on hover or open */}
            <motion.div
                className={`absolute left-0 top-0 bottom-0 w-px origin-top ${hoverLine}`}
                animate={{
                    scaleY: hovered || isOpen ? 1 : 0,
                    opacity: hovered || isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.35, ease: EASE }}
            />

            <button
                onClick={onToggle}
                onMouseEnter={() => {
                    setHovered(true);
                    rawX.set(10);
                }}
                onMouseLeave={() => {
                    setHovered(false);
                    rawX.set(0);
                }}
                className='w-full flex items-center justify-between py-6 lg:py-8 text-left pl-4 lg:pl-6'
            >
                {/* Content: index + title + short */}
                <motion.div
                    style={{ x: springX }}
                    className='flex items-baseline gap-6 lg:gap-10 flex-1 min-w-0'
                >
                    {/* Index */}
                    <motion.span
                        className='text-[0.6rem] tracking-[0.2em] uppercase font-medium shrink-0 tabular-nums'
                        style={{ fontFamily: "Satoshi, system-ui, sans-serif" }}
                        animate={{
                            color:
                                hovered || isOpen
                                    ? isDark
                                        ? "rgba(255,255,255,0.75)"
                                        : "rgba(10,10,10,0.8)"
                                    : isDark
                                      ? "rgba(255,255,255,0.22)"
                                      : "rgba(10,10,10,0.35)",
                        }}
                        transition={{ duration: 0.25 }}
                    >
                        {service.index}
                    </motion.span>

                    {/* Title — clips up from below on scroll-in */}
                    <div className='flex flex-col lg:flex-row lg:items-baseline gap-1 lg:gap-8 flex-1 min-w-0'>
                        <div className='overflow-hidden'>
                            <motion.h3
                                className={`font-black tracking-[-0.035em] leading-none ${titleColor}`}
                                style={{
                                    fontFamily:
                                        "Satoshi, system-ui, sans-serif",
                                    fontWeight: 800,
                                    fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)",
                                }}
                                initial={{ y: "110%" }}
                                animate={inView ? { y: 0 } : {}}
                                transition={{
                                    duration: 0.75,
                                    delay: index * 0.09,
                                    ease: EASE,
                                }}
                            >
                                {service.title}
                            </motion.h3>
                        </div>

                        {/* Short — fades out when open */}
                        <motion.p
                            className={`text-sm lg:text-base hidden lg:block shrink-0 ${mutedText}`}
                            style={{
                                fontFamily: "Satoshi, system-ui, sans-serif",
                            }}
                            animate={{
                                opacity: isOpen ? 0 : hovered ? 0.6 : 0.35,
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            {service.short}
                        </motion.p>
                    </div>
                </motion.div>

                <div className='ml-4'>
                    <ToggleIcon open={isOpen} />
                </div>
            </button>

            {/* Expanded body */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className='overflow-hidden'
                    >
                        <div className='pb-10 pl-[calc(1rem+1.5rem+1.5rem)] lg:pl-[calc(1.5rem+2.5rem+2.5rem)] pr-4 lg:pr-6'>
                            {/* Body — word-by-word stagger */}
                            <p
                                className={`leading-relaxed max-w-2xl mb-6 ${mutedBody}`}
                                style={{
                                    fontFamily:
                                        "Satoshi, system-ui, sans-serif",
                                    fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
                                }}
                            >
                                {service.body.split(" ").map((word, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                            filter: "blur(3px)",
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: i * 0.022,
                                            ease: EASE,
                                        }}
                                        style={{
                                            display: "inline-block",
                                            marginRight: "0.3em",
                                        }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </p>

                            {/* Keywords — staggered clip-path pop-in */}
                            <div className='flex flex-wrap gap-2'>
                                {service.keywords.map((kw, i) => (
                                    <motion.span
                                        key={kw}
                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                            clipPath: "inset(100% 0 0 0)",
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            clipPath: "inset(0% 0 0 0)",
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: 0.12 + i * 0.07,
                                            ease: EASE,
                                        }}
                                        className={`border text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 ${accentBorder} ${keywordText}`}
                                        style={{
                                            fontFamily:
                                                "Satoshi, system-ui, sans-serif",
                                        }}
                                    >
                                        {kw}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─── Section ────────────────────────────────────────────────────────────── */
export function Services() {
    const sectionRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const sectionInView = useInView(sectionRef, { once: true, margin: "-12%" });
    const { theme } = useTheme();

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const isDark = theme === "dark";
    const sectionBg = isDark ? "bg-[#0A0A0A]" : "bg-[#f5f5f3]";
    const labelColor = isDark ? "text-white/20" : "text-black/35";
    const dividerColor = isDark ? "bg-white/10" : "bg-black/10";
    const borderColor = isDark ? "border-white/8" : "border-black/10";
    const headlineColor = isDark ? "text-white" : "text-black";
    const italicColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(10,10,10,0.3)";

    /* Scroll-scrub vertical progress line */
    useEffect(() => {
        if (!sectionRef.current || !lineRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                lineRef.current,
                { scaleY: 0, transformOrigin: "top center" },
                {
                    scaleY: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 65%",
                        end: "bottom 35%",
                        scrub: 1.5,
                    },
                },
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id='services'
            data-theme={theme}
            className={`w-full relative ${sectionBg} font-satoshi`}
        >
            {/* Scroll-progress line — left edge */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-px hidden lg:block pointer-events-none ${isDark ? "bg-white/5" : "bg-black/5"}`}
            >
                <div
                    ref={lineRef}
                    className={`w-full h-full ${isDark ? "bg-white/20" : "bg-black/20"}`}
                />
            </div>

            <div className='max-w-[1440px] mx-auto px-[clamp(1.25rem,5vw,5rem)] py-[clamp(5rem,10vw,11rem)]'>
                {/* Section label + animated divider */}
                <div className='flex items-center gap-4 mb-[clamp(3rem,6vw,7rem)]'>
                    <motion.span
                        className={`text-[0.6rem] tracking-[0.22em] uppercase font-medium shrink-0 ${labelColor}`}
                        style={{ fontFamily: "Satoshi, system-ui, sans-serif" }}
                        initial={{ opacity: 0, x: -16 }}
                        animate={sectionInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, ease: EASE }}
                    >
                        Experiences
                    </motion.span>
                    <motion.div
                        className={`flex-1 h-px ${dividerColor}`}
                        initial={{ scaleX: 0, transformOrigin: "left" }}
                        animate={sectionInView ? { scaleX: 1 } : {}}
                        transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
                    />
                </div>

                {/* Headline — word-by-word clip reveal */}
                <h2
                    className={`font-black tracking-[-0.04em] leading-[0.9] mb-[clamp(3rem,5vw,6rem)] ${headlineColor}`}
                    style={{
                        fontFamily: "Satoshi, system-ui, sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(2.8rem, 7vw, 8rem)",
                    }}
                >
                    {(["What", "I"] as const).map((word, i) => (
                        <span
                            key={word}
                            className='inline-block overflow-hidden mr-[0.25em]'
                        >
                            <motion.span
                                className='block'
                                initial={{ y: "110%" }}
                                animate={sectionInView ? { y: 0 } : {}}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.05 + i * 0.1,
                                    ease: EASE,
                                }}
                            >
                                {word}
                            </motion.span>
                        </span>
                    ))}{" "}
                    <span className='inline-block overflow-hidden'>
                        <motion.span
                            className='block'
                            style={{
                                fontFamily:
                                    "var(--font-instrument), Georgia, serif",
                                fontStyle: "italic",
                                fontWeight: 400,
                                color: italicColor,
                            }}
                            initial={{ y: "110%" }}
                            animate={sectionInView ? { y: 0 } : {}}
                            transition={{
                                duration: 0.7,
                                delay: 0.28,
                                ease: EASE,
                            }}
                        >
                            Build
                        </motion.span>
                    </span>
                </h2>

                {/* Service rows */}
                <motion.div
                    className={`border-t ${borderColor}`}
                    initial={{ scaleX: 0, transformOrigin: "left" }}
                    animate={sectionInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                >
                    {SERVICES.map((service, i) => (
                        <ServiceRow
                            key={service.index}
                            service={service}
                            index={i}
                            isOpen={openIndex === i}
                            hasOpenSibling={
                                openIndex !== null && openIndex !== i
                            }
                            onToggle={() =>
                                setOpenIndex(openIndex === i ? null : i)
                            }
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
