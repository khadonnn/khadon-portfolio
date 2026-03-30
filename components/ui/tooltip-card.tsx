"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
    const [isMounted, setIsMounted] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setIsMounted(true);

        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

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

        const tooltipWidth = tooltip.offsetWidth || 220;
        const tooltipHeight = tooltip.scrollHeight;

        const absoluteX = containerRect.left + mouseX;
        const absoluteY = containerRect.top + mouseY;

        let finalX = absoluteX + 12;
        let finalY = absoluteY + 12;

        if (finalX + tooltipWidth > viewportWidth)
            finalX = absoluteX - tooltipWidth - 12;
        if (finalX < 0) finalX = 12;
        if (finalY + tooltipHeight > viewportHeight)
            finalY = absoluteY - tooltipHeight - 12;
        if (finalY < 0) finalY = 12;

        return { x: finalX, y: finalY };
    };

    const updateMousePosition = (mouseX: number, mouseY: number) => {
        setMouse({ x: mouseX, y: mouseY });
        const newPosition = calculatePosition(mouseX, mouseY);
        setPosition(newPosition);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
        setIsVisible(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        updateMousePosition(mouseX, mouseY);
    };

    const handleMouseLeave = () => {
        hideTimeoutRef.current = setTimeout(() => {
            setMouse({ x: 0, y: 0 });
            setPosition({ x: 0, y: 0 });
            setIsVisible(false);
        }, 80);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isVisible) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        updateMousePosition(mouseX, mouseY);
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
        if (!isVisible || !isMounted) return;

        const handleOutsidePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            const clickedTrigger = containerRef.current?.contains(target);
            const clickedTooltip = tooltipRef.current?.contains(target);

            if (!clickedTrigger && !clickedTooltip) {
                setIsVisible(false);
                setMouse({ x: 0, y: 0 });
                setPosition({ x: 0, y: 0 });
            }
        };

        document.addEventListener("pointerdown", handleOutsidePointerDown);

        return () => {
            document.removeEventListener(
                "pointerdown",
                handleOutsidePointerDown,
            );
        };
    }, [isVisible, isMounted]);

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
            onClick={handleClick}
        >
            {children}
            {isMounted &&
                createPortal(
                    <AnimatePresence>
                        {isVisible && (
                            <motion.div
                                ref={tooltipRef}
                                key={String(isVisible)}
                                initial={{ height: 0, opacity: 1 }}
                                animate={{ height, opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                }}
                                className='fixed z-[99999] w-max min-w-[11rem] max-w-[14rem] overflow-hidden rounded-md border border-transparent bg-white shadow-sm ring-1 shadow-black/5 ring-black/5 dark:bg-neutral-900 dark:shadow-white/10 dark:ring-white/5 md:max-w-[16rem]'
                                style={{ top: position.y, left: position.x }}
                                onMouseEnter={() => {
                                    if (hideTimeoutRef.current) {
                                        clearTimeout(hideTimeoutRef.current);
                                    }
                                    setIsVisible(true);
                                }}
                                onMouseLeave={() => {
                                    setIsVisible(false);
                                }}
                            >
                                <div
                                    ref={contentRef}
                                    className='relative p-2 text-xs text-neutral-600 md:p-3 md:text-sm dark:text-neutral-400'
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
                    </AnimatePresence>,
                    document.body,
                )}
        </div>
    );
};
