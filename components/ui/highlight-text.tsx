"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cx from "clsx";

// Chỉ đăng ký plugin một lần nếu chưa có
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

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

        let ctx: gsap.Context;

        // Thêm setTimeout để đẩy việc khởi tạo xuống cuối hàng đợi render
        // Giúp đảm bảo các element phía trên (Intro, Antigravity...) đã chiếm chỗ xong
        const timer = setTimeout(() => {
            ctx = gsap.context(() => {
                gsap.fromTo(
                    el,
                    {
                        backgroundSize: "100% 0%",
                    },
                    {
                        backgroundSize: "100% 100%",
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse",
                        },
                    },
                );
            }, el);

            // QUAN TRỌNG: Ép GSAP tính toán lại vị trí của toàn bộ ScrollTrigger
            // sau khi component này đã mount xong.
            ScrollTrigger.refresh();
        }, 500); // Tăng delay lên 500ms để đảm bảo layout ổn định

        return () => {
            clearTimeout(timer);
            // Dấu ? để tránh lỗi nếu component unmount trước khi timeout chạy
            ctx?.revert();
        };
    }, []);

    return (
        <span
            ref={elRef}
            className={cx(
                "relative inline px-1 mx-1 rounded-sm bg-no-repeat box-decoration-clone",
                className,
            )}
            style={{
                backgroundImage: `linear-gradient(to right, ${color}, ${color})`,
                backgroundPosition: "bottom left",
                backgroundSize: "100% 0%",
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
                // will-change giúp browser tối ưu render trước
                willChange: "background-size",
            }}
        >
            {children}
        </span>
    );
};

export default HighlightText;
