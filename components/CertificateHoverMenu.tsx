"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { certificates } from "@/lib/data";

// Định nghĩa kiểu dữ liệu cho Certificate
interface Certificate {
    title: string;
    description: string;
    imageSrc: string;
    slug: string;
    altText: string;
}

// Small wrapper component that mounts portal content only after client mount
function PortalMountControl({
    isMenuOpen,
    buttonRef,
    hamburgerLine1Ref,
    hamburgerLine2Ref,
    hamburgerLine3Ref,
    rippleRef,
    handleButtonMouseEnter,
    handleButtonMouseLeave,
    toggleMenu,
}: any) {
    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <>
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                onMouseEnter={handleButtonMouseEnter}
                onMouseLeave={handleButtonMouseLeave}
                className={`pointer-events-auto w-14 h-14 bg-white/5 dark:bg-white/6 border-2 border-white/10 hover:border-white/20 rounded-full shadow-lg flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group relative overflow-hidden ${
                    isMenuOpen ? "ring-4 ring-blue-500" : ""
                }`}
                style={{
                    position: "fixed",
                    top: 32,
                    right: 32,
                    left: "auto",
                    transform: "none",
                    zIndex: 9999,
                }}
                aria-label='Toggle Certificate Menu'
            >
                <div
                    ref={rippleRef}
                    className='absolute w-32 h-32 bg-white/10 dark:bg-white/6 rounded-full pointer-events-none'
                    style={{ display: "none" }}
                />
                <div
                    ref={hamburgerLine1Ref}
                    className='w-6 h-0.5 bg-white/90 rounded-full transition-all relative z-10'
                />
                <div
                    ref={hamburgerLine2Ref}
                    className='w-6 h-0.5 bg-white/70 rounded-full transition-all relative z-10'
                />
                <div
                    ref={hamburgerLine3Ref}
                    className='w-6 h-0.5 bg-white/90 rounded-full transition-all relative z-10'
                />
            </button>

            {/* Backdrop removed — menu will no longer dim page */}
        </>,
        document.body,
    );
}

// Clip paths cho các variant
const clipPaths = {
    "variant-1": "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    "variant-2": "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
    "variant-3": "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
};

const openClipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

// Transform variants cho text elements
const variantTransforms = {
    "variant-1": {
        title: { x: 75, opacity: 0 },
        tags: { y: -75, opacity: 0 },
        description: { x: -75, opacity: 0 },
    },
    "variant-2": {
        title: { x: -75, opacity: 0 },
        tags: { y: -75, opacity: 0 },
        description: { y: 75, opacity: 0 },
    },
    "variant-3": {
        title: { x: 75, opacity: 0 },
        tags: { y: 75, opacity: 0 },
        description: { x: 75, opacity: 0 },
    },
};

