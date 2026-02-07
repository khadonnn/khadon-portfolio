"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react"; // Đảm bảo import đúng
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

    // Không cần logic check mobile phức tạp ở đây để render logic,
    // ta xử lý bằng CSS sẽ mượt hơn.

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
                "inline-grid grid-cols-1 items-center justify-items-center",
                className,
            )}
        >
            <AnimatePresence
                mode='popLayout' // Quan trọng: Giúp layout cũ và mới không bị conflict vị trí
                onExitComplete={() => {
                    setIsAnimating(false);
                }}
            >
                <motion.div
                    key={currentWord}
                    initial={{
                        opacity: 0,
                        y: 10, // Giảm khoảng cách bay để đỡ giật trên mobile
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                    }}
                    exit={{
                        opacity: 0,
                        y: -10, // Bay lên ít thôi
                        x: 0, // Đừng bay ngang (x) gây vỡ layout mobile
                        filter: "blur(8px)",
                        scale: 0.9, // Thu nhỏ lại thay vì phóng to để tránh tràn màn hình
                        position: "absolute",
                        zIndex: 0,
                    }}
                    className={cn(
                        // FIX QUAN TRỌNG:
                        // 1. z-10: Để từ mới đè lên từ cũ
                        // 2. whitespace-nowrap: Cấm xuống dòng gây nhảy height
                        // 3. w-max: Đảm bảo container ôm vừa khít chữ
                        "z-10 relative text-left text-neutral-900 dark:text-neutral-100 whitespace-nowrap w-max",
                    )}
                >
                    {/* Render từng ký tự */}
                    {currentWord.split(" ").map((word, wordIndex) => (
                        <motion.span
                            key={word + wordIndex}
                            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                                delay: wordIndex * 0.3,
                                duration: 0.3,
                            }}
                            className='inline-block whitespace-nowrap'
                        >
                            {word.split("").map((letter, letterIndex) => (
                                <motion.span
                                    key={word + letterIndex}
                                    initial={{
                                        opacity: 0,
                                        y: 10,
                                        filter: "blur(8px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                    }}
                                    transition={{
                                        delay:
                                            wordIndex * 0.3 +
                                            letterIndex * 0.05,
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
