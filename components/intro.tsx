"use client";

import Image from "next/image";
import React from "react";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { FlipWords } from "./ui/flip-words";
import ButtonGsap from "./ui/buttonGsap";

const Intro = () => {
    const { ref } = useSectionInView("Home");
    const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
    const words = ["Next.js", "React", "Full-Stack Dev"];

    // Hàm xử lý khi click vào Contact
    const handleContactClick = () => {
        setActiveSection("Contact");
        setTimeOfLastClick(Date.now());
        const contactSection = document.querySelector("#contact");
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Hàm xử lý download CV
    const handleDownloadClick = () => {
        const link = document.createElement("a");
        link.href = "/Khadon_CV.pdf";
        link.download = "Khadon_CV.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section
            id='home'
            className='relative mb-28 flex min-h-[calc(100dvh-5rem)] max-w-[50rem] flex-col items-center justify-center text-center sm:mb-0 sm:min-h-[calc(100dvh-6rem)] scroll-mt-[100rem]'
            ref={ref}
        >
            <div className='flex items-center justify-center py-10'>
                <div className='relative w-max'>
                    <span
                        className='absolute top-8 left-full text-2xl md:text-4xl font-pencerio font-thin text-gray-900 dark:text-gray-100 z-20 whitespace-nowrap pointer-events-none rotate-[-35deg] -ml-16 -mb-16'
                        style={{
                            textShadow:
                                "0.1px 0 0 currentColor, -0.1px 0 0 currentColor",
                        }}
                    >
                        KhaDonDev
                    </span>

                    <div className='relative z-10'>
                        <Image
                            src={"/avt4.png"}
                            alt='khadon'
                            width={200}
                            height={200}
                            quality={100}
                            priority={true}
                            className='h-28 w-28 rounded-full object-cover border-[0.30rem] border-white shadow-xl dark:border-gray-800 dark:bg-gray-50 dark:bg-opacity-10'
                        />
                    </div>

                    {/* <span className='text-4xl absolute bottom-0 right-0 z-20'>
                        👋
                    </span> */}
                </div>
            </div>

            <h2 className='mb-10 mt-4 px-4 text-xl font-medium !leading-[1.5] sm:text-3xl '>
                <b>Hi, I'm Khadondev.</b> A{" "}
                <b>self-taught Full-stack Developer</b> with more than 1 year of
                hands-on experience, passionate about building <i>web & apps</i>
                .
                <span className='hidden md:inline'>
                    {" "}
                    My focus is{" "}
                    <strong>
                        <FlipWords words={words} />
                    </strong>{" "}
                </span>
                <br />
            </h2>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 px-4 text-lg font-medium'>
                {/* Nút Contact Me */}
                <ButtonGsap
                    onClick={handleContactClick}
                    data-antigravity-target
                    className='bg-gray-900 text-white hover:bg-gray-950 border-none group'
                >
                    <div className='flex items-center gap-2'>
                        Contact me here{" "}
                        <BsArrowRight className='opacity-70 group-hover:translate-x-1 transition' />
                    </div>
                </ButtonGsap>

                {/* Nút Download CV */}
                <ButtonGsap
                    color='secondary'
                    onClick={handleDownloadClick}
                    data-antigravity-target
                    className='bg-white dark:bg-white/10 text-gray-700 dark:text-white/90 border-black/10 dark:border-white/10 group'
                >
                    <div className='flex items-center gap-2'>
                        Download CV{" "}
                        <HiDownload className='opacity-60 group-hover:translate-y-1 transition' />
                    </div>
                </ButtonGsap>

                {/* Các nút icon social */}
                <div className='flex gap-2'>
                    <a
                        className='bg-white p-4 text-gray-700 hover:text-gray-950 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60'
                        href='https://www.linkedin.com/in/kha-nguyen1301/'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <BsLinkedin size={20} />
                    </a>

                    <a
                        className='bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60'
                        href='https://github.com/khadonnn'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <FaGithubSquare size={23} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Intro;
