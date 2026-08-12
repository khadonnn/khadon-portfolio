"use client";

import React, { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "@/context/loading-context";
import { useTheme } from "@/context/theme-context";

gsap.registerPlugin(ScrollTrigger);

// Chỉ bật normalizeScroll nếu thực sự cần thiết, đôi khi nó gây conflict cuộn trên mobile
// ScrollTrigger.normalizeScroll(true);

export default function HeroScrollAnimation({
    children,
}: {
    children?: ReactNode;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    const { theme } = useTheme();
    const isLight = theme === "light";

    const { setIsReady, setLoadProgress, setLoadError } = useLoading();

    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const minLoadTimeRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasMarkedReadyRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const textElement = textRef.current;

        if (!canvas || !container || !textElement) return;

        // Chỉ chạy hiệu ứng scroll ảnh làm background trong LIGHT MODE.
        // Dark mode vẫn hiển thị Intro nhưng không pin ảnh (giữ galaxy nền).
        if (!isLight) {
            ScrollTrigger.getAll().forEach(
                (t) => t.trigger === container && t.kill(),
            );
            return;
        }

        const context = canvas.getContext("2d", { alpha: false });
        if (!context) return;

        // Số frame thực tế trên disk: ezgif-frame-017.png ... ezgif-frame-120.png (104 frame)
        const frameCount = 104;
        const FRAME_OFFSET = 16; // index 1 -> file 017
        const currentFrame = (index: number) =>
            `/assets/snow/ezgif-frame-${String(index + FRAME_OFFSET).padStart(
                3,
                "0",
            )}.png`;

        // --- CẤU HÌNH MOBILE ---
        // Kiểm tra mobile để tối ưu
        const isMobile = window.innerWidth < 768;

        const setCanvasSize = () => {
            // Giới hạn dpr = 1.5 trên mobile để giảm nóng máy
            const dpr = Math.min(
                window.devicePixelRatio || 1,
                isMobile ? 1.5 : 2,
            );
            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;

            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;

            // CSS size
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.scale(dpr, dpr);
        };
        setCanvasSize();

        const images: HTMLImageElement[] = [];
        const animationState = { frame: 0 };
        let loadedCount = 0;

        const finishLoading = () => {
            if (hasMarkedReadyRef.current) return;

            hasMarkedReadyRef.current = true;

            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }

            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
                loadTimeoutRef.current = null;
            }

            if (minLoadTimeRef.current) {
                clearTimeout(minLoadTimeRef.current);
                minLoadTimeRef.current = null;
            }

            setLoadProgress(100);
            setIsReady(true);
        };

        progressIntervalRef.current = setInterval(() => {
            setLoadProgress((prev) => Math.min(95, prev + 4));
        }, 60) as unknown as NodeJS.Timeout;

        // --- LOGIC LOADING START (Giữ nguyên logic cũ của bạn) ---
        const BATCH_SIZE = 15;
        const MIN_LOAD_TIME = 800;

        minLoadTimeRef.current = setTimeout(() => {
            finishLoading();
        }, MIN_LOAD_TIME);

        loadTimeoutRef.current = setTimeout(() => {
            setLoadError(true);
            finishLoading();
        }, 20000);

        // Helper Loading Batch (Giữ nguyên code cũ của bạn)
        const loadImageBatch = async (start: number, end: number) => {
            const promises = [];
            for (let i = start; i < end && i < frameCount; i++) {
                const img = images[i];
                if (!img) continue;
                const p = new Promise<void>((resolve) => {
                    img.onload = () => {
                        loadedCount++;
                        resolve();
                    };
                    img.onerror = () => {
                        loadedCount++;
                        resolve();
                    };
                    img.src = currentFrame(i + 1);
                });
                promises.push(p);
            }
            await Promise.all(promises);
        };
        // --- LOGIC LOADING END ---

        // --- RENDER (tối ưu) ---
        // FIX #2: Bỏ requestAnimationFrame lồng nhau (GSAP tự chạy frame loop).
        // Bỏ hoàn toàn createRadialGradient + fillRect trong vòng render để ảnh
        // không bị "muddy" và giảm tải CPU/GPU. Gradient chuyển sang HTML div overlay.
        const render = () => {
            let frameIndex = Math.min(
                Math.floor(animationState.frame),
                frameCount - 1,
            );
            let img = images[frameIndex];

            // Fallback nếu ảnh lỗi
            let attempts = 0;
            while (
                (!img || !img.complete || img.naturalWidth === 0) &&
                attempts < 10
            ) {
                frameIndex = Math.max(0, frameIndex - 1);
                img = images[frameIndex];
                attempts++;
            }

            if (!img || !img.complete || img.naturalWidth === 0) return;

            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;
            context.clearRect(0, 0, displayWidth, displayHeight);

            // "cover": lấp đầy màn hình, căn giữa
            const scale = Math.max(
                displayWidth / img.width,
                displayHeight / img.height,
            );
            const x = (displayWidth - img.width * scale) / 2;
            const y = (displayHeight - img.height * scale) / 2;

            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";

            context.drawImage(
                img,
                x,
                y,
                img.width * scale,
                img.height * scale,
            );
        };

        // ... Khởi tạo ảnh (Phần này giữ nguyên logic của bạn) ...
        for (let i = 0; i < frameCount; i++) {
            images.push(new Image());
        }
        const firstImg = images[0];
        firstImg.onload = () => {
            loadedCount++;
            render();
            initAnimation();
            // Load các ảnh còn lại
            (async () => {
                await loadImageBatch(1, 15);
                for (let i = 15; i < frameCount; i += BATCH_SIZE) {
                    await loadImageBatch(i, i + BATCH_SIZE);
                }
            })();
        };
        firstImg.src = currentFrame(1);

        function initAnimation() {
            // Kill old triggers
            ScrollTrigger.getAll().forEach(
                (t) => t.trigger === container && t.kill(),
            );

            const tl = gsap.timeline({
                scrollTrigger: {
                    id: "hero-scroll-animation",
                    trigger: container,
                    start: "top top",
                    end: "+=2500",
                    scrub: 0.3,
                    pin: true,
                    // anticipiatePin giúp giảm giật trên mobile
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    fastScrollEnd: true,
                },
            });

            // Refresh để tính toán lại vị trí start/end
            ScrollTrigger.refresh();

            // Timeline UI/UX (tổng duration 10):
            //   0% - 85% : chuỗi ảnh chạy trên canvas (nền hero luôn hiển thị ngay từ load)
            //  15% - 25% : Intro fade-out + di chuyển lên (y: -80) để lộ cảnh
            //  85% -100% : canvas fade-out sang section kế tiếp
            // FIX #3: Intro không fade-in nữa (sẵn opacity: 1, y: 0) mà chỉ fade-out khi scroll.
            tl.to(
                animationState,
                {
                    frame: frameCount - 1,
                    snap: "frame",
                    ease: "none",
                    duration: 8.5,
                    onUpdate: render,
                },
                0,
            );
            tl.to(
                textElement,
                { opacity: 0, y: -80, duration: 1, ease: "power2.in" },
                1.5,
            );
            tl.to(
                canvas,
                { opacity: 0, duration: 1.5, ease: "power2.in" },
                8.5,
            );
        }

        const handleResize = () => {
            setCanvasSize();
            render();
        };

        // Thêm listener cho orientation change (xoay màn hình)
        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", () =>
            setTimeout(handleResize, 100),
        );

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
            ScrollTrigger.getAll().forEach(
                (t) => t.trigger === container && t.kill(),
            );
            if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
            if (minLoadTimeRef.current) clearTimeout(minLoadTimeRef.current);
            if (progressIntervalRef.current)
                clearInterval(progressIntervalRef.current);
        };
    }, [isLight]);

    return (
        <section
            ref={containerRef}
            // FIX #1: Full-bleed tới đỉnh viewport (light mode). -mt đối trọng với
            // pt-20 sm:pt-24 của layout wrapper để không còn "hở" phía trên.
            className={`relative w-full overflow-hidden ${
                isLight ? "-mt-20 sm:-mt-24" : ""
            }`}
            style={isLight ? { height: "100dvh" } : undefined}
        >
            {/* Chỉ hiển thị canvas làm background trong LIGHT MODE */}
            {isLight && (
                <div className='absolute inset-0 w-full h-full'>
                    {/* FIX #2: Bỏ filter blur khỏi canvas để ảnh sắc nét.
                        opacity: 1 để nền ảnh (chuỗi scroll) hiển thị ngay khi load */}
                    <canvas
                        ref={canvasRef}
                        className='w-full h-full object-cover'
                        style={{
                            pointerEvents: "none",
                            opacity: 1,
                            willChange: "opacity, transform",
                            transform: "translateZ(0)",
                        }}
                    />
                </div>
            )}

            {/* FIX #2: Gradient overlay dùng GPU (Tailwind) thay cho drawImage gradient trong render loop */}
            {isLight && (
                <div className='pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/60 via-transparent to-white/80 dark:from-neutral-950/60 dark:via-transparent dark:to-neutral-950/80' />
            )}

            {/* FIX #3: Intro hiện đầy đủ ngay khi load (opacity: 1, y:0), chỉ fade-out khi scroll */}
            <div
                ref={textRef}
                className={`${
                    isLight ? "absolute inset-0" : "relative"
                } z-20 flex w-full items-center justify-center px-4`}
                style={{ opacity: 1 }}
            >
                {children}
            </div>
        </section>
    );
}
