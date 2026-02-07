"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const Tooltip = ({
    content,
    children,
    containerClassName,
    visible,
    onClose,
}: {
    content: React.ReactNode;
    children: React.ReactNode;
    containerClassName?: string;
    visible?: boolean;
    onClose?: () => void;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [mouse, setMouse] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [height, setHeight] = useState(0);
    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isVisible || !contentRef.current) return;

        const updateHeight = () => {
            if (contentRef.current) setHeight(contentRef.current.scrollHeight);
        };

        updateHeight();

        const observer = new ResizeObserver(() => updateHeight());
        observer.observe(contentRef.current);

        return () => observer.disconnect();
    }, [isVisible, content]);

    const calculatePosition = (mouseX: number, mouseY: number) => {
        if (!contentRef.current || !containerRef.current)
            return { x: mouseX + 12, y: mouseY + 12 };

        const tooltip = contentRef.current;
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const tooltipWidth = 240;
        const tooltipHeight = tooltip.scrollHeight;

        const absoluteX = containerRect.left + mouseX;
        const absoluteY = containerRect.top + mouseY;

        let finalX = mouseX + 12;
        let finalY = mouseY + 12;

        if (absoluteX + 12 + tooltipWidth > viewportWidth)
            finalX = mouseX - tooltipWidth - 12;
        if (absoluteX + finalX < 0) finalX = -containerRect.left + 12;
        if (absoluteY + 12 + tooltipHeight > viewportHeight)
            finalY = mouseY - tooltipHeight - 12;
        if (absoluteY + finalY < 0) finalY = -containerRect.top + 12;

        return { x: finalX, y: finalY };
    };

    const updateMousePosition = (mouseX: number, mouseY: number) => {
        setMouse({ x: mouseX, y: mouseY });
        const newPosition = calculatePosition(mouseX, mouseY);
        setPosition(newPosition);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsVisible(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        updateMousePosition(mouseX, mouseY);
    };

    const handleMouseLeave = () => {
        setMouse({ x: 0, y: 0 });
        setPosition({ x: 0, y: 0 });
        setIsVisible(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isVisible) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        updateMousePosition(mouseX, mouseY);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = touch.clientX - rect.left;
        const mouseY = touch.clientY - rect.top;
        updateMousePosition(mouseX, mouseY);
        setIsVisible(true);
    };

    const handleTouchEnd = () => {
        setTimeout(() => {
            setIsVisible(false);
            setMouse({ x: 0, y: 0 });
            setPosition({ x: 0, y: 0 });
        }, 2000);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (window.matchMedia("(hover: none)").matches) {
            e.preventDefault();
            if (isVisible) {
                setIsVisible(false);
                setMouse({ x: 0, y: 0 });
                setPosition({ x: 0, y: 0 });
            } else {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                updateMousePosition(mouseX, mouseY);
                setIsVisible(true);
            }
        }
    };

    useEffect(() => {
        if (isVisible && contentRef.current) {
            const newPosition = calculatePosition(mouse.x, mouse.y);
            setPosition(newPosition);
        }
    }, [isVisible, height, mouse.x, mouse.y]);

    useEffect(() => {
        if (typeof visible === "boolean") setIsVisible(visible);
    }, [visible]);

    return (
        <div
            ref={containerRef}
            className={cn("relative inline-block", containerClassName)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleClick}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        key={String(isVisible)}
                        initial={{ height: 0, opacity: 1 }}
                        animate={{ height, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                        }}
                        className='absolute z-50 min-w-[15rem] overflow-hidden rounded-md border border-transparent bg-white shadow-sm ring-1 shadow-black/5 ring-black/5 dark:bg-neutral-900 dark:shadow-white/10 dark:ring-white/5'
                        style={{ top: position.y, left: position.x }}
                        onMouseEnter={() => setIsVisible(true)}
                        onMouseLeave={() => setIsVisible(false)}
                    >
                        <div
                            ref={contentRef}
                            className='relative p-2 text-sm text-neutral-600 md:p-4 dark:text-neutral-400'
                        >
                            {onClose && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    className='absolute right-2 top-2 z-50 rounded-sm bg-black/10 px-1.5 py-0.5 text-xs dark:bg-white/10'
                                    aria-label='Close tooltip'
                                >
                                    ×
                                </button>
                            )}
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
