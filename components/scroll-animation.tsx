"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "@/context/loading-context";

gsap.registerPlugin(ScrollTrigger);

// Chỉ bật normalizeScroll nếu thực sự cần thiết, đôi khi nó gây conflict cuộn trên mobile
// ScrollTrigger.normalizeScroll(true);

export default function HeroScrollAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    const { setIsReady, setLoadProgress, setLoadError } = useLoading();

    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const minLoadTimeRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const textElement = textRef.current;

        if (!canvas || !container || !textElement) return;

        const context = canvas.getContext("2d", { alpha: false });
        if (!context) return;

        const frameCount = 120;
        const currentFrame = (index: number) =>
            `/assets/snow/ezgif-frame-${String(index).padStart(3, "0")}.png`;

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

        // ... (Giữ nguyên logic loading batch của bạn ở đây - không thay đổi) ...
        // Mình rút gọn đoạn loading để tập trung vào phần render fix lỗi crop

        // --- LOGIC LOADING START (Giữ nguyên logic cũ của bạn) ---
        const BATCH_SIZE = 15;
        const MIN_LOAD_TIME = 800;
        const REQUIRED_PROGRESS = 0.5;
        let imagesReadyToShow = false;
        let minLoadTimePassed = false;

        const checkAndShowAnimation = () => {
            if (imagesReadyToShow && minLoadTimePassed) {
                setIsReady(true);
            }
        };

        minLoadTimeRef.current = setTimeout(() => {
            minLoadTimePassed = true;
            checkAndShowAnimation();
        }, MIN_LOAD_TIME);

        loadTimeoutRef.current = setTimeout(() => {
            setLoadError(true);
            setIsReady(true);
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
                        const progress = Math.round(
                            (loadedCount / frameCount) * 100,
                        );
                        requestAnimationFrame(() => setLoadProgress(progress));
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
        };
        // --- LOGIC LOADING END ---

        // --- RENDER FIX CHO MOBILE ---
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

                // --- LOGIC SCALE QUAN TRỌNG ---

                // Cách 1: "cover" (Mặc định) - Lấp đầy màn hình, chấp nhận mất hình
                // Cách 2: "contain" - Hiển thị toàn bộ hình, có khoảng đen
                // Cách 3: "hybrid" - Trên mobile zoom out một chút để thấy nhiều hơn

                let scale;
                const imgRatio = img.width / img.height;
                const screenRatio = displayWidth / displayHeight;

                // Logic này giúp mobile (màn hình dọc) hiển thị được nhiều nội dung ngang hơn 1 chút
                // so với mặc định, bằng cách cho phép ảnh nhỏ hơn height màn hình 1 chút nếu cần
                // hoặc bạn có thể giữ nguyên Math.max để fill toàn bộ.

                scale = Math.max(
                    displayWidth / img.width,
                    displayHeight / img.height,
                );

                // Tính toán vị trí trung tâm
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

                // Gradient Overlay (Giúp che khuyết điểm nếu ảnh bị vỡ hạt)
                const radius = Math.max(displayWidth, displayHeight) * 0.4;
                const gradient = context.createRadialGradient(
                    displayWidth / 2,
                    displayHeight / 2,
                    0, // Tâm giữa màn hình
                    displayWidth / 2,
                    displayHeight / 2,
                    radius * 2,
                );
                // Đảo ngược gradient một chút để tập trung vào giữa
                // Gradient cũ của bạn ở góc phải dưới, mình giữ nguyên nhé:
                const gradOld = context.createRadialGradient(
                    displayWidth,
                    displayHeight,
                    0,
                    displayWidth,
                    displayHeight,
                    Math.max(displayWidth, displayHeight) * 0.5,
                );
                gradOld.addColorStop(0, `rgba(249, 250, 251, 0.9)`);
                gradOld.addColorStop(1, `rgba(249, 250, 251, 0)`);

                context.fillStyle = gradOld;
                context.fillRect(0, 0, displayWidth, displayHeight);
            });
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
                    end: "+=2000",
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

            // Animation Timeline (Giữ nguyên)
            tl.to(canvas, {
                opacity: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power2.out",
            });
            tl.fromTo(
                textElement,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1 },
                "<",
            );
            tl.to(textElement, { opacity: 0, y: -50, duration: 1 }, ">");
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
            tl.to(
                canvas,
                {
                    opacity: 0.1,
                    filter: "blur(10px)",
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

        // Thêm listener cho orientation change (xoay màn hình)
        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", () =>
            setTimeout(handleResize, 100),
        );

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
            ScrollTrigger.getAll().forEach((t) => t.kill());
            if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
            if (minLoadTimeRef.current) clearTimeout(minLoadTimeRef.current);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            // SỬA: my-0 cho mobile, my-[10rem] cho desktop
            // SỬA: h-[100dvh] để fix lỗi thanh địa chỉ trình duyệt mobile
            className='relative w-full overflow-hidden my-0 md:my-[10rem]'
            style={{ height: "100dvh" }}
        >
            <div className='absolute inset-0 w-full h-full'>
                <canvas
                    ref={canvasRef}
                    className='w-full h-full object-cover'
                    style={{
                        pointerEvents: "none",
                        opacity: 0.1,
                        filter: "blur(10px)",
                        willChange: "opacity, transform, filter",
                        transform: "translateZ(0)",
                    }}
                />
            </div>

            <div
                ref={textRef}
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full px-4'
                style={{ opacity: 0 }}
            >
                {/* SỬA: Giảm kích thước chữ một chút trên mobile (text-3xl) */}
                <h2 className='text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-2'>
                    Scroll to experience
                </h2>
            </div>
        </section>
    );
}
