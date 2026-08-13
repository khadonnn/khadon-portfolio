"use client";

import React, { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "@/context/loading-context";
import { useTheme } from "@/context/theme-context";

gsap.registerPlugin(ScrollTrigger);

// Cache ảnh frame ở MODULE SCOPE (dùng chung cho mọi lần mount / đổi theme).
// Khi chuyển dark -> light, effect chạy lại nhưng các HTMLImageElement này đã
// được load & decode sẵn => KHÔNG tải lại ảnh, dựng animation tức thì.
const scrollFrameCache = new Map<string, HTMLImageElement>();

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
    const overlayRef = useRef<HTMLDivElement>(null);

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

        // WEBP frames trên disk: frame-012.webp ... frame-080.webp (69 frame)
        const frameCount = 69;
        const FRAME_OFFSET = 11; // index 1 -> file 012, index 69 -> file 080
        const currentFrame = (index: number) =>
            `/assets/frames/frame-${String(index + FRAME_OFFSET).padStart(
                3,
                "0",
            )}.webp`;

        // Lấy ảnh từ cache nếu có, nếu chưa thì tạo mới (reuse khi đổi theme).
        const getFrameImage = (index: number): HTMLImageElement => {
            const src = currentFrame(index);
            let img = scrollFrameCache.get(src);
            if (!img) {
                img = new Image();
                scrollFrameCache.set(src, img);
            }
            return img;
        };

        // --- CẤU HÌNH MOBILE ---
        // Kiểm tra mobile để tối ưu
        const isMobile = window.innerWidth < 768;

        const setCanvasSize = () => {
            // FIX #4 (performance): Giới hạn dpr để giảm tải cho drawImage.
            // Render canvas ở độ phân giải thấp hơn (dpr 1) rồi để CSS scale lên
            // lớn hơn rất nhiều so với render full dpr (desktop dpr 2 = ~4x phí).
            // Nguyên nhân lag: mỗi frame scroll đều vẽ lại ảnh fullscreen + smooth
            // "high" trên canvas ~3840px rộng => giảm dpr giúp scroll mượt lại.
            const dpr = Math.min(window.devicePixelRatio || 1, 1);
            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;

            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;

            // FIX #8 (h-full): KHÔNG set CSS width/height nữa -> canvas dùng
            // class `w-full h-full` = 100% của wrapper (100dvh), khớp đúng với
            // overlay. Trước đây set theo window.innerHeight (px) nên nếu 100dvh
            // khác innerHeight (thanh địa chỉ mobile) thì canvas lệch chiều cao
            // với overlay, gây cảm giác overlay không full.
            // context không cần scale theo dpr (dpr = 1).

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.scale(dpr, dpr);
        };
        setCanvasSize();

        const images: HTMLImageElement[] = Array.from(
            { length: frameCount },
            (_, i) => getFrameImage(i + 1),
        );
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

        // Helper Loading Batch (cache-aware: ảnh đã load/decode rồi thì bỏ qua)
        const loadImageBatch = async (start: number, end: number) => {
            const promises = [];
            for (let i = start; i < end && i < frameCount; i++) {
                const img = images[i] ?? getFrameImage(i + 1);
                images[i] = img;
                // Đã cache & decode đủ từ lần trước -> không tải lại
                if (img.complete && img.naturalWidth > 0) continue;
                const p = new Promise<void>((resolve) => {
                    const done = () => {
                        loadedCount++;
                        resolve();
                    };
                    img.onload = done;
                    img.onerror = done;
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
            // FIX #4 (performance): "high" rất tốn CPU/GPU khi vẽ ảnh fullscreen
            // từng frame. "medium" cân bằng chất lượng & tốc độ => scroll mượt hơn.
            context.imageSmoothingQuality = "medium";

            context.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        // --- LOAD / INIT (cache-aware) ---
        // images[] đã lấy từ cache ở trên. Kiểm tra xem tất cả đã load & decode
        // chưa: nếu đã cache từ lần đổi theme trước -> dựng ngay, KHÔNG tải lại.
        const firstImg = images[0];
        const alreadyCached = images.every(
            (img) => img.complete && img.naturalWidth > 0,
        );

        const loadRest = () => {
            (async () => {
                await loadImageBatch(1, 15);
                for (let i = 15; i < frameCount; i += BATCH_SIZE) {
                    await loadImageBatch(i, i + BATCH_SIZE);
                }
            })();
        };

        if (alreadyCached) {
            // Đã load xong trước đó (vd. vừa đổi dark -> light): không tải lại
            render();
            initAnimation();
        } else {
            firstImg.onload = () => {
                loadedCount++;
                render();
                initAnimation();
                loadRest();
            };
            firstImg.src = currentFrame(1);
        }

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
                    end: "+=2200",
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

            // Timeline UI/UX (pin 2200px):
            //   0% - 85% : chuỗi ảnh chạy trên canvas (nền hero hiển thị từ lúc load)
            //  15% - 25% : Intro fade-out + di chuyển lên (y: -80) để lộ cảnh
            //  85% -100% : frame cuối giữ nguyên (OPACITY VẪN 1 — không fade-out)
            //              tới khi hết pin thì About trượt lên thay thế.
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
            // FIX #6: Intro ẩn đi thì lớp phủ cũng fade-out theo (cùng vị trí 1.5),
            // phần snow canvas sau đó hiển thị sạch, không cần overlay nữa.
            if (overlayRef.current) {
                tl.to(
                    overlayRef.current,
                    { opacity: 0, duration: 1, ease: "power2.in" },
                    1.5,
                );
            }
            // GÓP Ý (đã áp dụng): XÓA fade-out container ở cuối timeline
            // => canvas giữ nguyên opacity 1 tới khi hết pin, không còn tạo
            // khoảng trống "đen/trống" giữa hero và About.
            // tl.to(
            //     container,
            //     { opacity: 0, duration: 0.6, ease: "power2.in" },
            //     9.4,
            // );
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
        // FIX #7 (hết gap dưới hero): -mt đặt trên wrapper NGOÀI, còn phần tử
        // được pin (containerRef) là div bên trong. Nhờ vậy top của phần tử pin
        // trùng với top của pin-spacer => hết lệch ~96px khi kết thúc pin,
        // About liền ngay theo, không còn khoảng trống cuộn thừa.
        <section className={isLight ? "-mt-20 sm:-mt-24" : ""}>
            <div
                ref={containerRef}
                className={`relative w-full overflow-hidden ${
                    isLight
                        ? "h-[calc(100vh+5rem)] sm:h-[calc(100vh+6rem)]"
                        : ""
                }`}
            >
                {/* Chỉ hiển thị canvas làm background trong LIGHT MODE */}
                {isLight && (
                    <div className='absolute inset-0 h-full w-full'>
                        {/* FIX #2: Bỏ filter blur khỏi canvas để ảnh sắc nét.
                        opacity: 1 để nền ảnh (chuỗi scroll) hiển thị ngay khi load */}
                        <canvas
                            ref={canvasRef}
                            className='h-full w-full object-cover'
                            style={{
                                pointerEvents: "none",
                                opacity: 1,
                                // FIX #4 (performance): bỏ willChange + translateZ(0).
                                // Canvas bị vẽ lại mỗi frame scroll; ép nó thành layer
                                // GPU riêng (promoted) khiến mỗi lần vẽ phải upload texture
                                // lên GPU => thêm 1 bước tốn phí, gây giật. Để canvas
                                // repaint bình thường sẽ mượt hơn.
                            }}
                        />
                    </div>
                )}

                {/* FIX #2: Overlay gradient (GPU, Tailwind) thay cho drawImage trong render.
                FIX #5: Tăng độ đậm overlay + thêm radial scrim ở giữa để Intro
                đọc rõ hơn trên nền ảnh snow bright. */}
                {isLight && (
                    <div
                        className='pointer-events-none absolute inset-0 z-10 h-full w-full'
                        ref={overlayRef}
                    >
                        {/* Lớp chính: blur nhẹ + nền trắng mờ vừa phải + radial mask */}
                        <div className='absolute inset-0 h-full w-full backdrop-blur-[3px] bg-white/25 [mask-image:radial-gradient(ellipse_75%_70%_at_center,black_35%,transparent_78%)]' />

                        {/* Scrim radial ở giữa (quan trọng nhất) — giúp text đọc rõ trên vùng trung tâm */}
                        <div className='absolute inset-0 h-full w-full bg-[radial-gradient(ellipse_60%_55%_at_center,rgba(255,255,255,0.45)_0%,transparent_70%)]' />

                        {/* Viền trên/dưới rất nhẹ để chuyển tiếp mượt */}
                        <div className='absolute inset-0 h-full w-full bg-gradient-to-b from-slate-100/30 via-transparent to-slate-200/40' />
                    </div>
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
            </div>
        </section>
    );
}
