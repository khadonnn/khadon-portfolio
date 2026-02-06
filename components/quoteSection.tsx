"use client";

import React from "react";
import HighlightText from "@/components/ui/highlight-text";

const QuoteSection = () => {
    return (
        <section className='py-20 text-center px-4 scroll-mt-28'>
            <div className='max-w-4xl mx-auto'>
                <blockquote className='text-4xl sm:text-6xl font-bold leading-tight text-gray-700 dark:text-gray-200'>
                    <span className='block mb-3 sm:mb-0'>
                        Talk is{" "}
                        <HighlightText color='#34d399'>cheap.</HighlightText>
                    </span>
                    <span className='block mt-2'>
                        Show me {/* Màu vàng: Điểm nhấn mạnh mẽ */}
                        <HighlightText color='#fde047'>the code.</HighlightText>
                    </span>
                </blockquote>

                <p className='mt-8 text-xl text-gray-500 dark:text-gray-400 italic'>
                    — Linus Torvalds
                </p>
            </div>
        </section>
    );
};

export default QuoteSection;
