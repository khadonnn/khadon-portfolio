"use client";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@/context/theme-context";

function SeaStormHero() {
    const { theme } = useTheme();
    // Tham chiếu tới video đang hiển thị tuỳ theo theme
    const lightVideoRef = useRef<HTMLVideoElement>(null);
    const darkVideoRef = useRef<HTMLVideoElement>(null);

    // Ép video phải chạy ngay khi theme thay đổi, chống lại cơ chế auto-pause của trình duyệt
    useEffect(() => {
        const activeRef =
            theme === "light" ? lightVideoRef : darkVideoRef;

        if (activeRef.current) {
            activeRef.current.play().catch((e) => {
                console.log(
                    "Trình duyệt chặn autoplay, đang chờ tương tác...",
                    e,
                );
            });
        }
    }, [theme]);

    return (
        <div className='fixed inset-0 w-full h-full overflow-hidden z-[-1] bg-[#f8f9fa] dark:bg-black pointer-events-none'>
            {/* --- LIGHT MODE: Video Sea Storm --- */}
            <video
                ref={lightVideoRef}
                key='light-video'
                autoPlay
                loop
                muted
                playsInline
                src='/assets/video_bg/sea-storm.mp4'
                className={`absolute top-0 left-0 w-full h-full object-cover object-[center_75%] transition-opacity duration-700 pointer-events-none ${theme === "light" ? "opacity-100" : "opacity-0"}`}
            />

            {/* Lớp phủ siêu mỏng để làm dịu mắt ở Light mode */}
            <div className='absolute inset-0 bg-white/10 pointer-events-none transition-colors duration-300'></div>

            {/* --- DARK MODE: Video Galaxy nguyên bản --- */}
            <video
                ref={darkVideoRef}
                key='dark-video'
                autoPlay
                loop
                muted
                playsInline
                src='/assets/video_bg/galaxy.mp4'
                className={`absolute top-0 left-0 w-full h-full object-cover object-top transition-opacity duration-700 pointer-events-none ${theme === "dark" ? "opacity-100" : "opacity-0"}`}
            />

            <div className='absolute inset-0 dark:bg-black/5 pointer-events-none transition-colors duration-300'></div>
        </div>
    );
}

export default SeaStormHero;
