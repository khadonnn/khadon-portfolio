"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "@/context/loading-context";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScrollAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    // Use global loading context
    const { setIsReady, setLoadProgress, setLoadError } = useLoading();

    // Refs
    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const minLoadTimeRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const textElement = textRef.current;

        if (!canvas || !container || !textElement) return;

        const context = canvas.getContext("2d", { alpha: false });
        if (!context) return;

        // --- CẤU HÌNH ---
        const frameCount = 120;
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

        // --- LOGIC LOADING ---
        const images: HTMLImageElement[] = [];
        const animationState = { frame: 0 };

        let loadedCount = 0;
        let lastProgressUpdate = 0;

        // Config Loading
        const BATCH_SIZE = 15;
        const MIN_LOAD_TIME = 800; // 0.8s để user thấy progress animation
        const REQUIRED_PROGRESS = 0.5;

        let imagesReadyToShow = false;
        let minLoadTimePassed = false;

        // --- CHECK ĐIỀU KIỆN ---
        const checkAndShowAnimation = () => {
            if (imagesReadyToShow && minLoadTimePassed) {
                console.log("🚀 Showing animation with BLUR effect.");
                setIsReady(true);
            }
        };

        // --- TIMERS ---
        minLoadTimeRef.current = setTimeout(() => {
            minLoadTimePassed = true;
            checkAndShowAnimation();
        }, MIN_LOAD_TIME);

        loadTimeoutRef.current = setTimeout(() => {
            setLoadError(true);
            setIsReady(true);
        }, 20000);

        // --- RENDER ---
        let renderScheduled = false;
        const render = () => {
            if (renderScheduled) return;
            renderScheduled = true;
            requestAnimationFrame(() => {
                renderScheduled = false;

                let frameIndex = Math.min(
                    Math.floor(animationState.frame),
                    frameCount - 1,
                );
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

                if (!img || !img.complete || img.naturalWidth === 0) return;

                const displayWidth = window.innerWidth;
                const displayHeight = window.innerHeight;
                context.clearRect(0, 0, displayWidth, displayHeight);

                const scale = Math.max(
                    displayWidth / img.width,
                    displayHeight / img.height,
                );
                const x = displayWidth / 2 - (img.width / 2) * scale;
                const y = displayHeight / 2 - (img.height / 2) * scale;

                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";
                context.drawImage(
                    img,
                    x,
                    y,
                    img.width * scale,
                    img.height * scale,
                );

                // Watermark Gradient
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

        // --- BATCH LOADING ---
        const loadImageBatch = async (start: number, end: number) => {
            const promises = [];
            for (let i = start; i < end && i < frameCount; i++) {
                const img = images[i];
                if (!img) continue;

                const p = new Promise<void>((resolve) => {
                    img.onload = () => {
                        loadedCount++;
                        const progress = Math.round(
                            (loadedCount / frameCount) * 100,
                        );

                        // Throttle update với RAF để user thấy được animation
                        requestAnimationFrame(() => {
                            console.log(
                                `Progress: ${progress}% (${loadedCount}/${frameCount})`,
                            );
                            setLoadProgress(progress);
                            lastProgressUpdate = progress;
                        });

                        if (
                            !imagesReadyToShow &&
                            loadedCount >= frameCount * REQUIRED_PROGRESS
                        ) {
                            imagesReadyToShow = true;
                            checkAndShowAnimation();
                        }
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
            await new Promise((r) => setTimeout(r, 20));
        };

        // --- KHỞI CHẠY ---
        for (let i = 0; i < frameCount; i++) {
            images.push(new Image());
        }

        const firstImg = images[0];
        firstImg.onload = () => {
            loadedCount++;
            lastProgressUpdate = 1;
            requestAnimationFrame(() => {
                console.log("First image loaded, progress: 1%");
                setLoadProgress(1);
            });
            render();
            initAnimation();
            loadRest();
        };
        firstImg.src = currentFrame(1);

        const loadRest = async () => {
            await loadImageBatch(1, 15);
            for (let i = 15; i < frameCount; i += BATCH_SIZE) {
                await loadImageBatch(i, i + BATCH_SIZE);
            }
        };

        // --- GSAP ANIMATION (WITH BLUR) ---
        function initAnimation() {
            ScrollTrigger.getAll().forEach(
                (t) => t.trigger === container && t.kill(),
            );

            const tl = gsap.timeline({
                scrollTrigger: {
                    id: "hero-scroll-animation",
                    trigger: container,
                    start: "top top",
                    end: "+=2000",
                    scrub: 0.3,
                    pin: true,
                    invalidateOnRefresh: true,
                    fastScrollEnd: true,
                },
            });

            // 1. Enter: Fade In + UNBLUR (Từ mờ -> Rõ)
            tl.to(canvas, {
                opacity: 1,
                filter: "blur(0px)", // Xóa mờ
                duration: 1,
                ease: "power2.out",
            });

            // 2. Text Animation
            tl.fromTo(
                textElement,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1 },
                "<",
            );

            tl.to(textElement, { opacity: 0, y: -50, duration: 1 }, ">");

            // 3. Image Sequence
            tl.to(
                animationState,
                {
                    frame: frameCount - 1,
                    snap: "frame",
                    ease: "none",
                    duration: 10,
                    onUpdate: render,
                },
                0,
            );

            // 4. Exit: Fade Out + BLUR (Từ rõ -> Mờ)
            tl.to(
                canvas,
                {
                    opacity: 0,
                    filter: "blur(10px)", // Mờ lại khi biến mất
                    duration: 1.5,
                    ease: "power2.in",
                },
                "-=1.5",
            );
        }

        const handleResize = () => {
            setCanvasSize();
            render();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            ScrollTrigger.getAll().forEach((t) => t.kill());
            if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
            if (minLoadTimeRef.current) clearTimeout(minLoadTimeRef.current);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className='relative w-full overflow-hidden my-20'
            style={{ height: "100vh" }}
        >
            <div className='absolute inset-0 w-full h-full'>
                <canvas
                    ref={canvasRef}
                    className='opacity-0 w-full h-full object-cover'
                    style={{
                        pointerEvents: "none",
                        filter: "blur(10px)", // Khởi tạo mờ
                        willChange: "opacity, transform, filter", // Tối ưu GPU
                        transform: "translateZ(0)",
                    }}
                />
            </div>

            <div
                ref={textRef}
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full px-4'
                style={{ opacity: 0 }}
            >
                <h2 className='text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2'>
                    Scroll to experience
                </h2>
            </div>

            {/* LOADING SCREEN */}
        </section>
    );
}