export default function CertificateHoverMenu() {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isMouseOverItem, setIsMouseOverItem] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const previewBgRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const tagsRef = useRef<HTMLDivElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const menuContainerRef = useRef<HTMLDivElement>(null);
    const hamburgerLine1Ref = useRef<HTMLDivElement>(null);
    const hamburgerLine2Ref = useRef<HTMLDivElement>(null);
    const hamburgerLine3Ref = useRef<HTMLDivElement>(null);
    const imageAnimationRef = useRef<gsap.core.Tween | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleRef = useRef<HTMLDivElement>(null);

    // Setup initial state
    useGSAP(
        () => {
            gsap.set(previewBgRef.current, {
                clipPath: clipPaths["variant-1"],
            });

            // Setup menu: ẩn ban đầu
            if (menuContainerRef.current) {
                gsap.set(menuContainerRef.current, {
                    x: "100%",
                });
            }

            // Setup certificate items: ẩn ban đầu
            const items =
                containerRef.current?.querySelectorAll(".certificate-item");
            if (items) {
                gsap.set(items, {
                    y: 30,
                    opacity: 0,
                });
            }
        },
        { scope: containerRef },
    );

    // Get variant for each certificate
    const getVariant = (
        index: number,
    ): "variant-1" | "variant-2" | "variant-3" => {
        const variants: Array<"variant-1" | "variant-2" | "variant-3"> = [
            "variant-1",
            "variant-2",
            "variant-3",
        ];
        return variants[index % 3];
    };

    // Apply variant styles to text elements
    const applyVariantStyles = (
        variant: "variant-1" | "variant-2" | "variant-3",
    ) => {
        const transforms = variantTransforms[variant];

        if (titleRef.current) {
            gsap.set(titleRef.current, transforms.title);
        }
        if (tagsRef.current) {
            gsap.set(tagsRef.current, transforms.tags);
        }
        if (descriptionRef.current) {
            gsap.set(descriptionRef.current, transforms.description);
        }
    };

    // Get default clip path for preview element
    const getDefaultClipPath = (
        variant: "variant-1" | "variant-2" | "variant-3",
    ) => {
        return clipPaths[variant];
    };

    // Change background image
    const changeBg = (
        newImgSrc: string,
        variant: "variant-1" | "variant-2" | "variant-3",
    ) => {
        if (!previewBgRef.current) return;

        // Hủy animation đang chạy nếu có
        if (imageAnimationRef.current) {
            imageAnimationRef.current.kill();
        }

        // Remove all old images first
        const existingImages = previewBgRef.current.querySelectorAll("img");
        existingImages.forEach((img) => img.remove());

        // Create new image element
        const newImg = document.createElement("img");
        newImg.src = newImgSrc;
        newImg.style.position = "absolute";
        newImg.style.top = "0";
        newImg.style.left = "0";
        newImg.style.width = "100%";
        newImg.style.height = "100%";
        newImg.style.objectFit = "cover";
        newImg.style.opacity = "0";

        previewBgRef.current.appendChild(newImg);

        // Animate new image in
        imageAnimationRef.current = gsap.to(newImg, {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
        });

        // Animate clip path
        gsap.to(previewBgRef.current, {
            clipPath: openClipPath,
            duration: 1,
            ease: "power3.inOut",
        });

        // Animate text elements
        const transforms = variantTransforms[variant];
        const tl = gsap.timeline();

        tl.to([titleRef.current, tagsRef.current, descriptionRef.current], {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
        });
    };

    // Xử lý khi hover vào
    const handleMouseEnter = (certificate: Certificate, index: number) => {
        // Chỉ hiện preview khi menu đang mở
        if (!isMenuOpen) return;

        setIsMouseOverItem(true);
        const variant = getVariant(index);

        // Apply initial variant styles
        applyVariantStyles(variant);

        // Change background
        changeBg(certificate.imageSrc, variant);

        setActiveIndex(index);
    };

    // Xử lý khi hover ra
    const handleMouseLeave = () => {
        setIsMouseOverItem(false);
        const variant = getVariant(activeIndex);

        // Reset clip path
        gsap.to(previewBgRef.current, {
            clipPath: getDefaultClipPath(variant),
            duration: 1,
            ease: "power3.inOut",
        });

        // Reset text elements
        const transforms = variantTransforms[variant];
        gsap.to([titleRef.current, tagsRef.current, descriptionRef.current], {
            ...transforms.title,
            ...transforms.tags,
            ...transforms.description,
            duration: 1,
            ease: "power3.in",
        });
    };

    // Handle click
    const handleClick = (slug: string) => {
        router.push(`/certificate/${slug}`);
    };

    // Handle button hover with GSAP fill
    const handleButtonMouseEnter = (e: React.MouseEvent) => {
        if (!buttonRef.current || !rippleRef.current) return;

        const button = buttonRef.current;
        const ripple = rippleRef.current;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.killTweensOf(ripple);

        gsap.set(ripple, {
            top: y,
            left: x,
            transform: "translate(-50%, -50%) scale(0)",
            opacity: 0.3,
            display: "block",
        });

        gsap.to(ripple, {
            scale: 3,
            duration: 0.8,
            ease: "power2.out",
        });
    };

    const handleButtonMouseLeave = () => {
        if (!rippleRef.current) return;
        gsap.to(rippleRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power3.out",
        });
    };

    // Toggle menu với hamburger animation
    const toggleMenu = () => {
        const newState = !isMenuOpen;
        setIsMenuOpen(newState);

        // Animate menu container
        gsap.to(menuContainerRef.current, {
            x: newState ? "0%" : "100%",
            duration: 0.8,
            ease: "power3.inOut",
        });

        // Animate certificate items với stagger effect
        const items =
            containerRef.current?.querySelectorAll(".certificate-item");
        if (items) {
            if (newState) {
                // Mở menu: items trượt lên từ dưới
                gsap.to(items, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.08, // Mỗi item cách nhau 0.08s
                    ease: "power3.out",
                    delay: 0.3, // Delay sau khi menu đã slide vào
                });
            } else {
                // Đóng menu: items trượt xuống
                gsap.to(items, {
                    y: 30,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power3.in",
                });
            }
        }

        // Animate hamburger thành X
        if (newState) {
            // Biến thành X
            gsap.to(hamburgerLine1Ref.current, {
                rotation: 45,
                y: 8,
                duration: 0.3,
                ease: "power2.inOut",
            });
            gsap.to(hamburgerLine2Ref.current, {
                opacity: 0,
                duration: 0.2,
                ease: "power2.inOut",
            });
            gsap.to(hamburgerLine3Ref.current, {
                rotation: -45,
                y: -8,
                duration: 0.3,
                ease: "power2.inOut",
            });
        } else {
            // Trở về hamburger
            gsap.to(hamburgerLine1Ref.current, {
                rotation: 0,
                y: 0,
                duration: 0.3,
                ease: "power2.inOut",
            });
            gsap.to(hamburgerLine2Ref.current, {
                opacity: 1,
                duration: 0.2,
                ease: "power2.inOut",
            });
            gsap.to(hamburgerLine3Ref.current, {
                rotation: 0,
                y: 0,
                duration: 0.3,
                ease: "power2.inOut",
            });
        }
    };

    // Chỉ hiện menu khi ở trang certificate
    const isOnCertificatePage = pathname?.startsWith("/certificate");

    if (!isOnCertificatePage) return null;

    return (
        <div
            ref={containerRef}
            className='fixed inset-0 z-50 pointer-events-none'
        >
            {/* --- NÚT HAMBURGER MENU (portal to body so fixed positioning can't be affected) --- */}
            {/* Portal is mounted only after client mount to avoid hydration mismatch */}
            {typeof document !== "undefined" && (
                <PortalMountControl
                    isMenuOpen={isMenuOpen}
                    buttonRef={buttonRef}
                    hamburgerLine1Ref={hamburgerLine1Ref}
                    hamburgerLine2Ref={hamburgerLine2Ref}
                    hamburgerLine3Ref={hamburgerLine3Ref}
                    rippleRef={rippleRef}
                    handleButtonMouseEnter={handleButtonMouseEnter}
                    handleButtonMouseLeave={handleButtonMouseLeave}
                    toggleMenu={toggleMenu}
                />
            )}

            {/* --- BACKDROP OVERLAY --- */}
            {/* BACKDROP is moved into portal for consistent stacking (see PortalMountControl) */}

            {/* --- PREVIEW CONTAINER (Bên trái) --- */}
            <div
                className='absolute inset-0 flex items-center justify-start pl-16 pointer-events-none transition-opacity duration-300'
                style={{
                    opacity: isMenuOpen && isMouseOverItem ? 1 : 0,
                    visibility:
                        isMenuOpen && isMouseOverItem ? "visible" : "hidden",
                }}
            >
                <div
                    ref={previewBgRef}
                    className='relative w-[55vw] h-[75vh] max-w-4xl overflow-hidden rounded-2xl shadow-2xl'
                    style={{
                        clipPath: clipPaths["variant-1"],
                    }}
                >
                    {/* Initial image */}
                    <img
                        src={certificates[0].imageSrc}
                        alt={certificates[0].title}
                        className='absolute inset-0 w-full h-full object-cover'
                        style={{
                            opacity: 0,
                            filter: "brightness(0.6) contrast(1.05) saturate(0.98)",
                        }}
                    />

                    {/* Text overlay */}
                    <div className='absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none'>
                        <h2
                            ref={titleRef}
                            className='text-white text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl'
                            style={{ opacity: 0 }}
                        >
                            {certificates[activeIndex]?.title}
                        </h2>

                        <div
                            ref={tagsRef}
                            className='flex gap-2 mb-4'
                            style={{ opacity: 0 }}
                        >
                            <span className='px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium'>
                                Certificate
                            </span>
                            <span className='px-4 py-2 bg-blue-500/30 backdrop-blur-sm rounded-full text-white text-sm font-medium'>
                                {activeIndex + 1} / {certificates.length}
                            </span>
                        </div>

                        <p
                            ref={descriptionRef}
                            className='text-gray-200 text-lg max-w-2xl drop-shadow-lg'
                            style={{ opacity: 0 }}
                        >
                            {certificates[activeIndex]?.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- MENU LIST (Bên phải) --- */}
            <div
                ref={menuContainerRef}
                className='absolute right-0 top-0 h-full flex items-center'
                style={{
                    transform: "translateX(100%)",
                    pointerEvents: isMenuOpen ? "auto" : "none",
                }}
            >
                <div
                    className={`bg-gradient-to-l from-black/95 via-black/90 to-black/60 backdrop-blur-sm px-6 py-12 h-full flex flex-col justify-center min-w-[320px] transition-shadow duration-300 ${
                        isMenuOpen
                            ? "border-l border-white/10 shadow-2xl"
                            : "shadow-none"
                    }`}
                >
                    {/* Header */}
                    <div className='mb-8 border-b border-white/20 pb-4'>
                        <h3 className='text-white/60 text-xs uppercase tracking-widest mb-2'>
                            Selected Works
                        </h3>
                        <p className='text-white text-2xl font-bold'>
                            My Certificates
                        </p>
                    </div>

                    {/* Certificate list */}
                    <div className='space-y-1 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent'>
                        {certificates.map((certificate, index) => {
                            const variant = getVariant(index);
                            const isActive =
                                activeIndex === index && isMouseOverItem;

                            return (
                                <div
                                    key={certificate.slug}
                                    className={`certificate-item group relative border-b border-white/10 py-5 px-4 cursor-pointer transition-all duration-300 ${
                                        isActive
                                            ? "bg-white/10"
                                            : "hover:bg-white/5"
                                    }`}
                                    onMouseEnter={() =>
                                        handleMouseEnter(certificate, index)
                                    }
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() =>
                                        handleClick(certificate.slug)
                                    }
                                >
                                    {/* Indicator */}
                                    <div
                                        className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-500 transition-all duration-300 ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />

                                    {/* Number */}
                                    <div className='flex items-start gap-4'>
                                        <span className='text-white/40 text-sm font-mono mt-1 group-hover:text-white/60 transition-colors'>
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <div className='flex-1'>
                                            <h4 className='text-white text-lg font-semibold mb-1 group-hover:text-blue-400 transition-colors line-clamp-2'>
                                                {certificate.title}
                                            </h4>
                                            <p className='text-white/50 text-sm line-clamp-2 group-hover:text-white/70 transition-colors'>
                                                {certificate.description}
                                            </p>
                                        </div>

                                        {/* Arrow icon */}
                                        <svg
                                            className={`w-5 h-5 text-white/40 transition-all duration-300 ${
                                                isActive
                                                    ? "translate-x-1 text-blue-400"
                                                    : "group-hover:translate-x-1 group-hover:text-white/60"
                                            }`}
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M9 5l7 7-7 7'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer info */}
                    <div className='mt-8 pt-4 border-t border-white/20'>
                        <p className='text-white/40 text-xs'>
                            Hover to preview • Click to view full certificate
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
