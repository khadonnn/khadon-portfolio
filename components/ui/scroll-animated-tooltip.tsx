"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tooltip } from "./tooltip-card";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true); // Normalize scroll behavior for smoother mobile experience

export const ScrollAnimatedTooltip = ({
    content,
    children,
    containerClassName,
}: {
    content: string | React.ReactNode;
    children: React.ReactNode;
    containerClassName?: string;
}) => {
    const containerRef = useRef<HTMLSpanElement | null>(null);
    const [visibleOnScroll, setVisibleOnScroll] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const st = ScrollTrigger.create({
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => setVisibleOnScroll(true),
            onEnterBack: () => setVisibleOnScroll(true),
            onLeave: () => setVisibleOnScroll(false),
            onLeaveBack: () => setVisibleOnScroll(false),
        });

        return () => {
            try {
                st.kill();
            } catch (e) {
                // ignore
            }
        };
    }, []);

    return (
        <span ref={containerRef} className={containerClassName}>
            <Tooltip content={content} visible={visibleOnScroll}>
                {children}
            </Tooltip>
        </span>
    );
};
