"use client";
import React from "react";
// Đảm bảo bạn import đúng hook lấy theme đang dùng trong dự án
import { useTheme } from "@/context/theme-context";

function GalaxyHero() {
    const { theme } = useTheme();

    return (
        <div className='fixed inset-0 w-full h-full overflow-hidden z-[-1]'>
            {theme === "light" ? (
                /* --- LIGHT MODE: CSS Mesh Gradient + Noise --- */
                <div className='absolute inset-0 w-full h-full bg-[#f8f9fa] overflow-hidden'>
                    {/* Các khối màu (Blobs) được làm nhòe để tạo Gradient mượt mà */}
                    {/* Cục màu Tím/Hồng góc trái trên */}
                    <div className='absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-200/60 rounded-full blur-[120px] mix-blend-multiply'></div>

                    {/* Cục màu Xanh dương góc phải trên */}
                    <div className='absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-200/60 rounded-full blur-[120px] mix-blend-multiply'></div>

                    {/* Cục màu Cam/Hồng đào ở giữa dưới */}
                    <div className='absolute top-[30%] left-[20%] w-[60%] h-[60%] bg-orange-100/30 rounded-full blur-[120px] mix-blend-multiply'></div>

                    {/* Lớp Hạt Nhiễu (Noise) siêu nhẹ bằng SVG */}
                    {/* Dùng mix-blend-overlay để hạt nhiễu ám màu xuống lớp gradient bên dưới */}
                    <div
                        className='absolute inset-0 pointer-events-none opacity-55 dark:opacity-40 mix-blend-multiply'
                        style={{
                            backgroundImage: `url("data:image/svg+xml;utf8,%3Csvg width='420' height='420' viewBox='0 0 420 420' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='n' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='5' stitchTiles='stitch'/%3E%3CfeGaussianBlur stdDeviation='0.35'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E")`,
                            backgroundSize: "420px 420px",
                            backgroundPosition: "center",
                            maskImage:
                                "radial-gradient(ellipse 95% 95% at 50% 50%, black 35%, transparent 85%)",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 95% 95% at 50% 50%, black 35%, transparent 85%)",
                        }}
                    ></div>
                </div>
            ) : (
                /* --- DARK MODE: Video Galaxy nguyên bản --- */
                <video
                    key='dark-video'
                    autoPlay
                    loop
                    muted
                    playsInline
                    src='/assets/video_bg/galaxy.mp4'
                    className='absolute top-0 left-0 w-full h-full object-cover object-top'
                />
            )}

            {/* Lớp phủ chung: Giúp chữ ở Dark Mode dễ đọc hơn (Bỏ comment nếu cần) */}
            <div className='absolute inset-0 dark:bg-black/5 pointer-events-none transition-colors duration-300'></div>
        </div>
    );
}

export default GalaxyHero;
