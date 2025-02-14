"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useSectionInView } from "@/lib/hooks";
import SectionHeading from "@/components/section-heading";
import { motion } from "framer-motion";
import { certificates } from "@/lib/data";
import { useRouter } from "next/navigation";
export function Certificate() {
    const { ref } = useSectionInView("Certificate");
    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== "undefined") {
            document.body.style.overflow = open ? "hidden" : "auto";
        }
    }, [open]);
    useEffect(() => {
        const handleRouteChange = () => {
            setOpen(false);
        };

        window.addEventListener("popstate", handleRouteChange);
        return () => {
            window.removeEventListener("popstate", handleRouteChange);
        };
    }, []);
    const handleOpenModal = (certificate: { slug: string }) => {
        setOpen(true);
        router.push(`/certificate/${certificate.slug}`);
    };

    return (
        <motion.section
            id='certificate'
            ref={ref}
            className='scroll-mt-28'
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.175 }}
        >
            <SectionHeading>Certificate</SectionHeading>
            <div className='flex justify-center gap-5 flex-wrap pb-24'>
                {certificates.map((certificate, index) => (
                    <CardContainer key={index} className='inter-var'>
                        <CardBody className='bg-gray-50 relative group/card  hover:shadow-purple-500/[0.4] shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.3] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border'>
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
                                onClick={() => handleOpenModal(certificate)}
                            >
                                <Image
                                    src={certificate.imageSrc}
                                    height='1000'
                                    width='1000'
                                    className='h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl'
                                    alt={certificate.altText}
                                />
                            </CardItem>
                            <div className='flex justify-end items-center mt-10'>
                                <CardItem
                                    translateZ={20}
                                    as='button'
                                    className='px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-lg font-bold'
                                    onClick={() => handleOpenModal(certificate)}
                                >
                                    View Detail
                                </CardItem>
                            </div>
                        </CardBody>
                    </CardContainer>
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
