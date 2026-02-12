"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tooltip } from "./tooltip-card";

gsap.registerPlugin(ScrollTrigger);
// ScrollTrigger.normalizeScroll(true); // Temporarily disabled to check scroll performance

export const ScrollAnimatedTooltip = ({
    content,
    children,
    containerClassName,
}: {
    content: string | React.ReactNode;
    children: React.ReactNode;
    containerClassName?: string;
}) => {
    // 1. Dùng state để quản lý việc hover
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            className={containerClassName}
            // 2. Thêm sự kiện hover
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 3. Truyền biến visible dựa trên hover */}
            <Tooltip content={content} visible={isHovered}>
                {children}
            </Tooltip>
        </span>
    );
};
