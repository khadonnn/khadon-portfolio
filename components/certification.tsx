"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useSectionInView } from "@/lib/hooks";
import SectionHeading from "@/components/section-heading";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { certificates } from "@/lib/data";
const EASE = [0.22, 1, 0.36, 1] as const;
// Wrapper component for scroll animation
function CertificateCard({
    certificate,
    index,
    onOpenModal,
}: {
    certificate: (typeof certificates)[number];
    index: number;
    onOpenModal: (imageUrl: string) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 1", "1.33 1"],
    });
    const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

    return (
        <motion.div
            ref={ref}
            style={{
                scale: scaleProgress,
                opacity: opacityProgress,
            }}
        >
            <CardContainer className='inter-var'>
                <CardBody className='bg-gray-50 relative group/card hover:shadow-purple-500/[0.4] shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.3] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[30rem] h-auto rounded-xl p-6 border'>
                    <CardItem
                        translateZ='50'
                        className='text-xl font-bold text-neutral-600 dark:text-white'
                    >
                        {certificate.title}
                    </CardItem>
                    <CardItem
                        as='p'
                        translateZ='60'
                        className='text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300'
                    >
                        {certificate.description}
                    </CardItem>
                    <CardItem
                        translateZ='100'
                        className='w-full mt-4 cursor-pointer'
                        onClick={() => onOpenModal(certificate.imageSrc)}
                    >
                        <Image
                            src={certificate.imageSrc}
                            height='1000'
                            width='1000'
                            className='h-60 w-full object-cover object-center rounded-xl group-hover/card:shadow-xl'
                            alt={certificate.altText}
                            style={{ aspectRatio: "16/9" }}
                        />
                    </CardItem>
                    <div className='flex justify-end items-center mt-10'>
                        <CardItem
                            translateZ={20}
                            as='a'
                            href={`/certificate/${certificate.slug}`}
                            className='px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-bold cursor-pointer'
                        >
                            🔗 Open Shareable Link
                        </CardItem>
                    </div>
                </CardBody>
            </CardContainer>
        </motion.div>
    );
}

export function Certificate() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const { ref: inViewRef } = useSectionInView("Certificate");
    const sectionInView = useInView(sectionRef, { once: true, margin: "-10%" });
    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    const setSectionRefs = useCallback(
        (node: HTMLElement | null) => {
            sectionRef.current = node;
            inViewRef(node);
        },
        [inViewRef],
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            document.body.style.overflow = open ? "hidden" : "auto";
        }
    }, [open]);

    const handleOpenModal = (imageUrl: string) => {
        setImageSrc(imageUrl);
        setOpen(true);
    };

    return (
        <motion.section
            id='certificate'
            ref={setSectionRefs}
            className='scroll-mt-28'
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.175 }}
        >
            <motion.h2
                initial={{ opacity: 0, y: 32 }}
                animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
                className='font-black text-gray-950 tracking-tighter leading-[0.88] mb-[clamp(3rem,6vw,7rem)] mt-5 dark:text-gray-50'
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
                    Certificates
                </span>
            </motion.h2>
            <div className='flex justify-center gap-5 flex-wrap pb-24'>
                {certificates.map((certificate, index) => (
                    <CertificateCard
                        key={index}
                        certificate={certificate}
                        index={index}
                        onOpenModal={handleOpenModal}
                    />
                ))}
            </div>

            {open && (
                <div
                    className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-lg z-[999]'
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        className='relative w-full h-full max-w-4xl mx-auto p-6'
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className='absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg text-black text-lg hover:bg-gray-200'
                            onClick={() => setOpen(false)}
                        >
                            ❌
                        </button>
                        <Image
                            src={imageSrc}
                            height={1000}
                            width={1000}
                            className='max-w-full max-h-[85vh] rounded-lg shadow-lg object-contain'
                            alt='full-image'
                        />
                    </motion.div>
                </div>
            )}
        </motion.section>
    );
}
