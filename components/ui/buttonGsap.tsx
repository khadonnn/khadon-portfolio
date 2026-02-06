"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import cx from "clsx";

// 1. CẬP NHẬT STYLES: Chuyển sang tông xám/đen
const styles = {
    base: "font-satoshi rounded-full uppercase py-3 duration-300 relative overflow-hidden cursor-pointer flex items-center justify-center transition-all", // thêm flex center cho chắc chắn
    colors: {
        // Primary: Nền đen chữ trắng (Light) | Nền trắng chữ đen (Dark)
        primary:
            "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 shadow-md",

        // Secondary: Nền trắng chữ đen (Light) | Nền trong suốt viền trắng (Dark)
        secondary:
            "bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 dark:bg-transparent dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800",
    },
    sizes: {
        sm: "px-4 text-sm",
        md: "px-6 text-base",
        lg: "px-8 text-lg",
    },
};

type ButtonProps = {
    children: React.ReactNode;
    color?: keyof typeof styles.colors;
    size?: keyof typeof styles.sizes;
    fullWidth?: boolean;
    onClick?: () => void;
    className?: string;
};

const ButtonGsap: React.FC<ButtonProps> = ({
    children,
    color = "primary",
    size = "md",
    fullWidth = false,
    onClick,
    className,
}) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const rippleRef = useRef<HTMLSpanElement>(null);

    const buttonClass = cx(
        styles.base,
        styles.colors[color],
        styles.sizes[size],
        fullWidth ? "w-full" : "",
        // Xóa compound variants cũ nếu không cần thiết, hoặc sửa lại logic màu nếu muốn
        className,
    );

    const handleMouseEnter = (e: React.MouseEvent) => {
        const button = btnRef.current!;
        const ripple = rippleRef.current!;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.killTweensOf(ripple);

        gsap.set(ripple, {
            top: y,
            left: x,
            transform: "translate(-50%, -50%) scale(0)",
            opacity: 0.2, // Giảm opacity xuống chút cho tinh tế
            display: "block",
        });

        gsap.to(ripple, {
            scale: 3, // Tăng scale để phủ hết nút
            duration: 0.8,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        const ripple = rippleRef.current!;
        gsap.to(ripple, {
            opacity: 0,
            duration: 0.4,
            ease: "power3.out",
        });
    };

    return (
        <button
            ref={btnRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={buttonClass}
        >
            {/* 2. CẬP NHẬT RIPPLE: Đổi màu gợn sóng */}
            {/* Thay bg-green-900 bằng bg-white (cho nút đen) hoặc bg-gray-400 (cho nút trắng) */}
            {/* Dùng mix-blend-mode overlay để nó tự ăn màu đẹp hơn */}
            <span
                ref={rippleRef}
                className='pointer-events-none absolute w-40 h-40 bg-current rounded-full origin-center z-0 opacity-0'
                style={{ display: "none" }}
            />
            <span className='relative z-10'>{children}</span>
        </button>
    );
};

export default ButtonGsap;
