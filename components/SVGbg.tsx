"use client";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const SVGbg = () => {
    const pathRef = useRef<SVGPathElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [strokeWidth, setStrokeWidth] = useState(10);

    useEffect(() => {
        const updateStrokeWidth = () => {
            setStrokeWidth(window.innerWidth < 640 ? 2 : 5);
        };

        updateStrokeWidth();
        window.addEventListener("resize", updateStrokeWidth);

        return () => window.removeEventListener("resize", updateStrokeWidth);
    }, []);

    useLayoutEffect(() => {
        const path = pathRef.current;
        const container = containerRef.current;
        if (!path || !container) return;

        const pathLength = path.getTotalLength();

        // Reset nét vẽ về trạng thái ẩn ban đầu
        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
        });

        try {
            path.style.visibility = "visible";
        } catch (e) {
            // ignore
        }

        const parent = container.parentElement as HTMLElement | null;
        const triggerEl = parent || container;

        const updateContainerHeight = () => {
            try {
                const h =
                    triggerEl.scrollHeight ||
                    triggerEl.clientHeight ||
                    document.documentElement.clientHeight;
                container.style.height = `${h}px`;
            } catch (e) {}
        };

        setTimeout(() => {
            updateContainerHeight();
        }, 100);

        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined" && parent) {
            ro = new ResizeObserver(() => {
                // Debounce resize updates
                setTimeout(updateContainerHeight, 50);
            });
            ro.observe(parent);
        } else {
            window.addEventListener("resize", updateContainerHeight);
        }

        let ctx = gsap.context(() => {
            setTimeout(() => {
                const isMobile = window.innerWidth < 768;
                gsap.to(path, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        id: "svg-bg-draw",
                        trigger: triggerEl,
                        start: isMobile ? "top 70%" : "top 60%",
                        end: isMobile ? "bottom 70%" : "bottom 80%",
                        scrub: isMobile ? 1 : 1, // Set to 1 for both to check
                        invalidateOnRefresh: true,
                    },
                });

                // Refresh sau khi init
                ScrollTrigger.refresh();
            }, 200);
        }, containerRef);

        return () => {
            ctx.revert();
            if (ro && parent) ro.disconnect();
            else window.removeEventListener("resize", updateContainerHeight);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className='svg-bg-container z-[-1000]'
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
                overflow: "hidden",
            }}
        >
            <svg
                className='svg-bg'
                viewBox='0 0 1355 2026'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                preserveAspectRatio='none'
                style={{ width: "100%", height: "100%", display: "block" }}
            >
                <path
                    ref={pathRef}
                    className='svg-path'
                    d='M443 0.4953C443 0.4953 0.499985 56.9953 0.5 386.495C0.50002 824.08 1084.5 644.495 1255 990.995C1474.8 1437.69 460 1151 183 1259C-94 1367 44 1628.5 183 1736C439.895 1934.67 1173.03 2047.96 1300.66 2350.07C1493.31 2806.08 -275 2467.49 98 2782.99C288.203 2943.88 588.897 2993.49 588.897 2993.49'
                    stroke='#909090'
                    strokeWidth={strokeWidth}
                    vectorEffect='non-scaling-stroke'
                />
            </svg>
        </div>
    );
};

export default SVGbg;
