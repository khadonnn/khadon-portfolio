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
            // Dùng fromTo để đảm bảo trạng thái ổn định nhất trên mobile
            gsap.fromTo(
                el,
                {
                    backgroundSize: "100% 0%", // Bắt đầu: 0% chiều cao (ẩn)
                },
                {
                    backgroundSize: "100% 100%", // Kết thúc: 100% chiều cao (hiện full)
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", // Hiện khi mép trên chữ chạm 85% màn hình
                        end: "top 20%", // Vùng kết thúc

                        // QUAN TRỌNG: Bỏ invalidateOnRefresh để tránh giật khi thanh địa chỉ co giãn
                        // invalidateOnRefresh: true, // <-- Đã xóa dòng này

                        // play: Cuộn xuống gặp -> Chạy hiệu ứng
                        // none: Cuộn qua luôn -> Giữ nguyên
                        // none: Cuộn ngược lại vào vùng nhìn thấy -> Giữ nguyên (không chạy lại)
                        // reverse: Cuộn ngược lên quá khỏi chữ -> Thu lại (ẩn đi)
                        toggleActions: "play none none reverse",
                    },
                },
            );
        }, el);

        return () => ctx.revert();
    }, []);

    return (
        <span
            ref={elRef}
            className={cx(
                "relative inline px-1 mx-1 rounded-sm bg-no-repeat box-decoration-clone",
                className,
            )}
            style={{
                // Setup CSS ban đầu
                backgroundImage: `linear-gradient(to right, ${color}, ${color})`,

                // QUAN TRỌNG: bottom left để neo màu ở đáy -> Nó sẽ mọc lên trên
                backgroundPosition: "bottom left",

                backgroundSize: "100% 0%", // Mặc định ẩn
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
                willChange: "background-size", // Báo trước cho trình duyệt mobile để render mượt hơn
            }}
        >
            {children}
        </span>
    );
};

export default HighlightText;
