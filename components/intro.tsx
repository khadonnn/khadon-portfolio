"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaGithubSquare } from "react-icons/fa";
import Link from "next/link";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { FlipWords } from "./ui/flip-words";
const Intro = () => {
    const { ref } = useSectionInView("Home");
    const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
    const words = ["Next.js", "React", "Full-Stack Dev"];
    return (
        <section
            id='home'
            className='mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]'
            ref={ref}
        >
            <div className='flex items-center justify-center'>
                <div className='relative'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            duration: 0.8,
                        }}
                    >
                        <Image
                            src={"/avt4.png"}
                            alt='khadon'
                            width={200}
                            height={200}
                            quality={100}
                            priority={true}
                            className='h-28 w-28 rounded-full object-cover border-[0.30rem] border-white shadow-xl dark:border-gray-800 dark:bg-gray-50 dark:bg-opacity-10'
                        />
                    </motion.div>
                    <motion.span
                        className='text-4xl absolute bottom-0 right-0'
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: "tween",
                            duration: 0.2,
                            ease: "easeOut",
                        }}
                    >
                        👋
                    </motion.span>
                </div>
            </div>
            <motion.h2
                className='mb-10 mt-4 px-4 text-xl font-medium !leading-[1.5] sm:text-3xl '
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <span className='font-bold'>Hello, I'm Khadon.</span> I'm a{" "}
                <span className='font-bold'>full-stack developer</span> with{" "}
                <span className='font-bold'>8 months</span> of experience. I
                enjoy building <span className='italic'>websites & apps</span>.
                My focus is{" "}
                <strong>
                    <FlipWords words={words} />
                </strong>{" "}
                <br />
            </motion.h2>
            <motion.div
                className='flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium'
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.1,
                }}
            >
                <Link
                    href='#contact'
                    className='group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition'
                    onClick={() => {
                        setActiveSection("Contact");
                        setTimeOfLastClick(Date.now());
                    }}
                >
                    Contact me here{" "}
                    <BsArrowRight className='opacity-70 group-hover:translate-x-1 transition' />{" "}
                </Link>
                <a
                    href='/Khadon_CV.pdf'
                    download={true}
                    className='group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10'
                >
                    Download CV{" "}
                    <HiDownload className='opacity-60 group-hover:translate-y-1 transition' />
                </a>
                <a
                    className='bg-white p-4 text-gray-700 hover:text-gray-950 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60'
                    href='https://www.linkedin.com/in/kha-nguyen1301/'
                    target='_blank'
                >
                    <BsLinkedin />
                </a>
                <a
                    className='bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60'
                    href='https://github.com/khadonnn'
                    target='_blank'
                >
                    <FaGithubSquare />
                </a>
            </motion.div>
        </section>
    );
};

export default Intro;
