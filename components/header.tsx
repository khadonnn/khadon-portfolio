"use client";

import React from "react";
import { links } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";
import { usePathname } from "next/navigation";
import { useLoading } from "@/context/loading-context";

export default function Header() {
    const { activeSection, setActiveSection, setTimeOfLastClick } =
        useActiveSectionContext();
    const pathname = usePathname();
    const { isContentVisible } = useLoading();

    // Ẩn header khi ở projects page
    if (pathname?.startsWith("/projects")) {
        return null;
    }

    // Ẩn header khi ở certificate page
    if (pathname?.startsWith("/certificate/")) {
        return null;
    }

    return (
        <header
            className={clsx(
                "z-[999] relative transition-opacity duration-300",
                isContentVisible
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none",
            )}
        >
            <div className='fixed inset-x-0 top-0 h-[4.5rem] rounded-none border border-white border-opacity-40 bg-gray-200 bg-opacity-80 shadow-lg shadow-black/[0.1] backdrop-blur-[0.5rem] sm:left-1/2 sm:top-6 sm:h-[3.25rem] sm:w-[43rem] sm:-translate-x-1/2 sm:rounded-full dark:bg-gray-950 dark:border-gray-700/70 dark:bg-opacity-80'></div>

            <nav className='flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0 '>
                <ul className='flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500 sm:w-[initial] sm:flex-nowrap sm:gap-5'>
                    {links.map((link) => (
                        <li
                            className='h-3/4 flex items-center justify-center relative'
                            key={link.hash}
                        >
                            <Link
                                className={clsx(
                                    "flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition  dark:hover:text-gray-300",
                                    {
                                        "text-gray-950 dark:text-gray-200":
                                            activeSection === link.name,
                                    },
                                )}
                                href={link.hash}
                                onClick={() => {
                                    setActiveSection(link.name);
                                    setTimeOfLastClick(Date.now());
                                }}
                            >
                                {link.name}

                                {link.name === activeSection && (
                                    <span className='bg-gray-100 rounded-full absolute inset-0 -z-10 dark:bg-gray-800'></span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
