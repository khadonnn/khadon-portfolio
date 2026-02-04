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
            setStrokeWidth(window.innerWidth < 640 ? 5 : 10);
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

        // reveal the path only after dash values were set to prevent initial flash
        try {
            path.style.visibility = "visible";
        } catch (e) {
            // ignore
        }

        // Ensure the svg container covers the full scrollable height of the parent (`main`)
        const parent = container.parentElement as HTMLElement | null;
        const triggerEl = parent || container;

        const updateContainerHeight = () => {
            try {
                const h =
                    triggerEl.scrollHeight ||
                    triggerEl.clientHeight ||
                    document.documentElement.clientHeight;
                container.style.height = `${h}px`;
            } catch (e) {
                // ignore
            }
        };

        // Delay initial height calculation
        setTimeout(() => {
            updateContainerHeight();
        }, 100);

        // watch for resizes or content changes
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
            // Delay animation start to ensure other ScrollTriggers are ready
            setTimeout(() => {
                gsap.to(path, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        id: "svg-bg-draw",
                        trigger: triggerEl,
                        // Chỉ bắt đầu khi scroll animation đã qua (about section vào viewport)
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: 1,
                        invalidateOnRefresh: true,
                        // markers: true, // enable for debugging
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
            className='svg-bg-container'
            // Đảm bảo container nằm đúng vị trí tuyệt đối so với cha
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
                // QUAN TRỌNG: preserveAspectRatio="none" buộc SVG co giãn theo đúng chiều cao thẻ cha bất kể tỷ lệ gốc
                preserveAspectRatio='none'
                style={{ width: "100%", height: "100%", display: "block" }}
            >
                <path
                    ref={pathRef}
                    className='svg-path'
                    d='M652.549 0.455826C652.549 0.455826 -53.4957 305.157 3.80881 643.883C76.8007 1075.34 875.041 710.393 1183.1 1042.46C1539.24 1426.35 482.599 1157.96 205.599 1265.96C-71.4007 1373.96 66.5993 1635.46 205.599 1742.96C462.494 1941.63 1195.63 2054.92 1323.26 2357.03C1515.9 2813.04 -252.401 2474.46 120.599 2789.96C310.802 2950.84 611.497 3000.46 611.497 3000.46'
                    stroke='#909090'
                    strokeWidth={strokeWidth}
                    vectorEffect='non-scaling-stroke' // Giữ độ dày nét vẽ không bị méo khi SVG bị kéo giãn
                />
            </svg>
        </div>
    );
};

export default SVGbg;
