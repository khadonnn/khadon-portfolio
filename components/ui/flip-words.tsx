"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Dùng framer-motion hoặc motion/react tùy setup của bạn
import { cn } from "@/lib/utils";

export const FlipWords = ({
    words,
    duration = 3000,
    className,
}: {
    words: string[];
    duration?: number;
    className?: string;
}) => {
    const [currentWord, setCurrentWord] = useState(words[0]);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    // 1. BỎ HOÀN TOÀN ĐOẠN CHECK MOBILE ĐỂ CHẶN RENDER
    // Ta muốn hiệu ứng chạy trên mọi thiết bị

    const startAnimation = useCallback(() => {
        const word = words[words.indexOf(currentWord) + 1] || words[0];
        setCurrentWord(word);
        setIsAnimating(true);
    }, [currentWord, words]);

    useEffect(() => {
        if (!isAnimating)
            setTimeout(() => {
                startAnimation();
            }, duration);
    }, [isAnimating, duration, startAnimation]);

    return (
        <div
            className={cn(
                "relative inline-block w-max align-top", // Giữ layout ổn định
                className,
            )}
        >
            <AnimatePresence
                mode='popLayout'
                onExitComplete={() => {
                    setIsAnimating(false);
                }}
            >
                <motion.div
                    key={currentWord}
                    // 2. CẤU HÌNH HIỆU ỨNG BLUR VÀ ĐÀN HỒI (SPRING)
                    initial={{
                        opacity: 0,
                        y: 20, // Bay từ dưới lên
                        filter: "blur(8px)", // Mờ khi bắt đầu
                        scale: 0.9,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)", // Hết mờ
                        scale: 1,
                        position: "relative",
                        zIndex: 10,
                    }}
                    exit={{
                        opacity: 0,
                        y: -20, // Bay lên trên
                        filter: "blur(8px)", // Mờ khi biến mất
                        scale: 0.9,
                        position: "absolute", // Tuyệt đối để không đẩy layout
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 0,
                    }}
                    // 3. TINH CHỈNH ĐỘ ĐÀN HỒI (BOUNCY)
                    transition={{
                        type: "spring",
                        stiffness: 150, // Độ cứng lò xo (càng cao càng nảy nhanh)
                        damping: 12, // Độ cản (càng thấp càng rung lắc nhiều)
                        mass: 0.8, // Trọng lượng (nhẹ thì bay nhanh)
                    }}
                    className='inline-block whitespace-nowrap text-left text-neutral-900 dark:text-neutral-100 will-change-transform will-change-filter' // will-change giúp GPU xử lý mượt hơn
                >
                    {/* Render từng ký tự */}
                    {currentWord.split(" ").map((word, wordIndex) => (
                        <motion.span
                            key={word + wordIndex}
                            className='inline-block whitespace-nowrap'
                        >
                            {word.split("").map((letter, letterIndex) => (
                                <motion.span
                                    key={word + letterIndex}
                                    // 4. CHỈ ANIMATE VỊ TRÍ (Y), KHÔNG ANIMATE BLUR Ở LEVEL KÝ TỰ
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay:
                                            wordIndex * 0.2 +
                                            letterIndex * 0.03, // Hiệu ứng sóng nhẹ
                                        duration: 0.2,
                                    }}
                                    className='inline-block'
                                >
                                    {letter}
                                </motion.span>
                            ))}
                            <span className='inline-block'>&nbsp;</span>
                        </motion.span>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
