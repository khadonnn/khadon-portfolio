"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Wrapper để highlight đồng thời nhiều từ
const HighlightGroup = ({ children }: { children: React.ReactNode }) => {
    const groupRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const el = groupRef.current;
        if (!el) return;
        gsap.set(el, {
            backgroundSize: "100% 0%",
            backgroundPosition: "bottom",
        });
        gsap.to(el, {
            backgroundSize: "100% 100%",
            backgroundPosition: "bottom",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "center 80%",
                end: "center 20%",
                invalidateOnRefresh: true,
                toggleActions: "play none none reverse",
            },
        });
        setTimeout(() => ScrollTrigger.refresh(), 50);
    }, []);

    return (
        <span
            ref={groupRef}
            className='relative inline px-1 mx-1 rounded-sm bg-no-repeat bg-bottom box-decoration-clone'
            style={{
                backgroundImage: `linear-gradient(to right, #fcd34d, #fcd34d)`,
                backgroundPosition: "bottom",
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
            }}
        >
            {children}
        </span>
    );
};

export default HighlightGroup;
