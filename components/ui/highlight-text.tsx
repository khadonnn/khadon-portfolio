"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cx from "clsx";

gsap.registerPlugin(ScrollTrigger);

type HighlightTextProps = {
    children: React.ReactNode;
    className?: string;
    color?: string;
};

const HighlightText = ({
    children,
    className,
    color = "#fcd34d",
}: HighlightTextProps) => {
    const elRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const el = elRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            // 1. Reset trạng thái ban đầu - Hiệu ứng từ dưới lên
            gsap.set(el, {
                backgroundSize: "100% 0%",
                backgroundPosition: "bottom",
            });

            // 2. Animation - Trượt từ dưới lên
            gsap.to(el, {
                backgroundSize: "100% 100%",
                backgroundPosition: "bottom", // Giữ anchor ở đáy
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    // Bắt đầu khi center phần tử chạm 80% viewport (chính giữa thấy rõ)
                    start: "center 80%",
                    // Kết thúc khi center phần tử chạm 20% viewport (scroll ngược lên qua đây sẽ ẩn)
                    end: "center 20%",
                    // Recalculate positions when ScrollTrigger refreshes (needed after pinned sections)
                    invalidateOnRefresh: true,


                    // play: Scroll xuống gặp → Hiện (từ dưới lên)
                    // none: Scroll qua xuống → Giữ nguyên
                    // none: Scroll ngược lại thấy → Giữ nguyên
                    // reverse: Scroll lên qua (vượt 20%) → Ẩn đi
                    toggleActions: "play none none reverse",
                },
            });

            // Force a refresh after layout/pinning settles (hero pin may change layout later)
            // small timeout so refresh runs after other init code (and after hero init if it runs)
            setTimeout(() => ScrollTrigger.refresh(), 50);
        }, el);

        return () => ctx.revert();
    }, []);

    return (
        <span
            ref={elRef}
            className={cx(
                "relative inline px-1 mx-1 rounded-sm bg-no-repeat bg-bottom box-decoration-clone",
                className,
            )}
            style={{
                backgroundImage: `linear-gradient(to right, ${color}, ${color})`,
                backgroundPosition: "bottom",
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
            }}
        >
            {children}
        </span>
    );
};

export default HighlightText;
