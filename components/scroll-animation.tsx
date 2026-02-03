"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScrollAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null); // Ref cho chữ
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [loadError, setLoadError] = useState(false);
    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const textElement = textRef.current;

        if (!canvas || !container || !textElement) return;

        const context = canvas.getContext("2d", { alpha: false });
        if (!context) return;

        // --- CẤU HÌNH ---
        const frameCount = 210;
        const currentFrame = (index: number) =>
            `/assets/snow/ezgif-frame-${String(index).padStart(3, "0")}.png`;

        // --- SETUP CANVAS ---
        const setCanvasSize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;

            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.scale(dpr, dpr);
        };
        setCanvasSize();

        // --- PRELOAD ẢNH (BATCH LOADING) ---
        const images: HTMLImageElement[] = [];
        const animationState = { frame: 0 };
        let loadedCount = 0;
        let firstImageLoaded = false;
        let animationInitialized = false;
        let errorCount = 0;
        let lastProgressUpdate = 0;
        const MAX_ERRORS = 30;
        const BATCH_SIZE = 10; // Tải 10 ảnh mỗi lần
        const PROGRESS_UPDATE_THRESHOLD = 5; // Chỉ update UI khi tăng >= 5%

        // Timeout 15s cho môi trường mạng chậm
        loadTimeoutRef.current = setTimeout(() => {
            if (!imagesLoaded && loadedCount < frameCount * 0.3) {
                console.warn("Loading timeout - skipping animation");
                setLoadError(true);
                setImagesLoaded(true);
            }
        }, 15000);

        // Khởi tạo mảng ảnh
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            images.push(img);
        }

        // Optimized render với requestAnimationFrame và fallback
        let renderScheduled = false;
        const render = () => {
            // Debounce render calls
            if (renderScheduled) return;
            renderScheduled = true;

            requestAnimationFrame(() => {
                renderScheduled = false;

                let frameIndex = Math.min(
                    Math.floor(animationState.frame),
                    frameCount - 1,
                );

                // Fallback: Nếu ảnh chưa load, tìm ảnh gần nhất đã load
                let img = images[frameIndex];
                let attempts = 0;
                while (
                    (!img || !img.complete || img.naturalWidth === 0) &&
                    attempts < 10
                ) {
                    frameIndex = Math.max(0, frameIndex - 1);
                    img = images[frameIndex];
                    attempts++;
                }

                if (
                    !context ||
                    !canvas ||
                    !img ||
                    !img.complete ||
                    img.naturalWidth === 0
                )
                    return;

                const displayWidth = window.innerWidth;
                const displayHeight = window.innerHeight;

                context.clearRect(0, 0, displayWidth, displayHeight);

                // Vẽ ảnh Cover
                const scale = Math.max(
                    displayWidth / img.width,
                    displayHeight / img.height,
                );
                const x = displayWidth / 2 - (img.width / 2) * scale;
                const y = displayHeight / 2 - (img.height / 2) * scale;

                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";

                // Sử dụng drawImage với optimization
                try {
                    context.drawImage(
                        img,
                        x,
                        y,
                        img.width * scale,
                        img.height * scale,
                    );
                } catch (e) {
                    console.error("Canvas render error:", e);
                    return;
                }

                // Vẽ Watermark (Gradient che góc)
                const radius = Math.max(
                    displayWidth * 0.3,
                    displayHeight * 0.3,
                );
                const gradient = context.createRadialGradient(
                    displayWidth,
                    displayHeight,
                    0,
                    displayWidth,
                    displayHeight,
                    radius,
                );
                gradient.addColorStop(0, `rgba(249, 250, 251, 0.9)`);
                gradient.addColorStop(1, `rgba(249, 250, 251, 0)`);
                context.fillStyle = gradient;
                context.fillRect(
                    displayWidth - radius,
                    displayHeight - radius,
                    radius,
                    radius,
                );
            });
        };

        // Debounced progress update để tránh re-render liên tục
        const updateProgress = () => {
            const progress = Math.round((loadedCount / frameCount) * 100);

            // Chỉ update khi tăng >= 5% để giảm re-render
            if (progress - lastProgressUpdate >= PROGRESS_UPDATE_THRESHOLD) {
                requestAnimationFrame(() => {
                    setLoadProgress(progress);
                });
                lastProgressUpdate = progress;
            }

            // Chỉ cho phép scroll khi load đủ 30% ảnh
            if (loadedCount >= frameCount * 0.3 && !imagesLoaded) {
                setImagesLoaded(true);
                if (loadTimeoutRef.current) {
                    clearTimeout(loadTimeoutRef.current);
                }
            }
        };

        // Load ảnh đầu tiên (Critical)
        images[0].onload = () => {
            firstImageLoaded = true;
            loadedCount++;
            setLoadProgress(1);

            render();

            // Init animation ngay sau ảnh đầu NHƯNG chưa cho scroll
            if (!animationInitialized) {
                animationInitialized = true;
                requestAnimationFrame(() => {
                    initAnimation();
                });
            }
        };

        images[0].onerror = (e) => {
            console.error("Failed to load first image:", e);
            setLoadError(true);
            setImagesLoaded(true);
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
        };

        images[0].src = currentFrame(1);

        // Batch Loading - Ưu tiên load critical frames trước
        const loadImageBatch = async (
            startIndex: number,
            endIndex: number,
            priority = false,
        ) => {
            const promises = [];

            for (let i = startIndex; i < endIndex && i < frameCount; i++) {
                const img = images[i];
                const promise = new Promise<void>((resolve) => {
                    // KHÔNG dùng loading="lazy" - load ngay
                    img.decoding = "async"; // Async decode để không block main thread

                    img.onload = () => {
                        loadedCount++;
                        updateProgress();

                        // Clear timeout khi load đủ 50%
                        if (
                            loadedCount >= frameCount * 0.5 &&
                            loadTimeoutRef.current
                        ) {
                            clearTimeout(loadTimeoutRef.current);
                        }
                        resolve();
                    };
                    img.onerror = (e) => {
                        errorCount++;
                        console.error(`Failed to load image ${i + 1}:`, e);

                        if (errorCount > MAX_ERRORS) {
                            console.error("Too many errors - skipping");
                            setLoadError(true);
                            setImagesLoaded(true);
                            if (loadTimeoutRef.current) {
                                clearTimeout(loadTimeoutRef.current);
                            }
                        }
                        resolve();
                    };
                    img.src = currentFrame(i + 1);
                });
                promises.push(promise);
            }

            await Promise.all(promises);

            // Delay giữa batch thường, không delay cho critical batch
            if (!priority) {
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
        };

        // Load images theo chiến lược: Critical frames trước, sau đó mới batch loading
        const loadAllImages = async () => {
            // Phase 1: Load critical frames (30 ảnh đầu) - KHÔNG delay
            const criticalFrames = Math.min(30, frameCount);
            console.log("Loading critical frames...");
            await loadImageBatch(1, criticalFrames, true);

            // Phase 2: Load phần còn lại theo batch
            console.log("Loading remaining frames...");
            for (let i = criticalFrames; i < frameCount; i += BATCH_SIZE) {
                await loadImageBatch(i, i + BATCH_SIZE, false);
            }

            // Update cuối cùng
            setLoadProgress(100);
        };

        // Bắt đầu load sau 100ms
        setTimeout(() => {
            loadAllImages();
        }, 100);

        // --- ANIMATION CHÍNH (GỘP CẢ ẢNH VÀ CHỮ) ---
        function initAnimation() {
            if (!firstImageLoaded || !canvas || !textElement || !container) {
                console.warn("Animation init skipped - components not ready");
                return;
            }

            try {
                // Kiểm tra xem đã có ScrollTrigger nào chạy chưa
                const existingTriggers = ScrollTrigger.getAll();
                const hasSameTrigger = existingTriggers.some(
                    (t) => t.trigger === container,
                );
                if (hasSameTrigger) {
                    console.warn("Animation already initialized");
                    return;
                }

                // Timeline chính - Tối ưu performance
                const tl = gsap.timeline({
                    scrollTrigger: {
                        id: "hero-scroll-animation",
                        trigger: container,
                        start: "top top",
                        end: "+=4000",
                        scrub: 0.5,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        fastScrollEnd: true, // Tối ưu cho scroll nhanh
                    },
                });

                // 1. Hiện Canvas - Dùng opacity (không trigger layout)
                tl.to(canvas, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                });

                // 2. Chữ "Welcome" xuất hiện - Dùng y thay vì top
                tl.fromTo(
                    textElement,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out",
                    },
                    "<",
                );

                // 3. Chữ "Welcome" biến mất
                tl.to(
                    textElement,
                    {
                        opacity: 0,
                        y: -50,
                        duration: 1,
                        ease: "power2.in",
                    },
                    ">",
                );

                // 4. Chạy Frame ảnh (Chạy suốt quá trình)
                tl.to(
                    animationState,
                    {
                        frame: frameCount - 1,
                        snap: "frame",
                        ease: "none",
                        duration: 10, // Kéo dài để chiếm phần lớn thời gian scroll
                        onUpdate: render,
                    },
                    0,
                ); // Bắt đầu từ thời điểm 0 của timeline

                // 5. Fade out Canvas ở cuối
                tl.to(canvas, { opacity: 0, duration: 1 }, "-=1");
            } catch (error) {
                console.error("Animation init error:", error);
            }
        }

        const handleResize = () => {
            setCanvasSize();
            render();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);

            // Kill specific ScrollTrigger thay vì getAll()
            const trigger = ScrollTrigger.getById("hero-scroll-animation");
            if (trigger) trigger.kill();

            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className='relative w-full overflow-hidden'
            style={{ height: "100vh" }}
        >
            {/* Lớp Canvas nền */}
            <div className='absolute inset-0 w-full h-full'>
                <canvas
                    ref={canvasRef}
                    className='opacity-0 w-full h-full object-cover'
                    style={{
                        pointerEvents: "none",
                        willChange: "opacity, transform",
                        transform: "translateZ(0)", // Force GPU acceleration
                    }}
                />
            </div>

            {/* Lớp Chữ Welcome (Nằm đè lên trên Canvas) */}
            <div
                ref={textRef}
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full px-4'
                style={{
                    opacity: 0,
                    willChange: "opacity, transform",
                    transform: "translate(-50%, -50%) translateZ(0)",
                }}
            >
                <h2 className='text-4xl md:text-4xl font-bold text-white drop-shadow-lg mb-2 bg-black/30 inline-block px-4 py-2 rounded-lg'>
                    Scroll to experience the magic
                </h2>
            </div>

            {/* Loading - Glassmorphism Overlay */}
            {!imagesLoaded && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md'>
                    <div className='flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl'>
                        {/* Spinner Animation */}
                        <div className='relative w-20 h-20'>
                            {/* Outer ring */}
                            <div className='absolute inset-0 rounded-full border-4 border-white/20 dark:border-gray-700/50'></div>
                            {/* Spinning ring */}
                            <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-white dark:border-t-gray-300 animate-spin'></div>
                            {/* Inner pulse */}
                            <div className='absolute inset-2 rounded-full bg-white/20 dark:bg-gray-300/20 animate-pulse'></div>
                        </div>

                        {/* Text */}
                        <div className='text-center'>
                            <p className='text-lg font-semibold text-white drop-shadow-lg mb-1'>
                                {loadError ? "Loading Failed" : "Loading ..."}
                            </p>
                            {!loadError && loadProgress > 0 && (
                                <p className='text-sm text-white/80 dark:text-gray-300'>
                                    {loadProgress}% complete
                                </p>
                            )}
                            {loadError && (
                                <p className='text-xs text-red-300 mt-2 max-w-xs'>
                                    Animation could not be loaded. The page will
                                    continue without it.
                                </p>
                            )}
                        </div>

                        {/* Progress bar */}
                        {!loadError && loadProgress > 0 && (
                            <div className='w-64 h-2 bg-white/20 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm'>
                                <div
                                    className='h-full bg-gradient-to-r from-white to-gray-200 dark:from-gray-300 dark:to-gray-400 transition-all duration-300 ease-out shadow-lg'
                                    style={{ width: `${loadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
