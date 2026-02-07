"use client";

import React from "react";
import HighlightText from "@/components/ui/highlight-text";

const QuoteSection = () => {
    return (
        <section className='py-20 text-center px-4 scroll-mt-28'>
            <div className='max-w-4xl mx-auto'>
                {/* Sửa text-5x thành text-5xl */}
                <blockquote className='text-3xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-700 dark:text-gray-200'>
                    <span className='inline-block' style={{ lineHeight: 1.2 }}>
                        Talk is{" "}
                        <HighlightText
                            color='#34d399'
                            className='text-gray-900 dark:text-gray-100 px-2 py-1 rounded-md align-middle'
                        >
                            cheap.
                        </HighlightText>
                    </span>
                    <br />
                    <span
                        className='inline-block mt-2'
                        style={{ lineHeight: 1.2 }}
                    >
                        Show me{" "}
                        <HighlightText
                            color='#fde047'
                            className='text-gray-900 dark:text-gray-100 px-2 py-1 rounded-md align-middle'
                        >
                            the code.
                        </HighlightText>
                    </span>
                </blockquote>

                <p className='mt-6 md:mt-8 text-lg md:text-xl text-gray-500 dark:text-gray-400 italic'>
                    — Linus Torvalds
                </p>
            </div>
        </section>
    );
};

export default QuoteSection;
